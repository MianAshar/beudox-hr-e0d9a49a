import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, addMonths } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sendNotification, getEmployeeIdsByRole } from '@/lib/notifications';
import { computeNextReviewDate } from '@/lib/review-schedule';

interface Props {
  employee: {
    id: string;
    full_name: string;
    company_id: string;
    first_review_date: string | null;
    review_frequency_months: number | null;
  };
  approverEmployeeId: string;
  readOnly?: boolean;
}

const PendingIncrementCard = ({ employee, approverEmployeeId, readOnly = false }: Props) => {
  const queryClient = useQueryClient();
  const [acting, setActing] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: pending } = useQuery({
    queryKey: ['pending-increment', employee.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_history' as any)
        .select('*, proposer:proposed_by ( full_name )')
        .eq('employee_id', employee.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  if (!pending) return null;

  const handleApprove = async () => {
    setActing(true);
    try {
      const { error: updErr } = await supabase
        .from('salary_history' as any)
        .update({
          status: 'approved',
          approved_by: approverEmployeeId,
          approved_at: new Date().toISOString(),
        })
        .eq('id', pending.id);
      if (updErr) throw updErr;

      const freq = employee.review_frequency_months ?? 6;
      // Advance the next review date by one frequency period from current next review
      let nextReview: string | null = null;
      const currentNext = computeNextReviewDate(employee.first_review_date, freq);
      if (currentNext) {
        const advanced = new Date(currentNext.getFullYear(), currentNext.getMonth() + freq, currentNext.getDate());
        nextReview = format(advanced, 'yyyy-MM-dd');
      }
      const patch: any = {
        basic_salary: pending.new_salary,
        allowance: pending.new_allowance,
      };
      if (nextReview) patch.first_review_date = nextReview;
      await supabase.from('employees').update(patch).eq('id', employee.id);

      toast.success('Increment approved');

      // Notify employee + HR
      const hrIds = await getEmployeeIdsByRole(employee.company_id, ['hr_manager']);
      const recipients = Array.from(new Set([employee.id, ...hrIds]));
      sendNotification({
        companyId: employee.company_id,
        recipientIds: recipients,
        type: 'salary_increment_approved',
        title: 'Salary Increment Approved',
        message: `Salary updated to PKR ${Number(pending.new_salary).toLocaleString()} effective ${format(parseISO(pending.effective_date), 'd MMM yyyy')}.`,
        referenceType: 'salary_history',
        referenceId: pending.id,
      });

      queryClient.invalidateQueries({ queryKey: ['employee-profile', employee.id] });
      queryClient.invalidateQueries({ queryKey: ['salary-history', employee.id] });
      queryClient.invalidateQueries({ queryKey: ['pending-increment', employee.id] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error('Please provide a rejection reason');
    setActing(true);
    try {
      const { error } = await supabase
        .from('salary_history' as any)
        .update({
          status: 'rejected',
          rejected_by: approverEmployeeId,
          rejected_at: new Date().toISOString(),
          rejection_reason: rejectReason.trim(),
        })
        .eq('id', pending.id);
      if (error) throw error;
      toast.success('Increment proposal rejected');

      const hrIds = await getEmployeeIdsByRole(employee.company_id, ['hr_manager']);
      if (hrIds.length > 0) {
        sendNotification({
          companyId: employee.company_id,
          recipientIds: hrIds,
          type: 'increment_rejected',
          title: 'Increment Proposal Rejected',
          message: `The increment for ${employee.full_name} was rejected. Reason: ${rejectReason.trim()}`,
          referenceType: 'salary_history',
          referenceId: pending.id,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['salary-history', employee.id] });
      queryClient.invalidateQueries({ queryKey: ['pending-increment', employee.id] });
      setShowReject(false);
      setRejectReason('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject');
    } finally {
      setActing(false);
    }
  };

  const arrears = Number(pending.arrears_amount || 0);

  return (
    <div className="bg-card rounded-[14px] border-2 p-6" style={{ borderColor: 'hsl(var(--bx-warning-text) / 0.4)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" style={{ color: 'hsl(var(--bx-warning-text))' }} />
          <h3 className="font-display font-semibold text-[15px] text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
            Pending Increment — Awaiting CEO Approval
          </h3>
        </div>
        <Badge className="capitalize border-0 bg-bx-warning-bg text-[hsl(var(--bx-warning-text))] hover:bg-bx-warning-bg">
          {pending.change_type}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">Current</p>
          <p className="text-[14px] font-semibold font-mono-bx text-foreground">
            PKR {Number(pending.previous_salary).toLocaleString()}
            <span className="text-muted-foreground font-normal"> + </span>
            PKR {Number(pending.previous_allowance).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">Proposed</p>
          <p className="text-[14px] font-semibold font-mono-bx text-foreground">
            PKR {Number(pending.new_salary).toLocaleString()}
            <span className="text-muted-foreground font-normal"> + </span>
            PKR {Number(pending.new_allowance).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">Effective Date</p>
          <p className="text-[13px] font-medium">{format(parseISO(pending.effective_date), 'd MMM yyyy')}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground mb-0.5">Proposed by</p>
          <p className="text-[13px] font-medium">{pending.proposer?.full_name || '—'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-muted-foreground mb-0.5">Reason</p>
          <p className="text-[13px] text-foreground">{pending.reason || '—'}</p>
        </div>
        {arrears > 0 && (
          <div className="col-span-2">
            <p className="text-[11px] text-muted-foreground mb-0.5">Arrears</p>
            <p className="text-[13px] font-semibold font-mono-bx text-foreground">
              PKR {arrears.toLocaleString()}
              <span className="text-muted-foreground font-normal text-[12px] ml-2">(Will be added as bonus in next payroll)</span>
            </p>
          </div>
        )}
      </div>

      {readOnly ? (
        <div className="border-t pt-4">
          <p className="text-[12px] text-muted-foreground italic" style={{ fontFamily: 'var(--ff-body)' }}>
            Pending CEO approval
          </p>
        </div>
      ) : showReject ? (
        <div className="space-y-3 border-t pt-4">
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection…"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowReject(false)} disabled={acting}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleReject} disabled={acting}>
              {acting ? 'Rejecting…' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 border-t pt-4">
          <Button onClick={handleApprove} disabled={acting} className="gap-2">
            <Check className="h-4 w-4" /> Approve
          </Button>
          <Button variant="destructive" onClick={() => setShowReject(true)} disabled={acting} className="gap-2">
            <X className="h-4 w-4" /> Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default PendingIncrementCard;
