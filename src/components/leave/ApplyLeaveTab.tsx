import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { countWorkingDays, ensureLeaveBalance, getRemainingBalance } from '@/lib/leave-utils';
import { sendNotification, getEmployeeIdsByRole, uniqueRecipients } from '@/lib/notifications';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { useQuery } from '@tanstack/react-query';

const ApplyLeaveTab = () => {
  const { employee } = useAuth();
  const role = employee?.role_name;
  const companyId = employee?.company_id;
  const isHrOrCeo = role === 'hr_manager' || role === 'ceo';

  const [selectedEmployee, setSelectedEmployee] = useState(employee?.employee_id || '');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [halfDay, setHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState('morning');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [daysRequested, setDaysRequested] = useState(0);

  const { data: employeesList = [] } = useQuery({
    queryKey: ['apply-leave-employees', companyId],
    enabled: !!companyId && isHrOrCeo,
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name, avatar_url, designation').eq('company_id', companyId!).eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  useEffect(() => {
    if (employee?.employee_id) setSelectedEmployee(employee.employee_id);
  }, [employee?.employee_id]);

  // Load leave types
  useEffect(() => {
    if (!companyId) return;
    (async () => {
      const { data } = await supabase
        .from('leave_types')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name');
      setLeaveTypes(data || []);
    })();
  }, [companyId]);

  // Load balances for selected employee
  useEffect(() => {
    if (!companyId || !selectedEmployee || leaveTypes.length === 0) return;
    const year = new Date().getFullYear();
    (async () => {
      const bals: Record<string, number> = {};
      for (const lt of leaveTypes) {
        bals[lt.id] = await getRemainingBalance(companyId, selectedEmployee, lt.id, year);
      }
      setBalances(bals);
    })();
  }, [companyId, selectedEmployee, leaveTypes]);

  // Calculate days
  useEffect(() => {
    if (halfDay) {
      setDaysRequested(0.5);
      return;
    }
    if (!startDate || !endDate || !companyId) {
      setDaysRequested(0);
      return;
    }
    const s = format(startDate, 'yyyy-MM-dd');
    const e = format(endDate, 'yyyy-MM-dd');
    countWorkingDays(s, e, companyId).then(setDaysRequested);
  }, [startDate, endDate, halfDay, companyId]);

  // When half day toggled on, sync end date
  useEffect(() => {
    if (halfDay && startDate) {
      setEndDate(startDate);
    }
  }, [halfDay, startDate]);

  const handleSubmit = async () => {
    if (!companyId || !selectedEmployee || !leaveTypeId || !startDate) return;

    const lt = leaveTypes.find(t => t.id === leaveTypeId);
    if (!lt) return;

    const effectiveEnd = halfDay ? startDate : endDate;
    if (!effectiveEnd) { toast.error('Please select an end date'); return; }

    const s = format(startDate, 'yyyy-MM-dd');
    const e = format(effectiveEnd, 'yyyy-MM-dd');

    if (new Date(s) < new Date(new Date().toISOString().split('T')[0])) {
      toast.error('Start date cannot be in the past');
      return;
    }
    if (e < s) {
      toast.error('End date cannot be before start date');
      return;
    }

    // Check balance (except unpaid)
    const year = new Date().getFullYear();
    if (lt.annual_entitlement > 0) {
      const remaining = await getRemainingBalance(companyId, selectedEmployee, leaveTypeId, year);
      if (daysRequested > remaining) {
        toast.error(`Insufficient balance. Remaining: ${remaining} days`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await ensureLeaveBalance(companyId, selectedEmployee, leaveTypeId, year);

      const { error } = await supabase.from('leave_requests').insert({
        company_id: companyId,
        employee_id: selectedEmployee,
        leave_type_id: leaveTypeId,
        start_date: s,
        end_date: e,
        days_requested: daysRequested,
        half_day: halfDay,
        half_day_period: halfDay ? halfDayPeriod : null,
        reason: reason || null,
        status: 'pending',
      } as any);

      if (error) throw error;

      // Get employee name for notification
      const { data: empData } = await supabase
        .from('employees')
        .select('full_name')
        .eq('id', selectedEmployee)
        .single();
      const empName = empData?.full_name || 'An employee';

      // Send notification to HR and CEO
      const hrIds = await getEmployeeIdsByRole(companyId, ['hr_manager', 'ceo']);
      const recipients = uniqueRecipients(hrIds);
      sendNotification({
        companyId,
        recipientIds: recipients,
        type: 'leave_submitted',
        title: 'Leave Request Submitted',
        message: `${empName} has requested ${daysRequested} day(s) of ${lt.name} from ${s} to ${e}.`,
        referenceType: 'leave',
      });

      toast.success('Leave request submitted');
      // Reset form
      setLeaveTypeId('');
      setStartDate(undefined);
      setEndDate(undefined);
      setHalfDay(false);
      setReason('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg space-y-5" style={{ fontFamily: 'var(--ff-body)' }}>
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
            {leaveTypes.map(lt => (
              <SelectItem key={lt.id} value={lt.id}>
                {lt.name} {lt.annual_entitlement > 0 ? `(${balances[lt.id] ?? '...'} remaining)` : '(Unlimited)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')} disabled={halfDay}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="p-3 pointer-events-auto" />
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
        <Label className="text-sm font-medium">Reason (optional)</Label>
        <Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Enter reason..." />
      </div>

      <Button onClick={handleSubmit} disabled={submitting || !leaveTypeId || !startDate}>
        {submitting ? 'Submitting...' : 'Submit Request'}
      </Button>
    </div>
  );
};

export default ApplyLeaveTab;
