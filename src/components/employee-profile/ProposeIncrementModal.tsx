import { useState } from 'react';
import { format, parseISO, differenceInCalendarMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { computeNextReviewDate } from '@/lib/review-schedule';
import { sendNotification, getEmployeeIdsByRole } from '@/lib/notifications';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    full_name: string;
    company_id: string;
    basic_salary: number | null;
    allowance: number | null;
    first_review_date: string | null;
    review_frequency_months: number | null;
  };
  proposerEmployeeId: string;
  isCeo: boolean;
}

const CHANGE_TYPES = [
  { value: 'increment', label: 'Increment' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'correction', label: 'Correction' },
];

const ProposeIncrementModal = ({ open, onOpenChange, employee, proposerEmployeeId, isCeo }: Props) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const currentSalary = Number(employee.basic_salary || 0);
  const currentAllowance = Number(employee.allowance || 0);

  const [newSalary, setNewSalary] = useState('');
  const [newAllowance, setNewAllowance] = useState('');
  const [effectiveDate, setEffectiveDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [changeType, setChangeType] = useState('increment');
  const [reason, setReason] = useState('');
  const [approveImmediately, setApproveImmediately] = useState(false);

  const reset = () => {
    setNewSalary('');
    setNewAllowance('');
    setEffectiveDate(format(new Date(), 'yyyy-MM-dd'));
    setChangeType('increment');
    setReason('');
    setApproveImmediately(false);
  };

  const close = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const computedArrears = (() => {
    const ns = parseFloat(newSalary || '0') || 0;
    if (!effectiveDate) return 0;
    const eff = parseISO(effectiveDate);
    const months = differenceInCalendarMonths(new Date(), eff);
    if (months <= 0) return 0;
    return Math.max(0, ns - currentSalary) * months;
  })();

  const handleSubmit = async () => {
    const ns = parseFloat(newSalary);
    const na = parseFloat(newAllowance);
    if (Number.isNaN(ns) || ns < 0) return toast.error('Enter a valid new basic salary');
    if (Number.isNaN(na) || na < 0) return toast.error('Enter a valid new allowance');
    if (!effectiveDate) return toast.error('Effective date is required');
    if (!reason.trim()) return toast.error('Reason is required');

    const isPast = parseISO(effectiveDate) < new Date(format(new Date(), 'yyyy-MM-dd'));
    const arrears = isPast ? Math.max(0, ns - currentSalary) * differenceInCalendarMonths(new Date(), parseISO(effectiveDate)) : 0;

    const willApprove = isCeo && approveImmediately;
    const status = willApprove ? 'approved' : 'pending';

    setSaving(true);
    try {
      const { data: inserted, error: insertErr } = await supabase
        .from('salary_history' as any)
        .insert({
          company_id: employee.company_id,
          employee_id: employee.id,
          previous_salary: currentSalary,
          new_salary: ns,
          previous_allowance: currentAllowance,
          new_allowance: na,
          effective_date: effectiveDate,
          change_type: changeType,
          reason: reason.trim(),
          status,
          proposed_by: proposerEmployeeId,
          approved_by: willApprove ? proposerEmployeeId : null,
          approved_at: willApprove ? new Date().toISOString() : null,
          arrears_amount: arrears,
          arrears_paid: false,
        })
        .select('id')
        .single();
      if (insertErr) throw insertErr;

      if (willApprove) {
        // Advance next review date by one frequency period from the current next review
        const freq = employee.review_frequency_months ?? 6;
        let advancedReview: string | null = null;
        const currentNext = computeNextReviewDate(employee.first_review_date, freq);
        if (currentNext) {
          const advanced = new Date(currentNext.getFullYear(), currentNext.getMonth() + freq, currentNext.getDate());
          advancedReview = format(advanced, 'yyyy-MM-dd');
        }
        const patch: any = { basic_salary: ns, allowance: na };
        if (advancedReview) patch.first_review_date = advancedReview;
        await supabase.from('employees').update(patch).eq('id', employee.id);
        toast.success('Increment approved and salary updated');

        // Notify employee
        sendNotification({
          companyId: employee.company_id,
          recipientIds: [employee.id],
          type: 'salary_increment_approved',
          title: 'Salary Increment Approved',
          message: `Salary updated to PKR ${ns.toLocaleString()} effective ${format(parseISO(effectiveDate), 'd MMM yyyy')}.`,
          referenceType: 'salary_history',
          referenceId: (inserted as any)?.id,
        });
      } else {
        toast.success('Increment proposal submitted for approval');
        // Notify CEO
        const ceoIds = await getEmployeeIdsByRole(employee.company_id, ['ceo']);
        if (ceoIds.length > 0) {
          sendNotification({
            companyId: employee.company_id,
            recipientIds: ceoIds,
            type: 'increment_pending',
            title: 'Increment Proposal Pending Approval',
            message: `${employee.full_name}'s increment proposal is awaiting your approval.`,
            referenceType: 'salary_history',
            referenceId: (inserted as any)?.id,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['employee-profile', employee.id] });
      queryClient.invalidateQueries({ queryKey: ['salary-history', employee.id] });
      queryClient.invalidateQueries({ queryKey: ['pending-increment', employee.id] });
      close(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit increment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose Increment</DialogTitle>
          <DialogDescription>
            Submit a salary change proposal for {employee.full_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-muted/50">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">Current Basic Salary</p>
              <p className="text-[14px] font-semibold font-mono-bx">PKR {currentSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5">Current Allowance</p>
              <p className="text-[14px] font-semibold font-mono-bx">PKR {currentAllowance.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px] mb-1.5 block">New Basic Salary (PKR)</Label>
              <Input
                type="number"
                min="0"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-[12px] mb-1.5 block">New Allowance (PKR)</Label>
              <Input
                type="number"
                min="0"
                value={newAllowance}
                onChange={(e) => setNewAllowance(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px] mb-1.5 block">Effective Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal h-10">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {effectiveDate ? format(parseISO(effectiveDate), 'd MMM yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={effectiveDate ? parseISO(effectiveDate) : undefined}
                    onSelect={(d) => {
                      if (d) {
                        setEffectiveDate(format(d, 'yyyy-MM-dd'));
                        setDatePickerOpen(false);
                      }
                    }}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-[12px] mb-1.5 block">Change Type</Label>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHANGE_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[12px] mb-1.5 block">Reason <span className="text-destructive">*</span></Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Justify this salary change…"
              rows={3}
            />
          </div>

          {computedArrears > 0 && (
            <div className="text-[12px] p-3 rounded-md bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]">
              Backdated change: arrears of <strong>PKR {computedArrears.toLocaleString()}</strong> will be added as a bonus on the next payroll.
            </div>
          )}

          {isCeo && (
            <label className="flex items-center gap-2 cursor-pointer text-[13px]">
              <Checkbox
                checked={approveImmediately}
                onCheckedChange={(c) => setApproveImmediately(!!c)}
              />
              Approve immediately (skip pending status)
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Submitting…' : isCeo && approveImmediately ? 'Approve & Update Salary' : 'Submit Proposal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeIncrementModal;
