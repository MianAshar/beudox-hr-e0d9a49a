import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { countWorkingDays, ensureLeaveBalance } from '@/lib/leave-utils';
import { sendNotification, getEmployeeIdsByRole, uniqueRecipients } from '@/lib/notifications';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ApplyLeaveModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const { employee } = useAuth();
  const roles = employee?.roles ?? [];
  const companyId = employee?.company_id;
  const isCeo = roles.includes('ceo');
  const isHrOrCeo = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const queryClient = useQueryClient();

  const [selectedEmployee, setSelectedEmployee] = useState(employee?.employee_id || '');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [halfDay, setHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState('morning');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [daysRequested, setDaysRequested] = useState(0);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const { data: employeesList = [] } = useQuery({
    queryKey: ['apply-leave-employees', companyId],
    enabled: !!companyId && isHrOrCeo,
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name, avatar_url, designation').eq('company_id', companyId!).eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-types-active', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('leave_types').select('*').eq('company_id', companyId!).eq('is_active', true).order('name');
      return data || [];
    },
  });

  // Fetch all balances for selected employee once
  const { data: balances = {} } = useQuery({
    queryKey: ['employee-leave-balances', companyId, selectedEmployee],
    enabled: !!companyId && !!selectedEmployee && leaveTypes.length > 0,
    queryFn: async () => {
      const year = new Date().getFullYear();
      const { data } = await supabase
        .from('leave_balances')
        .select('leave_type_id, system_days, adjustment_days, carried_over_days, used_days')
        .eq('company_id', companyId!)
        .eq('employee_id', selectedEmployee)
        .eq('year', year);
      const bals: Record<string, number> = {};
      for (const lt of leaveTypes) {
        const b = data?.find(d => d.leave_type_id === lt.id);
        if (b) {
          bals[lt.id] = (b.system_days || 0) + (b.adjustment_days || 0) + (b.carried_over_days || 0) - (b.used_days || 0);
        } else {
          bals[lt.id] = lt.annual_entitlement || 0;
        }
      }
      return bals;
    },
  });

  useEffect(() => {
    if (employee?.employee_id && !selectedEmployee) setSelectedEmployee(employee.employee_id);
  }, [employee?.employee_id]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setLeaveTypeId('');
      setStartDate(undefined);
      setEndDate(undefined);
      setHalfDay(false);
      setReason('');
      setReasonError('');
      setDaysRequested(0);
      if (employee?.employee_id) setSelectedEmployee(employee.employee_id);
    }
  }, [open]);

  // Calculate days
  useEffect(() => {
    if (halfDay) { setDaysRequested(0.5); return; }
    if (!startDate || !endDate || !companyId) { setDaysRequested(0); return; }
    countWorkingDays(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), companyId).then(setDaysRequested);
  }, [startDate, endDate, halfDay, companyId]);

  useEffect(() => {
    if (halfDay && startDate) setEndDate(startDate);
  }, [halfDay, startDate]);

  // Auto-focus end date after start date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      // Reset end date if it's before start date
      if (endDate && endDate < date) setEndDate(undefined);
      if (!halfDay) {
        setTimeout(() => setEndDateOpen(true), 200);
      }
    }
  };

  const handleSubmit = async () => {
    if (!companyId || !selectedEmployee || !leaveTypeId || !startDate) return;
    const lt = leaveTypes.find((t: any) => t.id === leaveTypeId);
    if (!lt) return;

    if (!reason.trim()) {
      setReasonError('Please provide a reason for your leave request.');
      return;
    }
    setReasonError('');

    const effectiveEnd = halfDay ? startDate : endDate;
    if (!effectiveEnd) { toast.error('Please select an end date'); return; }

    const s = format(startDate, 'yyyy-MM-dd');
    const e = format(effectiveEnd, 'yyyy-MM-dd');

    if (e < s) { toast.error('End date cannot be before start date'); return; }

    // Overdraw is allowed — no balance gate here. A warning is shown in the UI.



    setSubmitting(true);
    try {
      const year = new Date().getFullYear();
      await ensureLeaveBalance(companyId, selectedEmployee, leaveTypeId, year);

      const autoApprove = isCeo;
      const nowIso = new Date().toISOString();

      const { error } = await supabase.from('leave_requests').insert({
        company_id: companyId,
        employee_id: selectedEmployee,
        leave_type_id: leaveTypeId,
        start_date: s, end_date: e,
        days_requested: daysRequested,
        half_day: halfDay,
        half_day_period: halfDay ? halfDayPeriod : null,
        reason: reason || null,
        status: autoApprove ? 'approved' : 'pending',
        actioned_by: autoApprove ? employee!.employee_id : null,
        actioned_at: autoApprove ? nowIso : null,
      } as any);
      if (error) throw error;

      if (autoApprove) {
        const { data: balance } = await supabase
          .from('leave_balances')
          .select('id, used_days')
          .eq('company_id', companyId)
          .eq('employee_id', selectedEmployee)
          .eq('leave_type_id', leaveTypeId)
          .eq('year', year)
          .maybeSingle();
        if (balance) {
          await supabase.from('leave_balances')
            .update({ used_days: (balance.used_days || 0) + daysRequested } as any)
            .eq('id', balance.id);
        }
      } else {
        const { data: empData } = await supabase.from('employees').select('full_name').eq('id', selectedEmployee).single();
        const empName = empData?.full_name || 'An employee';

        const hrIds = await getEmployeeIdsByRole(companyId, ['hr_manager', 'ceo']);
        const recipients = uniqueRecipients(hrIds);
        if (recipients.length > 0) {
          sendNotification({
            companyId, recipientIds: recipients,
            type: 'leave_submitted', title: 'Leave Request Submitted',
            message: `${empName} has requested ${daysRequested} day(s) of ${lt.name} from ${s} to ${e}.`,
            referenceType: 'leave',
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['all-leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['employee-leave-balances'] });
      toast.success(autoApprove ? 'Leave approved' : 'Leave request submitted');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" style={{ fontFamily: 'var(--ff-body)' }}>
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isHrOrCeo && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Employee</Label>
              <SearchableEmployeeSelect employees={employeesList} value={selectedEmployee} onValueChange={setSelectedEmployee} />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Leave Type</Label>
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
              <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
              <SelectContent>
                {leaveTypes.map((lt: any) => (
                  <SelectItem key={lt.id} value={lt.id}>
                    {lt.name} {lt.annual_entitlement > 0 ? `(${balances[lt.id] ?? '...'} remaining)` : '(Unlimited)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(() => {
              const lt = leaveTypes.find((t: any) => t.id === leaveTypeId);
              if (!lt || !(lt.annual_entitlement > 0)) return null;
              const remaining = balances[leaveTypeId] ?? 0;
              const overBy = daysRequested - remaining;
              if (daysRequested <= 0 || overBy <= 0) return null;
              return (
                <p
                  className="text-xs mt-1"
                  style={{ color: '#92400E', background: '#FEF3C7', borderLeft: '3px solid #F5A623', padding: '8px 10px', borderRadius: 6 }}
                >
                  Warning: This request will overdraw your {lt.name} balance by {overBy} day{overBy === 1 ? '' : 's'}. Your request will still be submitted.
                </p>
              );
            })()}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')} disabled={halfDay}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={(d) => { setEndDate(d); setEndDateOpen(false); }} disabled={startDate ? { before: startDate } : undefined} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={halfDay} onCheckedChange={setHalfDay} />
              <Label className="text-sm">Half Day</Label>
            </div>
            {halfDay && (
              <Select value={halfDayPeriod} onValueChange={setHalfDayPeriod}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {daysRequested > 0 && (
            <p className="text-sm text-muted-foreground">
              Days requested: <span className="font-medium text-foreground">{daysRequested}</span>
            </p>
          )}

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Reason <span className="text-destructive">*</span></Label>
            <Textarea
              value={reason}
              onChange={e => {
                setReason(e.target.value);
                if (reasonError && e.target.value.trim()) setReasonError('');
              }}
              rows={3}
              placeholder="Enter reason..."
              aria-invalid={!!reasonError}
              className={reasonError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {reasonError && (
              <p className="text-xs text-destructive">{reasonError}</p>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={submitting || !leaveTypeId || !startDate || !reason.trim()} className="w-full">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyLeaveModal;
