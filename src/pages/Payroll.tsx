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

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('summary');

  const [paidModal, setPaidModal] = useState<PayrollRecord | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [markingPaid, setMarkingPaid] = useState(false);

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
      const { error } = await supabase
        .from('payroll_records')
        .delete()
        .eq('company_id', companyId)
        .eq('month_year', monthYear);
      if (error) throw error;
      toast.success(`Payroll data cleared for ${monthLabelFull}`);
      setClearStep(0);
      setClearConfirmText('');
      setRecords([]);
      setGenerated(false);
      fetchExisting();
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
      .select('*, employees!payroll_records_employee_id_fkey(id, full_name, department, employment_type, employee_roles(roles(name)))')
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
        .select('*, employees!payroll_records_employee_id_fkey(id, full_name, department, employment_type, employee_roles(roles(name)))')
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

  const renderDeptTable = (recs: PayrollRecord[]) => (
    <div className="overflow-x-auto rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="text-right">Basic</TableHead>
            <TableHead className="text-right">Allowance</TableHead>
            <TableHead className="text-right">Reg OT hrs</TableHead>
            <TableHead className="text-right">Hol OT hrs</TableHead>
            <TableHead className="text-right">OT Amount</TableHead>
            <TableHead className="text-right">Bonus</TableHead>
            <TableHead className="text-right">Dinner Exp</TableHead>
            <TableHead className="text-right">Loan Ded.</TableHead>
            <TableHead className="text-right">Total Salary</TableHead>
            <TableHead className="text-right">Final Pmt</TableHead>
            <TableHead>Status</TableHead>
            {allApprovedOrPaid && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recs.map(rec => {
            const emp = rec.employees as any;
            const isDirector = emp?.employment_type === 'director';
            const isCeoEmp = (emp?.employee_roles ?? []).some((er: any) => er?.roles?.name === 'ceo');
            // HR Manager cannot see compensation of CEO or Director employees
            const hideSalary = isHrViewer && (isCeoEmp || isDirector);
            const isDraft = rec.status === 'draft';
            const isApproved = rec.status === 'approved';
            const style = statusStyles[rec.status] || statusStyles.draft;
            const masked = <span className="text-muted-foreground">—</span>;

            return (
              <TableRow key={rec.id}>
                <TableCell className="font-medium text-sm">{emp?.full_name || '—'}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {hideSalary ? masked : Number(rec.basic_salary).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {hideSalary ? masked : Number(rec.allowance).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {isDirector ? '—' : Number(rec.regular_ot_hours).toFixed(1)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {isDirector ? '—' : Number(rec.holiday_ot_hours).toFixed(1)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {isDirector ? '—' : (Number(rec.regular_ot_amount) + Number(rec.holiday_ot_amount)).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {hideSalary ? masked : isDraft ? (
                    <Input
                      type="number"
                      min="0"
                      className="w-20 text-right font-mono text-sm h-8"
                      defaultValue={Number(rec.bonus)}
                      onBlur={e => handleFieldBlur(rec, 'bonus', e.target.value)}
                    />
                  ) : (
                    <span className="font-mono text-sm">{Number(rec.bonus).toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {hideSalary ? masked : isDraft && !isDirector ? (
                    <Input
                      type="number"
                      min="0"
                      className="w-20 text-right font-mono text-sm h-8"
                      defaultValue={Number(rec.dinner_expense)}
                      onBlur={e => handleFieldBlur(rec, 'dinner_expense', e.target.value)}
                    />
                  ) : (
                    <span className="font-mono text-sm">{isDirector ? '—' : Number(rec.dinner_expense).toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {isDirector ? '—' : Number(rec.loan_deduction).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold">
                  {hideSalary ? masked : Number(rec.total_salary).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold">
                  {hideSalary ? masked : Number(rec.final_payment).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                  </span>
                </TableCell>
                {allApprovedOrPaid && (
                  <TableCell>
                    {isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPaidModal(rec);
                          setPaymentDate(new Date());
                          setPaymentMethod('bank_transfer');
                        }}
                      >
                        Mark Paid
                      </Button>
                    )}
                    {rec.status === 'paid' && (
                      <span className="text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                        Paid
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Month/Year selector + Generate */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedMonth} onValueChange={m => handleMonthYearChange(m, selectedYear)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={y => handleMonthYearChange(selectedMonth, y)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
          Generate Payroll
        </Button>
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
            <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start" style={{ borderColor: 'hsl(var(--border))' }}>
              <TabsTrigger
                value="summary"
                className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                All
                <span className="ml-1.5 text-xs opacity-60">({records.length})</span>
              </TabsTrigger>
              {departments.map(dept => (
                <TabsTrigger
                  key={dept}
                  value={dept}
                  className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
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
    </div>
  );
};

export default Payroll;
