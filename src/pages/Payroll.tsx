import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { sendNotification, getEmployeeIdsByRole, uniqueRecipients } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Loader2, DollarSign, CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import { PayrollSummary } from '@/components/payroll/PayrollSummary';
import PayrollDetailSheet from '@/components/payroll/PayrollDetailSheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Fragment } from 'react';

const statusStyles: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  paid: { bg: '#EBE6FF', text: '#2B1899' },
};

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

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
];

type PayrollRecord = any;

const Payroll = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const viewerRoles = employee?.roles ?? [];
  const isCeoViewer = viewerRoles.includes('ceo');
  const isHrViewer = !isCeoViewer && viewerRoles.includes('hr_manager');
  const canForgo = isCeoViewer || viewerRoles.includes('finance_manager') || viewerRoles.includes('hr_manager');

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('payroll.selectedMonth') : null;
    return stored ?? String(new Date().getMonth() + 1).padStart(2, '0');
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('payroll.selectedYear') : null;
    return stored ?? String(new Date().getFullYear());
  });

  useEffect(() => {
    sessionStorage.setItem('payroll.selectedMonth', selectedMonth);
    sessionStorage.setItem('payroll.selectedYear', selectedYear);
  }, [selectedMonth, selectedYear]);

  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('payroll.activeTab') : null;
    return stored ?? 'summary';
  });

  useEffect(() => {
    sessionStorage.setItem('payroll.activeTab', activeTab);
  }, [activeTab]);

  const [paidModal, setPaidModal] = useState<PayrollRecord | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [markingPaid, setMarkingPaid] = useState(false);

  const [detailRecord, setDetailRecord] = useState<PayrollRecord | null>(null);

  // TODO: Remove before production
  const [clearStep, setClearStep] = useState<0 | 1 | 2>(0);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [clearing, setClearing] = useState(false);

  const monthYear = `${selectedYear}-${selectedMonth}`;
  const monthLabelFull = `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;

  // TODO: Remove before production
  const handleClearPayroll = async () => {
    if (!companyId) return;
    setClearing(true);
    try {
      // Delete ALL payroll records for this company + month, regardless of status
      const { error } = await supabase
        .from('payroll_records')
        .delete()
        .eq('company_id', companyId)
        .eq('month_year', monthYear);
      if (error) throw error;

      // Reset UI to empty/initial state for the selected month
      setRecords([]);
      setGenerated(false);
      setClearStep(0);
      setClearConfirmText('');
      toast.success(`Payroll data cleared for ${monthLabelFull}`);

      // Refetch to confirm empty state from server
      await fetchExisting();
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear payroll');
    } finally {
      setClearing(false);
    }
  };

  const fetchExisting = useCallback(async () => {
    if (!companyId) return;
    const { data } = await supabase
      .from('payroll_records')
      .select('*, employees!payroll_records_employee_id_fkey(id, full_name, designation, avatar_url, department, employment_type, employee_roles(roles(name)))')
      .eq('company_id', companyId)
      .eq('month_year', monthYear)
      .eq('superseded', false)
      .order('created_at');
    if (data && data.length > 0) {
      setRecords(data);
      setGenerated(true);
    } else {
      setRecords([]);
      setGenerated(false);
    }
  }, [companyId, monthYear]);

  useEffect(() => {
    fetchExisting();
  }, [fetchExisting]);

  const handleMonthYearChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setRecords([]);
    setGenerated(false);
    setTimeout(async () => {
      const my = `${year}-${month}`;
      if (!companyId) return;
      const { data } = await supabase
        .from('payroll_records')
        .select('*, employees!payroll_records_employee_id_fkey(id, full_name, designation, avatar_url, department, employment_type, employee_roles(roles(name)))')
        .eq('company_id', companyId)
        .eq('month_year', my)
        .eq('superseded', false)
        .order('created_at');
      if (data && data.length > 0) {
        setRecords(data);
        setGenerated(true);
      }
    }, 0);
  };

  const handleGenerate = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-payroll', {
        body: { company_id: companyId, month_year: monthYear },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRecords(data.records || []);
      setGenerated(true);
      if (data.skipped_count > 0) {
        toast.info(`${data.skipped_count} approved/paid record(s) were not regenerated`);
      }
      toast.success('Payroll generated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate payroll');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldBlur = async (record: PayrollRecord, field: 'bonus' | 'dinner_expense', value: string) => {
    const numVal = parseFloat(value) || 0;
    if (numVal === Number(record[field])) return;

    const basicSalary = Number(record.basic_salary);
    const allowance = Number(record.allowance);
    const regularOtAmount = Number(record.regular_ot_amount);
    const holidayOtAmount = Number(record.holiday_ot_amount);
    const loanDeduction = Number(record.loan_deduction);
    const bonus = field === 'bonus' ? numVal : Number(record.bonus);
    const dinnerExpense = field === 'dinner_expense' ? numVal : Number(record.dinner_expense);

    const totalSalary = Math.max(0, basicSalary + allowance + regularOtAmount + holidayOtAmount + bonus + dinnerExpense - loanDeduction);
    const finalPayment = Math.ceil(totalSalary / 50) * 50;

    setRecords(prev => prev.map(r =>
      r.id === record.id
        ? { ...r, [field]: numVal, total_salary: totalSalary, final_payment: finalPayment }
        : r
    ));

    const updateData = field === 'bonus'
      ? { bonus: numVal, total_salary: totalSalary, final_payment: finalPayment }
      : { dinner_expense: numVal, total_salary: totalSalary, final_payment: finalPayment };

    const { error } = await supabase
      .from('payroll_records')
      .update(updateData)
      .eq('id', record.id);
    if (error) {
      toast.error('Failed to save');
      fetchExisting();
    }
  };

  const handleToggleForgo = async (record: PayrollRecord, next: boolean) => {
    const basicSalary = Number(record.basic_salary || 0);
    const allowance = Number(record.allowance || 0);
    const rawRegularOt = Number(record.regular_ot_amount || 0);
    const effectiveRegularOt = next ? 0 : rawRegularOt;
    const holidayOtAmount = Number(record.holiday_ot_amount || 0);
    const bonus = Number(record.bonus || 0);
    const dinnerExpense = Number(record.dinner_expense || 0);
    const loanDeduction = Number(record.loan_deduction || 0);

    const totalSalary = Math.max(0, basicSalary + allowance + effectiveRegularOt + holidayOtAmount + bonus + dinnerExpense - loanDeduction);
    const finalPayment = Math.ceil(totalSalary / 50) * 50;

    const prev = records;
    setRecords(p => p.map(r =>
      r.id === record.id
        ? { ...r, forgo_ot: next, total_salary: totalSalary, final_payment: finalPayment }
        : r
    ));

    const { error } = await supabase
      .from('payroll_records')
      .update({ forgo_ot: next, total_salary: totalSalary, final_payment: finalPayment } as any)
      .eq('id', record.id);
    if (error) {
      setRecords(prev);
      toast.error('Failed to update');
    }
  };


  const handleApprove = async () => {
    setApproving(true);
    try {
      const scopedRecords = activeTab === 'all' || activeTab === 'summary'
        ? records
        : records.filter(r => ((r.employees as any)?.department || 'Uncategorized') === activeTab);
      const draftIds = scopedRecords.filter(r => r.status === 'draft').map(r => r.id);
      if (draftIds.length === 0) {
        toast.info('No draft records to approve');
        setApproveOpen(false);
        return;
      }
      const { error } = await supabase
        .from('payroll_records')
        .update({
          status: 'approved',
          approved_by: employee?.employee_id,
          approved_at: new Date().toISOString(),
        })
        .in('id', draftIds);
      if (error) throw error;

      // Send notifications for approved payroll
      const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || selectedMonth;
      const approvedRecords = scopedRecords.filter(r => r.status === 'draft');
      const mgrs = await getEmployeeIdsByRole(companyId!, ['finance_manager', 'ceo']);
      for (const rec of approvedRecords) {
        const empId = rec.employee_id;
        const recipients = uniqueRecipients(empId, mgrs);
        sendNotification({
          companyId: companyId!,
          recipientIds: recipients,
          type: 'payroll_approved',
          title: 'Payroll Approved',
          message: `Your ${monthLabel} ${selectedYear} payroll has been approved.`,
          referenceType: 'payroll',
          referenceId: rec.id,
        });
      }

      toast.success('Payroll approved');
      setApproveOpen(false);
      fetchExisting();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!paidModal) return;
    setMarkingPaid(true);
    try {
      const { error } = await supabase
        .from('payroll_records')
        .update({
          status: 'paid',
          payment_date: format(paymentDate, 'yyyy-MM-dd'),
          payment_method: paymentMethod,
          payment_processed_by: employee?.employee_id,
        })
        .eq('id', paidModal.id);
      if (error) throw error;

      const loanDed = Number(paidModal.loan_deduction);
      if (loanDed > 0) {
        const { data: loans } = await supabase
          .from('loans')
          .select('id, remaining_balance')
          .eq('employee_id', paidModal.employee_id)
          .eq('company_id', companyId!)
          .eq('status', 'active');

        for (const loan of loans || []) {
          const newBalance = Math.max(0, Number(loan.remaining_balance) - Number((loans || []).length > 0 ? loanDed / (loans || []).length : loanDed));
          const updates: any = { remaining_balance: newBalance };
          if (newBalance <= 0) updates.status = 'settled';
          await supabase.from('loans').update(updates).eq('id', loan.id);
        }
      }

      // Send payroll_paid notification
      const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || selectedMonth;
      const mgrs = await getEmployeeIdsByRole(companyId!, ['finance_manager', 'ceo']);
      const recipients = uniqueRecipients(paidModal.employee_id, mgrs);
      sendNotification({
        companyId: companyId!,
        recipientIds: recipients,
        type: 'payroll_paid',
        title: 'Payroll Paid',
        message: `Your ${monthLabel} ${selectedYear} salary has been processed.`,
        referenceType: 'payroll',
        referenceId: paidModal.id,
      });

      toast.success('Marked as paid');
      setPaidModal(null);
      fetchExisting();
    } catch (err: any) {
      toast.error(err.message || 'Failed to mark as paid');
    } finally {
      setMarkingPaid(false);
    }
  };

  // Group records by department
  const grouped = useMemo(() => {
    return records.reduce<Record<string, PayrollRecord[]>>((acc, r) => {
      const dept = (r.employees as any)?.department || 'Uncategorized';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(r);
      return acc;
    }, {});
  }, [records]);

  const departments = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const allSorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const da = ((a.employees as any)?.department || 'Uncategorized');
      const db = ((b.employees as any)?.department || 'Uncategorized');
      if (da !== db) return da.localeCompare(db);
      const na = ((a.employees as any)?.full_name || '');
      const nb = ((b.employees as any)?.full_name || '');
      return na.localeCompare(nb);
    });
  }, [records]);

  const activeRecords = activeTab === 'all' || activeTab === 'summary' ? allSorted : (grouped[activeTab] || []);
  const activeTabLabel = activeTab === 'all' || activeTab === 'summary' ? 'All' : activeTab;
  const hasDraftsInActive = activeTab === 'summary'
    ? false
    : activeRecords.some(r => r.status === 'draft');
  const hasDrafts = records.some(r => r.status === 'draft');
  const allApprovedOrPaid = records.length > 0 && records.every(r => r.status === 'approved' || r.status === 'paid');

  const initials = (name: string) =>
    (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fmtPKR = (n: number) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const groupForTable = (recs: PayrollRecord[]) => {
    const map = new Map<string, PayrollRecord[]>();
    for (const r of recs) {
      const dept = ((r.employees as any)?.department || 'Uncategorized') as string;
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(r);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const renderDeptTable = (recs: PayrollRecord[]) => {
    const groups = groupForTable(recs);
    const colCount = canForgo ? 7 : 6;
    return (
      <div className="overflow-x-auto rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-right hidden md:table-cell">Basic Salary</TableHead>
              <TableHead className="text-right hidden md:table-cell">Fuel Allowance</TableHead>
              <TableHead className="text-right hidden lg:table-cell">OT Amount</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Loan Deduction</TableHead>
              {canForgo && <TableHead className="text-center hidden lg:table-cell">Forgo</TableHead>}
              <TableHead className="text-right">Final Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(([dept, rows]) => {
              const subtotal = rows.reduce((s, r) => {
                const emp = r.employees as any;
                const isCeoEmp = (emp?.employee_roles ?? []).some((er: any) => er?.roles?.name === 'ceo');
                const isDir = emp?.employment_type === 'director';
                const hide = isHrViewer && (isCeoEmp || isDir);
                return s + (hide ? 0 : Number(r.final_payment || 0));
              }, 0);
              return (
                <Fragment key={dept}>
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableCell colSpan={colCount} className="p-0 border-b-0">
                      <div
                        className="flex items-center gap-2 h-9 pl-4 pr-4"
                        style={{ backgroundColor: 'rgba(91, 63, 248, 0.08)', borderLeft: '3px solid #5B3FF8' }}
                      >
                        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 600, color: '#5B3FF8' }}>
                          {dept}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(91, 63, 248, 0.12)', color: '#5B3FF8',
                          fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                        }}>
                          {rows.length} {rows.length === 1 ? 'employee' : 'employees'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {rows.map(rec => {
                    const emp = rec.employees as any;
                    const isDirector = emp?.employment_type === 'director';
                    const isCeoEmp = (emp?.employee_roles ?? []).some((er: any) => er?.roles?.name === 'ceo');
                    const hideSalary = isHrViewer && (isCeoEmp || isDirector);
                    const masked = <span className="text-muted-foreground">—</span>;
                    const otAmount = Number(rec.regular_ot_amount || 0) + Number(rec.holiday_ot_amount || 0);
                    const loan = Number(rec.loan_deduction || 0);
                    const negativeRegOt = Number(rec.regular_ot_amount || 0) < 0;
                    const canShowForgo = canForgo && rec.status === 'draft' && negativeRegOt;
                    const forgoOn = !!rec.forgo_ot;
                    return (
                      <TableRow
                        key={rec.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                        style={forgoOn ? { backgroundColor: 'rgba(29, 201, 122, 0.06)' } : undefined}
                        onClick={() => setDetailRecord(rec)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={emp?.avatar_url || ''} />
                              <AvatarFallback className="text-[10px] bg-secondary">
                                {initials(emp?.full_name || '—')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{emp?.full_name || '—'}</p>
                              {emp?.designation && (
                                <p className="text-xs text-muted-foreground truncate">{emp.designation}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                          {hideSalary ? masked : fmtPKR(Number(rec.basic_salary))}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                          {hideSalary ? masked : fmtPKR(Number(rec.allowance))}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm hidden lg:table-cell">
                          {hideSalary ? masked : isDirector ? '—' : fmtPKR(otAmount)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm hidden lg:table-cell">
                          {hideSalary ? masked : loan > 0 ? fmtPKR(loan) : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        {canForgo && (
                          <TableCell className="text-center hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                            {canShowForgo ? (
                              <div className="flex items-center justify-center gap-2">
                                <Switch
                                  checked={forgoOn}
                                  onCheckedChange={(v) => handleToggleForgo(rec, v)}
                                  aria-label="Forgo deduction"
                                />
                                <span className="text-[11px] text-muted-foreground">Forgo deduction</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right font-mono text-sm font-semibold" style={{ color: hideSalary ? undefined : '#5B3FF8' }}>
                          {hideSalary ? masked : fmtPKR(Number(rec.final_payment))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={colCount - 1} className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {dept} Subtotal
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold" style={{ color: '#5B3FF8' }}>
                      {fmtPKR(subtotal)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );

  };


  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Month/Year selector + Generate */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:flex-wrap">
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={m => handleMonthYearChange(m, selectedYear)}>
            <SelectTrigger className="flex-1 sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={y => handleMonthYearChange(selectedMonth, y)}>
            <SelectTrigger className="flex-1 sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
            Generate Payroll
          </Button>
          {/* TODO: Remove before production */}
          {isCeoViewer && (
            <Button
              type="button"
              onClick={() => { setClearStep(1); setClearConfirmText(''); }}
              className="bg-white hover:bg-red-50 text-[#991B1B] hover:text-[#991B1B] rounded-[10px] h-10 px-4 w-full sm:w-auto"
              style={{ border: '1px solid rgba(232, 69, 69, 0.3)' }}
            >
              Clear Payroll Data
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && !generated && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <DollarSign className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No payroll data</p>
          <p className="text-sm mt-1">Select a month and click "Generate Payroll" to start.</p>
        </div>
      )}

      {!loading && generated && departments.length > 0 && (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start overflow-x-auto flex-nowrap" style={{ borderColor: 'hsl(var(--border))' }}>
              <TabsTrigger
                value="summary"
                className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                All
                <span className="ml-1.5 text-xs opacity-60">({records.length})</span>
              </TabsTrigger>
              {departments.map(dept => (
                <TabsTrigger
                  key={dept}
                  value={dept}
                  className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                  style={{ fontFamily: 'var(--ff-body)' }}
                >
                  {dept}
                  <span className="ml-1.5 text-xs opacity-60">({grouped[dept].length})</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="summary">
              <PayrollSummary
                companyId={companyId!}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                records={records}
              />
            </TabsContent>
            <TabsContent value="all">
              {renderDeptTable(allSorted)}
            </TabsContent>
            {departments.map(dept => (
              <TabsContent key={dept} value={dept}>
                {renderDeptTable(grouped[dept])}
              </TabsContent>
            ))}
          </Tabs>

          {hasDrafts && (
            <div className="flex justify-end">
              <Button onClick={() => setApproveOpen(true)} className="px-6" disabled={!hasDraftsInActive}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve {activeTabLabel} Payroll
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Approve confirmation */}
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve {activeTabLabel} Payroll</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve all draft payroll records for {activeTab === 'all' ? 'all employees' : activeTab} for {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}.
              Records will become read-only. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={approving}>
              {approving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark Paid modal */}
      <Dialog open={!!paidModal} onOpenChange={open => { if (!open) setPaidModal(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Paid</DialogTitle>
            <DialogDescription>
              Record payment for {(paidModal?.employees as any)?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Payment Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full mt-1 justify-start text-left font-normal", !paymentDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentDate ? formatDate(paymentDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={d => d && setPaymentDate(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(pm => (
                    <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaidModal(null)}>Cancel</Button>
            <Button onClick={handleMarkPaid} disabled={markingPaid}>
              {markingPaid && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TODO: Remove before production — Clear Payroll Data confirmation */}
      <Dialog open={clearStep > 0} onOpenChange={open => { if (!open) { setClearStep(0); setClearConfirmText(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear Payroll Data?</DialogTitle>
            <DialogDescription>
              This will permanently delete ALL payroll records for {monthLabelFull}. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {clearStep === 2 && (
            <div className="py-2">
              <label className="text-sm font-medium">Type DELETE to confirm</label>
              <Input
                autoFocus
                value={clearConfirmText}
                onChange={e => setClearConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-1"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setClearStep(0); setClearConfirmText(''); }}>
              Cancel
            </Button>
            {clearStep === 1 ? (
              <Button variant="destructive" onClick={() => setClearStep(2)}>
                Yes, Delete
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleClearPayroll}
                disabled={clearConfirmText !== 'DELETE' || clearing}
              >
                {clearing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Clear Payroll
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PayrollDetailSheet
        record={detailRecord}
        open={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        monthLabel={monthLabelFull}
        hideSalary={(() => {
          if (!detailRecord) return false;
          const emp = (detailRecord.employees as any);
          const isCeoEmp = (emp?.employee_roles ?? []).some((er: any) => er?.roles?.name === 'ceo');
          const isDir = emp?.employment_type === 'director';
          return isHrViewer && (isCeoEmp || isDir);
        })()}
      />
    </div>
  );
};

export default Payroll;
