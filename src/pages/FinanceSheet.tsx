import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Printer, Pencil, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const monthYear = `${selectedYear}-${selectedMonth}`;
  const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || '';

  // Edit modal state
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

  const getCategoryTotal = (categoryId: string) => {
    const items = (lineItems || []).filter(li => li.category_id === categoryId);
    return items.reduce((sum, li) => sum + getExpenseAmount(li.id), 0);
  };

  const expensesGrandTotal = (categories || []).reduce(
    (sum, cat) => sum + getCategoryTotal(cat.id), 0
  );

  // ─── EDIT MODAL HANDLERS ───
  const openEditModal = (categoryId: string) => {
    const items = (lineItems || []).filter(li => li.category_id === categoryId);
    const amounts: Record<string, string> = {};
    items.forEach(li => {
      amounts[li.id] = String(getExpenseAmount(li.id));
    });
    setEditAmounts(amounts);
    setEditCategoryId(categoryId);
  };

  const handleSaveExpenses = useCallback(async () => {
    if (!editCategoryId || !companyId) return;
    setSaving(true);
    const items = (lineItems || []).filter(li => li.category_id === editCategoryId);

    try {
      for (const li of items) {
        const amount = Math.max(0, parseFloat(editAmounts[li.id] || '0') || 0);
        const existing = (monthlyExpenses || []).find((e: any) => e.line_item_id === li.id);

        if (existing) {
          if (Number(existing.amount) === amount) continue;
          const { error } = await supabase
            .from('monthly_expenses')
            .update({ amount, updated_at: new Date().toISOString() })
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
            });
          if (error) throw error;
        }
      }
      await qc.invalidateQueries({ queryKey: ['monthly-expenses', companyId, monthYear] });
      toast.success('Expenses saved');
      setEditCategoryId(null);
    } catch {
      toast.error('Failed to save expenses');
    } finally {
      setSaving(false);
    }
  }, [editCategoryId, editAmounts, lineItems, monthlyExpenses, companyId, monthYear, qc]);

  const editCategory = (categories || []).find(c => c.id === editCategoryId);
  const editLineItems = editCategoryId ? (lineItems || []).filter(li => li.category_id === editCategoryId) : [];

  const isLoading = payrollLoading || expensesLoading;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 16px; }
          body * { visibility: hidden !important; }
          #finance-sheet-print, #finance-sheet-print * { visibility: visible !important; }
          #finance-sheet-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            font-size: 10px !important;
          }
          .no-print { display: none !important; }
          #finance-sheet-print table { font-size: 10px !important; }
          #finance-sheet-print th { background: #1A1240 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-subtotal-row { background: #F6F5FF !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-grand-row { background: #5B3FF8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fs-total-row { background: #1A1240 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .hidden.print\\:!block { display: block !important; visibility: visible !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 no-print">
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print / Export
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div id="finance-sheet-print">
            {/* Print header */}
            <div className="hidden print:!block mb-4 text-center">
              {employee?.company_logo_url && (
                <img src={employee.company_logo_url} alt="Logo" className="h-10 mx-auto mb-2" style={{ maxWidth: 140 }} />
              )}
              <div className="text-sm font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{employee?.company_name}</div>
              <div className="text-lg font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#5B3FF8' }}>
                Finance Sheet — {monthLabel} {selectedYear}
              </div>
              <hr className="mt-2 mb-4" style={{ borderColor: '#5B3FF8', borderWidth: 2 }} />
            </div>

            {/* ═══ HALF 1: PAYROLL ═══ */}
            <div className="mb-8">
              <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
                Payroll Summary
              </h2>
              <div className="rounded-[14px] border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
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

            {/* ═══ HALF 2: EXPENSES ═══ */}
            <div className="mb-8">
              <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
                Expenses Summary
              </h2>
              <div className="rounded-[14px] border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right w-[180px]">Amount (PKR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(categories || []).map(cat => {
                      const items = (lineItems || []).filter(li => li.category_id === cat.id);
                      const catTotal = getCategoryTotal(cat.id);
                      return (
                        <>
                          {/* Category header with Edit button */}
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
                          {items.map(li => (
                            <TableRow key={li.id}>
                              <TableCell className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>
                                {li.description}
                              </TableCell>
                              <TableCell className="text-right text-[12px] font-mono">
                                {getExpenseAmount(li.id).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
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

            {/* ═══ GRAND TOTAL ═══ */}
            <div className="rounded-[14px] overflow-hidden" style={{ background: '#1A1240' }}>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'var(--ff-display)' }}>
                  Grand Total (Payroll + Expenses)
                </span>
                <span className="text-[20px] font-bold font-mono text-white">
                  {fmtPKR(payrollGrandTotal + expensesGrandTotal)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── EDIT EXPENSES MODAL ─── */}
      <Dialog open={!!editCategoryId} onOpenChange={open => { if (!open) setEditCategoryId(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editCategory?.name} — {monthLabel} {selectedYear}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {editLineItems.map(li => (
              <div key={li.id} className="flex items-center justify-between gap-4">
                <span className="text-sm flex-1" style={{ fontFamily: 'var(--ff-body)' }}>{li.description}</span>
                <Input
                  type="number"
                  min="0"
                  className="w-[140px] text-right text-sm font-mono h-9"
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
              </div>
            ))}
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
