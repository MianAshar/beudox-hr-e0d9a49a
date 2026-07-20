import { useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Printer, Pencil, FileSpreadsheet, Plus, Trash2, Upload, FileText, X, ExternalLink, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { FinanceSummary } from '@/components/finance/FinanceSummary';

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

const fmtPKR = (v: number) => `PKR ${v.toLocaleString()}`;

const FinanceSheet = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const isCeo = (employee?.roles || []).includes('ceo');
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const monthYear = `${selectedYear}-${selectedMonth}`;
  const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || '';

  // Edit modal state
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  // One-time line items added in the modal
  type OneTimeItem = { tempId: string; description: string; amount: string; existingId?: string; receiptUrl?: string | null };
  const [oneTimeItems, setOneTimeItems] = useState<OneTimeItem[]>([]);
  // Receipt URLs for recurring items: keyed by line_item_id
  const [editReceipts, setEditReceipts] = useState<Record<string, string | null>>({});
  const [uploadingReceipt, setUploadingReceipt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadTarget, setPendingUploadTarget] = useState<{ type: 'recurring' | 'onetime'; id: string } | null>(null);

  // ─── PAYROLL DATA ───
  const { data: payrollData, isLoading: payrollLoading } = useQuery({
    queryKey: ['finance-payroll', companyId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*, employee:employees!payroll_records_employee_id_fkey(full_name, department, employment_type)')
        .eq('company_id', companyId!)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .order('created_at');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // ─── EXPENSE CATEGORIES + LINE ITEMS ───
  const { data: categories } = useQuery({
    queryKey: ['expense-categories', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('id, name, display_order')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: lineItems } = useQuery({
    queryKey: ['expense-line-items', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_line_items')
        .select('id, category_id, description, is_recurring, display_order')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // ─── MONTHLY EXPENSES DATA ───
  const { data: monthlyExpenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['monthly-expenses', companyId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_expenses')
        .select('*')
        .eq('company_id', companyId!)
        .eq('month_year', monthYear);
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // ─── GROUP PAYROLL BY DEPARTMENT ───
  const payrollByDept: Record<string, any[]> = {};
  (payrollData || []).forEach((rec: any) => {
    const dept = rec.employee?.department || 'Unassigned';
    if (!payrollByDept[dept]) payrollByDept[dept] = [];
    payrollByDept[dept].push(rec);
  });
  const departments = Object.keys(payrollByDept).sort();

  const deptSubtotal = (records: any[]) =>
    records.reduce((sum, r) => sum + Number(r.final_payment || 0), 0);
  const payrollGrandTotal = (payrollData || []).reduce(
    (sum: number, r: any) => sum + Number(r.final_payment || 0), 0
  );

  // ─── EXPENSE HELPERS ───
  const getExpenseAmount = (lineItemId: string) => {
    const row = (monthlyExpenses || []).find((e: any) => e.line_item_id === lineItemId);
    return row ? Number(row.amount) : 0;
  };

  // Get one-time expenses for a category (line_item_id is null)
  const getOneTimeExpenses = (categoryId: string) => {
    return (monthlyExpenses || []).filter((e: any) => e.category_id === categoryId && !e.line_item_id);
  };

  const getCategoryTotal = (categoryId: string) => {
    const items = (lineItems || []).filter(li => li.category_id === categoryId);
    const recurringTotal = items.reduce((sum, li) => sum + getExpenseAmount(li.id), 0);
    const oneTimeTotal = getOneTimeExpenses(categoryId).reduce((sum, e: any) => sum + Number(e.amount), 0);
    return recurringTotal + oneTimeTotal;
  };

  // ─── BD CATEGORY DETECTION ───
  const bdCategory = (categories || []).find(c => c.name.toLowerCase().includes('bd expense'));
  const bdCategoryId = bdCategory?.id;
  const nonBdCategories = (categories || []).filter(c => c.id !== bdCategoryId);

  const expensesGrandTotal = nonBdCategories.reduce(
    (sum, cat) => sum + getCategoryTotal(cat.id), 0
  );
  const bdGrandTotal = bdCategoryId ? getCategoryTotal(bdCategoryId) : 0;

  // ─── EDIT MODAL HANDLERS ───
  const openEditModal = (categoryId: string) => {
    const items = (lineItems || []).filter(li => li.category_id === categoryId);
    const amounts: Record<string, string> = {};
    const receipts: Record<string, string | null> = {};
    items.forEach(li => {
      amounts[li.id] = String(getExpenseAmount(li.id));
      const expRow = (monthlyExpenses || []).find((e: any) => e.line_item_id === li.id);
      receipts[li.id] = expRow?.receipt_url || null;
    });
    setEditAmounts(amounts);
    setEditReceipts(receipts);
    // Load existing one-time items for this category
    const existingOneTime = getOneTimeExpenses(categoryId);
    setOneTimeItems(existingOneTime.map((e: any) => ({
      tempId: e.id,
      description: e.description,
      amount: String(Number(e.amount)),
      existingId: e.id,
      receiptUrl: e.receipt_url || null,
    })));
    setEditCategoryId(categoryId);
  };

  const handleSaveExpenses = useCallback(async () => {
    if (!editCategoryId || !companyId) return;
    setSaving(true);
    const items = (lineItems || []).filter(li => li.category_id === editCategoryId);

    try {
      // Save recurring line item amounts
      for (const li of items) {
        const amount = Math.max(0, parseFloat(editAmounts[li.id] || '0') || 0);
        const existing = (monthlyExpenses || []).find((e: any) => e.line_item_id === li.id);

        if (existing) {
          const receiptUrl = editReceipts[li.id] !== undefined ? editReceipts[li.id] : existing.receipt_url;
          if (Number(existing.amount) === amount && existing.receipt_url === receiptUrl) continue;
          const { error } = await supabase
            .from('monthly_expenses')
            .update({ amount, receipt_url: receiptUrl, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .eq('company_id', companyId);
          if (error) throw error;
        } else {
          if (amount === 0) continue;
          const { error } = await supabase
            .from('monthly_expenses')
            .insert({
              company_id: companyId,
              month_year: monthYear,
              line_item_id: li.id,
              category_id: editCategoryId,
              description: li.description,
              amount,
              receipt_url: editReceipts[li.id] || null,
            });
          if (error) throw error;
        }
      }

      // Delete removed one-time items
      const currentOneTimeIds = oneTimeItems.filter(ot => ot.existingId).map(ot => ot.existingId!);
      const previousOneTime = getOneTimeExpenses(editCategoryId);
      for (const prev of previousOneTime) {
        if (!currentOneTimeIds.includes(prev.id)) {
          const { error } = await supabase
            .from('monthly_expenses')
            .delete()
            .eq('id', prev.id)
            .eq('company_id', companyId);
          if (error) throw error;
        }
      }

      // Save one-time items (update existing, insert new)
      for (const ot of oneTimeItems) {
        const amount = Math.max(0, parseFloat(ot.amount || '0') || 0);
        const desc = ot.description.trim();
        if (!desc && amount === 0) continue;

        if (ot.existingId) {
          const { error } = await supabase
            .from('monthly_expenses')
            .update({ description: desc || 'Untitled', amount, receipt_url: ot.receiptUrl || null, updated_at: new Date().toISOString() })
            .eq('id', ot.existingId)
            .eq('company_id', companyId);
          if (error) throw error;
        } else {
          if (amount === 0 && !desc) continue;
          const { error } = await supabase
            .from('monthly_expenses')
            .insert({
              company_id: companyId,
              month_year: monthYear,
              line_item_id: null,
              category_id: editCategoryId,
              description: desc || 'Untitled',
              amount,
              receipt_url: ot.receiptUrl || null,
            });
          if (error) throw error;
        }
      }

      await qc.invalidateQueries({ queryKey: ['monthly-expenses', companyId, monthYear] });
      toast.success('Expenses saved');
      setEditCategoryId(null);
      setOneTimeItems([]);
    } catch {
      toast.error('Failed to save expenses');
    } finally {
      setSaving(false);
    }
  }, [editCategoryId, editAmounts, lineItems, monthlyExpenses, companyId, monthYear, qc, oneTimeItems]);

  const addOneTimeItem = () => {
    setOneTimeItems(prev => [...prev, { tempId: crypto.randomUUID(), description: '', amount: '0', receiptUrl: null }]);
  };

  const removeOneTimeItem = (tempId: string) => {
    setOneTimeItems(prev => prev.filter(i => i.tempId !== tempId));
  };

  const editCategory = (categories || []).find(c => c.id === editCategoryId);
  const editLineItems = editCategoryId ? (lineItems || []).filter(li => li.category_id === editCategoryId) : [];

  // ─── IMAGE COMPRESSION ───
  const compressImage = (file: File, maxDim = 1200, quality = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Compression failed')),
          'image/jpeg',
          quality,
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // ─── RECEIPT UPLOAD / DELETE ───
  const triggerReceiptUpload = (type: 'recurring' | 'onetime', id: string) => {
    setPendingUploadTarget({ type, id });
    fileInputRef.current?.click();
  };

  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingUploadTarget || !companyId || !editCategoryId) return;
    const { type, id } = pendingUploadTarget;
    setPendingUploadTarget(null);
    e.target.value = '';

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP, or PDF files are allowed');
      return;
    }

    setUploadingReceipt(id);
    try {
      const isImage = file.type.startsWith('image/');
      let uploadBlob: Blob | File = file;
      let ext = 'jpg';

      if (isImage && file.size > 300 * 1024) {
        uploadBlob = await compressImage(file);
        ext = 'jpg'; // always jpeg after compression
      } else if (isImage) {
        ext = file.name.split('.').pop() || 'jpg';
      } else {
        ext = 'pdf';
      }

      const safeName = type === 'recurring' ? id : id.replace(/[^a-zA-Z0-9-_]/g, '_');
      const filePath = `${companyId}/${monthYear}/${safeName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('expense-receipts')
        .upload(filePath, uploadBlob, { upsert: true, contentType: isImage ? 'image/jpeg' : 'application/pdf' });
      if (uploadError) throw uploadError;

      // Get signed URL (private bucket)
      const { data: signedData, error: signedError } = await supabase.storage
        .from('expense-receipts')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
      if (signedError) throw signedError;
      const url = signedData.signedUrl;

      // Save to DB immediately if expense record exists
      if (type === 'recurring') {
        const existing = (monthlyExpenses || []).find((ex: any) => ex.line_item_id === id);
        if (existing) {
          await supabase.from('monthly_expenses').update({ receipt_url: url }).eq('id', existing.id);
        }
        setEditReceipts(prev => ({ ...prev, [id]: url }));
      } else {
        const ot = oneTimeItems.find(i => i.tempId === id);
        if (ot?.existingId) {
          await supabase.from('monthly_expenses').update({ receipt_url: url }).eq('id', ot.existingId);
        }
        setOneTimeItems(prev => prev.map(i => i.tempId === id ? { ...i, receiptUrl: url } : i));
      }
      await qc.invalidateQueries({ queryKey: ['monthly-expenses', companyId, monthYear] });
      toast.success('Receipt uploaded');
    } catch {
      toast.error('Failed to upload receipt');
    } finally {
      setUploadingReceipt(null);
    }
  };

  const removeReceipt = async (type: 'recurring' | 'onetime', id: string, currentUrl: string) => {
    if (!companyId) return;
    setUploadingReceipt(id);
    try {
      // Extract file path from signed URL
      const bucketPath = currentUrl.split('/expense-receipts/')[1]?.split('?')[0];
      if (bucketPath) {
        await supabase.storage.from('expense-receipts').remove([decodeURIComponent(bucketPath)]);
      }
      if (type === 'recurring') {
        const existing = (monthlyExpenses || []).find((ex: any) => ex.line_item_id === id);
        if (existing) {
          await supabase.from('monthly_expenses').update({ receipt_url: null }).eq('id', existing.id);
        }
        setEditReceipts(prev => ({ ...prev, [id]: null }));
      } else {
        const ot = oneTimeItems.find(i => i.tempId === id);
        if (ot?.existingId) {
          await supabase.from('monthly_expenses').update({ receipt_url: null }).eq('id', ot.existingId);
        }
        setOneTimeItems(prev => prev.map(i => i.tempId === id ? { ...i, receiptUrl: null } : i));
      }
      await qc.invalidateQueries({ queryKey: ['monthly-expenses', companyId, monthYear] });
      toast.success('Receipt removed');
    } catch {
      toast.error('Failed to remove receipt');
    } finally {
      setUploadingReceipt(null);
    }
  };

  const isImageUrl = (url: string) => /\.(jpe?g|png|webp)/i.test(url.split('?')[0]);

  const ReceiptIndicator = ({ url, type, id }: { url: string | null | undefined; type: 'recurring' | 'onetime'; id: string }) => {
    const isUploading = uploadingReceipt === id;
    if (isUploading) {
      return <div className="h-9 w-9 flex items-center justify-center"><div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    }
    if (url) {
      return (
        <div className="flex items-center gap-1 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted" title="View receipt">
            {isImageUrl(url) ? (
              <img src={url} alt="Receipt" className="h-7 w-7 object-cover rounded" />
            ) : (
              <FileText className="h-4 w-4 text-primary" />
            )}
          </a>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Remove receipt" onClick={() => removeReceipt(type, id, url)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary" title="Upload receipt" onClick={() => triggerReceiptUpload(type, id)}>
        <Upload className="h-4 w-4" />
      </Button>
    );
  };

  // ─── EXCEL EXPORT ───
  const handleExportExcel = useCallback(() => {
    const rows: any[][] = [];
    const boldRows: number[] = [];

    // Payroll header
    const payrollHeaders = ['Employee', 'Basic', 'Allowance', 'OT Hrs', 'OT Amt', 'Bonus', 'Dinner', 'Loan Ded.', 'Final Pmt'];
    boldRows.push(rows.length);
    rows.push(['PAYROLL SUMMARY']);
    rows.push(payrollHeaders);
    boldRows.push(rows.length - 1);

    departments.forEach(dept => {
      boldRows.push(rows.length);
      rows.push([dept, '', '', '', '', '', '', '', '']);
      const records = payrollByDept[dept];
      records.forEach((r: any) => {
        rows.push([
          r.employee?.full_name || '',
          Number(r.basic_salary) || 0,
          Number(r.allowance) || 0,
          Number((Number(r.regular_ot_hours) + Number(r.holiday_ot_hours)).toFixed(1)),
          Number(r.regular_ot_amount) + Number(r.holiday_ot_amount),
          Number(r.bonus) || 0,
          Number(r.dinner_expense) || 0,
          Number(r.loan_deduction) || 0,
          Number(r.final_payment) || 0,
        ]);
      });
      boldRows.push(rows.length);
      rows.push([`${dept} Subtotal`, '', '', '', '', '', '', '', deptSubtotal(records)]);
    });

    boldRows.push(rows.length);
    rows.push(['Total Payroll', '', '', '', '', '', '', '', payrollGrandTotal]);
    rows.push([]); // blank row

    // Expenses header
    boldRows.push(rows.length);
    rows.push(['EXPENSES SUMMARY']);
    rows.push(['Description', 'Amount (PKR)']);
    boldRows.push(rows.length - 1);

    const exportCategories = (categories || []).filter(c => c.id !== bdCategoryId);
    exportCategories.forEach(cat => {
      boldRows.push(rows.length);
      rows.push([cat.name, '']);
      const items = (lineItems || []).filter(li => li.category_id === cat.id);
      items.forEach(li => {
        rows.push([li.description, getExpenseAmount(li.id)]);
      });
      // One-time items
      getOneTimeExpenses(cat.id).forEach((ot: any) => {
        rows.push([ot.description, Number(ot.amount)]);
      });
      boldRows.push(rows.length);
      rows.push([`${cat.name} Subtotal`, getCategoryTotal(cat.id)]);
    });

    boldRows.push(rows.length);
    rows.push(['Total Expenses', expensesGrandTotal]);
    rows.push([]);

    // BD Expenses section (CEO only)
    if (isCeo && bdCategory) {
      boldRows.push(rows.length);
      rows.push(['BD EXPENSES']);
      rows.push(['Description', 'Amount (PKR)']);
      boldRows.push(rows.length - 1);
      const bdItems = (lineItems || []).filter(li => li.category_id === bdCategory.id);
      bdItems.forEach(li => {
        rows.push([li.description, getExpenseAmount(li.id)]);
      });
      getOneTimeExpenses(bdCategory.id).forEach((ot: any) => {
        rows.push([ot.description, Number(ot.amount)]);
      });
      boldRows.push(rows.length);
      rows.push(['Total BD Expenses', bdGrandTotal]);
      rows.push([]);
    }

    boldRows.push(rows.length);
    rows.push(['Grand Total (Payroll + Expenses)', '', '', '', '', '', '', '', payrollGrandTotal + expensesGrandTotal]);

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Bold formatting
    boldRows.forEach(r => {
      const row = rows[r];
      if (!row) return;
      for (let c = 0; c < row.length; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (ws[addr]) {
          if (!ws[addr].s) ws[addr].s = {};
          ws[addr].s.font = { bold: true };
        }
      }
    });

    // Column widths
    ws['!cols'] = [
      { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Finance Sheet - ${monthLabel} ${selectedYear}`);
    XLSX.writeFile(wb, `Finance_Sheet_${monthLabel}_${selectedYear}.xlsx`);
  }, [departments, payrollByDept, payrollGrandTotal, categories, lineItems, monthlyExpenses, monthLabel, selectedYear, expensesGrandTotal]);

  const [activeTab, setActiveTab] = useState('summary');
  const isLoading = payrollLoading || expensesLoading;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 12mm; }
          body * { visibility: hidden !important; }
          #finance-sheet-print, #finance-sheet-print * { visibility: visible !important; }
          #finance-sheet-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            font-size: 10px !important;
          }
          .no-print { display: none !important; }
          #finance-sheet-print table {
            font-size: 10px !important;
            page-break-inside: auto !important;
          }
          #finance-sheet-print table tr {
            page-break-inside: avoid !important;
          }
          #finance-sheet-print .fs-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #finance-sheet-print th { background: #1A1240 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-subtotal-row { background: #F6F5FF !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-grand-row { background: #5B3FF8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-total-row { background: #1A1240 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-print-header { display: block !important; visibility: visible !important; }
          #finance-sheet-print .fs-grand-total-bar {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:flex-wrap no-print">
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="flex-1 sm:w-[160px] sm:flex-initial"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="flex-1 sm:w-[120px] sm:flex-initial"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="w-full sm:w-auto">
              <Printer className="h-4 w-4 mr-2" /> Export as PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="w-full sm:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as Excel
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start overflow-x-auto flex-nowrap no-print" style={{ borderColor: 'hsl(var(--border))' }}>
            {[
              { value: 'summary', label: 'Summary' },
              { value: 'payroll', label: 'Payroll' },
              { value: 'expenses', label: 'Expenses' },
              ...(isCeo ? [{ value: 'bd', label: 'BD Expenses' }] : []),
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Summary tab */}
          <TabsContent value="summary" className="mt-4">
            {companyId && (
              <FinanceSummary
                companyId={companyId}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            )}
          </TabsContent>

          {isLoading ? (
            <div className="space-y-3 pt-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div id="finance-sheet-print">
              {/* Print header */}
              <div className="hidden fs-print-header mb-4 text-center">
                {employee?.company_logo_url && (
                  <img src={employee.company_logo_url} alt="Logo" className="h-10 mx-auto mb-2" style={{ maxWidth: 140 }} />
                )}
                <div className="text-sm font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{employee?.company_name}</div>
                <div className="text-lg font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#5B3FF8' }}>
                  Finance Sheet — {monthLabel} {selectedYear}
                </div>
                <hr className="mt-2 mb-4" style={{ borderColor: '#5B3FF8', borderWidth: 2 }} />
              </div>

              {/* ═══ PAYROLL TAB ═══ */}
              <TabsContent value="payroll" className="mt-4">
                <div className="fs-section">
                   <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead className="text-right">Basic</TableHead>
                          <TableHead className="text-right">Allowance</TableHead>
                          <TableHead className="text-right">OT Hrs</TableHead>
                          <TableHead className="text-right">OT Amt</TableHead>
                          <TableHead className="text-right">Bonus</TableHead>
                          <TableHead className="text-right">Dinner</TableHead>
                          <TableHead className="text-right">Loan Ded.</TableHead>
                          <TableHead className="text-right">Final Pmt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map(dept => {
                          const records = payrollByDept[dept];
                          const subtotal = deptSubtotal(records);
                          return (
                            <> 
                              <TableRow key={`dept-${dept}`}>
                                <TableCell colSpan={9} className="py-2 font-semibold text-[12px] uppercase tracking-wider"
                                  style={{ background: 'hsl(var(--muted))', fontFamily: 'var(--ff-display)' }}>
                                  {dept}
                                </TableCell>
                              </TableRow>
                              {records.map((r: any) => (
                                <TableRow key={r.id}>
                                  <TableCell className="text-[13px] font-medium" style={{ fontFamily: 'var(--ff-body)' }}>
                                    {r.employee?.full_name}
                                  </TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">{Number(r.basic_salary).toLocaleString()}</TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">{Number(r.allowance).toLocaleString()}</TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">
                                    {(Number(r.regular_ot_hours) + Number(r.holiday_ot_hours)).toFixed(1)}
                                  </TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">
                                    {(Number(r.regular_ot_amount) + Number(r.holiday_ot_amount)).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">{Number(r.bonus).toLocaleString()}</TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">{Number(r.dinner_expense).toLocaleString()}</TableCell>
                                  <TableCell className="text-right text-[12px] font-mono">{Number(r.loan_deduction).toLocaleString()}</TableCell>
                                  <TableCell className="text-right text-[12px] font-mono font-semibold">{Number(r.final_payment).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow key={`sub-${dept}`} className="fs-subtotal-row" style={{ background: '#F6F5FF' }}>
                                <TableCell colSpan={8} className="text-right text-[12px] font-semibold" style={{ fontFamily: 'var(--ff-body)' }}>
                                  {dept} Subtotal
                                </TableCell>
                                <TableCell className="text-right text-[13px] font-bold font-mono">{subtotal.toLocaleString()}</TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                        <TableRow className="fs-grand-row" style={{ background: '#5B3FF8' }}>
                          <TableCell colSpan={8} className="text-right text-[13px] font-bold text-white" style={{ fontFamily: 'var(--ff-display)' }}>
                            Total Payroll
                          </TableCell>
                          <TableCell className="text-right text-[14px] font-bold font-mono text-white">
                            {fmtPKR(payrollGrandTotal)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* ═══ EXPENSES TAB ═══ */}
              <TabsContent value="expenses" className="mt-4">
                <div className="fs-section">
                  <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right w-[180px]">Amount (PKR)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nonBdCategories.map(cat => {
                          const items = (lineItems || []).filter(li => li.category_id === cat.id);
                          const catTotal = getCategoryTotal(cat.id);
                          return (
                            <>
                              <TableRow key={`cat-${cat.id}`}>
                                <TableCell colSpan={2} className="py-2"
                                  style={{ background: 'hsl(var(--muted))' }}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[12px] uppercase tracking-wider" style={{ fontFamily: 'var(--ff-display)' }}>
                                      {cat.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs no-print"
                                      onClick={() => openEditModal(cat.id)}
                                    >
                                      <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {items.map(li => {
                                const expRow = (monthlyExpenses || []).find((e: any) => e.line_item_id === li.id);
                                const receiptUrl = expRow?.receipt_url;
                                return (
                                  <TableRow key={li.id}>
                                    <TableCell className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>
                                      {li.description}
                                    </TableCell>
                                    <TableCell className="text-right text-[12px] font-mono">
                                      <span className="inline-flex items-center gap-1.5 justify-end">
                                        {getExpenseAmount(li.id).toLocaleString()}
                                        {receiptUrl && (
                                          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-primary" title="View receipt">
                                            {isImageUrl(receiptUrl) ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                          </a>
                                        )}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {getOneTimeExpenses(cat.id).map((ot: any) => {
                                const receiptUrl = ot.receipt_url;
                                return (
                                  <TableRow key={ot.id}>
                                    <TableCell className="text-[13px] italic" style={{ fontFamily: 'var(--ff-body)' }}>
                                      {ot.description}
                                    </TableCell>
                                    <TableCell className="text-right text-[12px] font-mono">
                                      <span className="inline-flex items-center gap-1.5 justify-end">
                                        {Number(ot.amount).toLocaleString()}
                                        {receiptUrl && (
                                          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-primary" title="View receipt">
                                            {isImageUrl(receiptUrl) ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                          </a>
                                        )}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow key={`catsub-${cat.id}`} className="fs-subtotal-row" style={{ background: '#F6F5FF' }}>
                                <TableCell className="text-right text-[12px] font-semibold" style={{ fontFamily: 'var(--ff-body)' }}>
                                  {cat.name} Subtotal
                                </TableCell>
                                <TableCell className="text-right text-[13px] font-bold font-mono">
                                  {catTotal.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                        <TableRow className="fs-grand-row" style={{ background: '#5B3FF8' }}>
                          <TableCell className="text-right text-[13px] font-bold text-white" style={{ fontFamily: 'var(--ff-display)' }}>
                            Total Expenses
                          </TableCell>
                          <TableCell className="text-right text-[14px] font-bold font-mono text-white">
                            {fmtPKR(expensesGrandTotal)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* ═══ BD EXPENSES TAB (CEO only) ═══ */}
              {isCeo && (
                <TabsContent value="bd" className="mt-4">
                  <div className="fs-section">
                    <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right w-[180px]">Amount (PKR)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!bdCategory ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-sm text-muted-foreground py-8">
                                No BD Expenses category found. Create one in Settings → Expense Categories.
                              </TableCell>
                            </TableRow>
                          ) : (
                            <>
                              <TableRow>
                                <TableCell colSpan={2} className="py-2" style={{ background: 'hsl(var(--muted))' }}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[12px] uppercase tracking-wider" style={{ fontFamily: 'var(--ff-display)' }}>
                                      {bdCategory.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs no-print"
                                      onClick={() => openEditModal(bdCategory.id)}
                                    >
                                      <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {(lineItems || []).filter(li => li.category_id === bdCategory.id).map(li => {
                                const expRow = (monthlyExpenses || []).find((e: any) => e.line_item_id === li.id);
                                const receiptUrl = expRow?.receipt_url;
                                return (
                                  <TableRow key={li.id}>
                                    <TableCell className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>
                                      {li.description}
                                    </TableCell>
                                    <TableCell className="text-right text-[12px] font-mono">
                                      <span className="inline-flex items-center gap-1.5 justify-end">
                                        {getExpenseAmount(li.id).toLocaleString()}
                                        {receiptUrl && (
                                          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-primary" title="View receipt">
                                            {isImageUrl(receiptUrl) ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                          </a>
                                        )}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {getOneTimeExpenses(bdCategory.id).map((ot: any) => {
                                const receiptUrl = ot.receipt_url;
                                return (
                                  <TableRow key={ot.id}>
                                    <TableCell className="text-[13px] italic" style={{ fontFamily: 'var(--ff-body)' }}>
                                      {ot.description}
                                    </TableCell>
                                    <TableCell className="text-right text-[12px] font-mono">
                                      <span className="inline-flex items-center gap-1.5 justify-end">
                                        {Number(ot.amount).toLocaleString()}
                                        {receiptUrl && (
                                          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-primary" title="View receipt">
                                            {isImageUrl(receiptUrl) ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                          </a>
                                        )}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow className="fs-grand-row" style={{ background: '#5B3FF8' }}>
                                <TableCell className="text-right text-[13px] font-bold text-white" style={{ fontFamily: 'var(--ff-display)' }}>
                                  Total BD Expenses
                                </TableCell>
                                <TableCell className="text-right text-[14px] font-bold font-mono text-white">
                                  {fmtPKR(bdGrandTotal)}
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              )}

              {/* ═══ GRAND TOTAL (hidden on Summary tab) ═══ */}
              {activeTab !== 'summary' && activeTab !== 'bd' && (
                <div className="rounded-[14px] overflow-hidden fs-grand-total-bar mt-6" style={{ background: '#1A1240' }}>
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'var(--ff-display)' }}>
                      Grand Total (Payroll + Expenses)
                    </span>
                    <span className="text-[20px] font-bold font-mono text-white">
                      {fmtPKR(payrollGrandTotal + expensesGrandTotal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {/* Hidden file input for receipt uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleReceiptFileChange}
      />

      {/* ─── EDIT EXPENSES MODAL ─── */}
      <Dialog open={!!editCategoryId} onOpenChange={open => { if (!open) setEditCategoryId(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {editCategory?.name} — {monthLabel} {selectedYear}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {/* Recurring line items */}
            {editLineItems.map(li => (
              <div key={li.id} className="flex items-center justify-between gap-2">
                <span className="text-sm flex-1 min-w-0 truncate" style={{ fontFamily: 'var(--ff-body)' }}>{li.description}</span>
                <Input
                  type="number"
                  min="0"
                  className="w-[130px] text-right text-sm font-mono h-9"
                  value={editAmounts[li.id] ?? '0'}
                  onChange={e => {
                    const val = e.target.value;
                    setEditAmounts(prev => ({ ...prev, [li.id]: val }));
                  }}
                  onBlur={e => {
                    const num = Math.max(0, parseFloat(e.target.value) || 0);
                    setEditAmounts(prev => ({ ...prev, [li.id]: String(num) }));
                  }}
                />
                <ReceiptIndicator url={editReceipts[li.id]} type="recurring" id={li.id} />
              </div>
            ))}

            {/* One-time items */}
            {oneTimeItems.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">One-time Items</span>
              </div>
            )}
            {oneTimeItems.map(ot => (
              <div key={ot.tempId} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Description"
                  className="flex-1 text-sm h-9"
                  value={ot.description}
                  onChange={e => {
                    const val = e.target.value;
                    setOneTimeItems(prev => prev.map(i => i.tempId === ot.tempId ? { ...i, description: val } : i));
                  }}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-[110px] text-right text-sm font-mono h-9"
                  value={ot.amount}
                  onChange={e => {
                    const val = e.target.value;
                    setOneTimeItems(prev => prev.map(i => i.tempId === ot.tempId ? { ...i, amount: val } : i));
                  }}
                  onBlur={e => {
                    const num = Math.max(0, parseFloat(e.target.value) || 0);
                    setOneTimeItems(prev => prev.map(i => i.tempId === ot.tempId ? { ...i, amount: String(num) } : i));
                  }}
                />
                <ReceiptIndicator url={ot.receiptUrl} type="onetime" id={ot.tempId} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                  onClick={() => removeOneTimeItem(ot.tempId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={addOneTimeItem}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Line Item
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategoryId(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveExpenses} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinanceSheet;
