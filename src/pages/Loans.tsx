import { useState } from 'react';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sendNotification, getEmployeeIdsByRole, uniqueRecipients } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableHeader } from '@/components/ui/sortable-header';
import { useSort } from '@/hooks/useSort';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, Search, CreditCard, Loader2, MoreHorizontal, Pencil, CheckCircle, PauseCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'settled', label: 'Settled' },
  { value: 'on_hold', label: 'On Hold' },
];

const statusStyles: Record<string, string> = {
  active: 'bg-[hsl(var(--bx-success-bg))] text-[hsl(var(--bx-success-text))]',
  settled: 'bg-secondary text-secondary-foreground',
  on_hold: 'bg-[hsl(var(--bx-warning-bg))] text-[hsl(var(--bx-warning-text))]',
};

const statusLabel: Record<string, string> = {
  active: 'Active',
  settled: 'Settled',
  on_hold: 'On Hold',
};

const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const MANAGER_ROLES = ['finance_manager', 'ceo'];

const Loans = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = MANAGER_ROLES.includes(role || '');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDeduction, setFormDeduction] = useState('');
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [formReason, setFormReason] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: string; name: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans', companyId, statusFilter, isManager],
    queryFn: async () => {
      let query = supabase
        .from('loans')
        .select('*, employees!loans_employee_id_fkey(id, full_name, avatar_url), granter:employees!loans_granted_by_fkey(full_name)')
        .eq('company_id', companyId!)
        .order('granted_date', { ascending: false });

      // Non-managers only see their own loans (RLS also enforces this)
      if (!isManager) {
        query = query.eq('employee_id', employee!.employee_id);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: activeEmployees } = useQuery({
    queryKey: ['active-employees', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, avatar_url')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && isManager,
  });

  const filtered = loans?.filter(loan => {
    const empName = (loan.employees as any)?.full_name || '';
    return !search || empName.toLowerCase().includes(search.toLowerCase());
  }) ?? [];

  const { sorted, sort, toggleSort } = useSort(filtered, {
    employee: (l: any) => (l.employees as any)?.full_name,
    total_amount: (l: any) => Number(l.total_amount),
    monthly_deduction: (l: any) => Number(l.monthly_deduction),
    remaining_balance: (l: any) => Number(l.remaining_balance),
    granted_date: (l: any) => l.granted_date,
    status: (l: any) => l.status,
  });

  const resetForm = () => {
    setFormEmployeeId('');
    setFormAmount('');
    setFormDeduction('');
    setFormDate(new Date());
    setFormReason('');
    setFormNotes('');
    setEditingLoan(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (loan: any) => {
    setEditingLoan(loan);
    setFormEmployeeId(loan.employee_id);
    setFormAmount(String(loan.total_amount));
    setFormDeduction(String(loan.monthly_deduction));
    setFormDate(new Date(loan.granted_date));
    setFormReason(loan.reason || '');
    setFormNotes(loan.notes || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formEmployeeId || !formAmount || !formDeduction) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const totalAmount = parseFloat(formAmount);
      const monthlyDeduction = parseFloat(formDeduction);
      if (isNaN(totalAmount) || isNaN(monthlyDeduction) || totalAmount <= 0 || monthlyDeduction <= 0) {
        toast.error('Amount and deduction must be positive numbers');
        setSaving(false);
        return;
      }

      if (editingLoan) {
        const { error } = await supabase
          .from('loans')
          .update({
            employee_id: formEmployeeId,
            total_amount: totalAmount,
            monthly_deduction: monthlyDeduction,
            granted_date: format(formDate, 'yyyy-MM-dd'),
            reason: formReason || null,
            notes: formNotes || null,
          })
          .eq('id', editingLoan.id)
          .eq('company_id', companyId!);
        if (error) throw error;
        toast.success('Loan updated');
      } else {
        const { data: newLoan, error } = await supabase
          .from('loans')
          .insert({
            company_id: companyId!,
            employee_id: formEmployeeId,
            total_amount: totalAmount,
            remaining_balance: totalAmount,
            monthly_deduction: monthlyDeduction,
            granted_date: format(formDate, 'yyyy-MM-dd'),
            status: 'active',
            reason: formReason || null,
            notes: formNotes || null,
            granted_by: employee?.employee_id || null,
          })
          .select('id')
          .single();
        if (error) throw error;

        // Send loan_granted notification
        const mgrs = await getEmployeeIdsByRole(companyId!, ['finance_manager', 'ceo']);
        const recipients = uniqueRecipients(formEmployeeId, mgrs);
        sendNotification({
          companyId: companyId!,
          recipientIds: recipients,
          type: 'loan_granted',
          title: 'Loan Granted',
          message: `A loan of PKR ${totalAmount.toLocaleString()} has been granted to you.`,
          referenceType: 'loan',
          referenceId: newLoan?.id,
        });

        toast.success('Loan added');
      }
      setModalOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ['loans'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save loan');
    } finally {
      setSaving(false);
    }
  };

  const openConfirm = (id: string, status: string, name: string) => {
    setConfirmAction({ id, status, name });
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('loans')
        .update({ status: confirmAction.status })
        .eq('id', confirmAction.id)
        .eq('company_id', companyId!);
      if (error) throw error;

      // Send loan_settled notification
      if (confirmAction.status === 'settled') {
        // Find the loan to get employee_id
        const loan = (loans || []).find((l: any) => l.id === confirmAction.id);
        if (loan) {
          const mgrs = await getEmployeeIdsByRole(companyId!, ['finance_manager', 'ceo']);
          const recipients = uniqueRecipients(loan.employee_id, mgrs);
          sendNotification({
            companyId: companyId!,
            recipientIds: recipients,
            type: 'loan_settled',
            title: 'Loan Settled',
            message: 'Your loan has been fully repaid.',
            referenceType: 'loan',
            referenceId: confirmAction.id,
          });
        }
      }

      toast.success(`Loan marked as ${statusLabel[confirmAction.status]?.toLowerCase()}`);
      setConfirmOpen(false);
      qc.invalidateQueries({ queryKey: ['loans'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            {loans ? `${loans.length} loan${loans.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        {isManager && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Loan
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {isManager && (
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CreditCard className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
            {search || statusFilter !== 'all' ? 'No matching loans' : 'No loans yet'}
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
            {search || statusFilter !== 'all' ? 'Try different filters' : isManager ? 'Add the first loan to get started' : 'You have no loans on record'}
          </p>
        </div>
      ) : (
        <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table>
            <TableHeader>
              <TableRow>
                {isManager && <SortableHeader column="employee" sort={sort} onSort={toggleSort}>Employee</SortableHeader>}
                <SortableHeader column="total_amount" sort={sort} onSort={toggleSort} align="right">Total Amount</SortableHeader>
                <SortableHeader column="monthly_deduction" sort={sort} onSort={toggleSort} align="right">Monthly Deduction</SortableHeader>
                <SortableHeader column="remaining_balance" sort={sort} onSort={toggleSort} align="right">Remaining Balance</SortableHeader>
                <SortableHeader column="granted_date" sort={sort} onSort={toggleSort}>Granted Date</SortableHeader>
                <SortableHeader column="status" sort={sort} onSort={toggleSort}>Status</SortableHeader>
                {isManager && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(loan => {
                const emp = loan.employees as any;
                const totalAmt = Number(loan.total_amount);
                const remaining = Number(loan.remaining_balance);
                const pct = totalAmt > 0 ? (remaining / totalAmt) * 100 : 0;

                return (
                  <TableRow key={loan.id}>
                    {isManager && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp?.avatar_url || ''} />
                            <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                              {initials(emp?.full_name || '?')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{emp?.full_name || '—'}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right font-mono text-sm">
                      PKR {totalAmt.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      PKR {Number(loan.monthly_deduction).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <span className="font-mono text-sm">PKR {remaining.toLocaleString()}</span>
                        <Progress value={pct} className="h-1.5 w-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(loan.granted_date)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[loan.status] || ''}`}>
                        {statusLabel[loan.status] || loan.status}
                      </span>
                    </TableCell>
                    {isManager && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(loan)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            {loan.status !== 'settled' && (
                              <DropdownMenuItem onClick={() => openConfirm(loan.id, 'settled', emp?.full_name || '')}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Mark Settled
                              </DropdownMenuItem>
                            )}
                            {loan.status !== 'on_hold' && loan.status !== 'settled' && (
                              <DropdownMenuItem onClick={() => openConfirm(loan.id, 'on_hold', emp?.full_name || '')}>
                                <PauseCircle className="h-4 w-4 mr-2" /> Mark On Hold
                              </DropdownMenuItem>
                            )}
                            {loan.status === 'on_hold' && (
                              <DropdownMenuItem onClick={() => openConfirm(loan.id, 'active', emp?.full_name || '')}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Reactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Loan Modal — managers only */}
      {isManager && (
        <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); resetForm(); } }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add Loan'}</DialogTitle>
              <DialogDescription>
                {editingLoan ? 'Update the loan details below.' : 'Create a new employee loan.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Employee <span className="text-destructive">*</span></Label>
                <div className="mt-1">
                  <SearchableEmployeeSelect
                    employees={activeEmployees || []}
                    value={formEmployeeId}
                    onValueChange={setFormEmployeeId}
                    placeholder="Select employee"
                    disabled={!!editingLoan}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Amount (PKR) <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    min="0"
                    className="mt-1"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </div>
                <div>
                  <Label>Monthly Deduction (PKR) <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    min="0"
                    className="mt-1"
                    value={formDeduction}
                    onChange={e => setFormDeduction(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
              <div>
                <Label>Granted Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full mt-1 justify-start text-left font-normal", !formDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formDate ? formatDate(formDate) : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={(d) => d && setFormDate(d)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Reason</Label>
                <Input className="mt-1" value={formReason} onChange={e => setFormReason(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea className="mt-1" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Optional" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingLoan ? 'Update Loan' : 'Add Loan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Status Change Dialog — managers only */}
      {isManager && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction?.status === 'settled' ? 'Mark Loan as Settled' : confirmAction?.status === 'on_hold' ? 'Mark Loan as On Hold' : 'Reactivate Loan'}
              </DialogTitle>
              <DialogDescription>
                {confirmAction?.status === 'settled'
                  ? `Are you sure you want to mark ${confirmAction?.name}'s loan as settled? This indicates the loan has been fully repaid.`
                  : confirmAction?.status === 'on_hold'
                  ? `Put ${confirmAction?.name}'s loan on hold? Monthly deductions will be paused.`
                  : `Reactivate ${confirmAction?.name}'s loan? Monthly deductions will resume.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmAction} disabled={confirming}>
                {confirming && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Loans;
