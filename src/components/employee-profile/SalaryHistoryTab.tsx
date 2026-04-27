import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowUp, ArrowDown, Undo2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';
import { computeNextReviewDate } from '@/lib/review-schedule';

interface Props {
  employeeId: string;
  isCeo?: boolean;
  employeeName?: string;
  reviewFrequencyMonths?: number | null;
  firstReviewDate?: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]',
  approved: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]',
  reverted: 'bg-[#E5E7EB] text-[#4B5563] hover:bg-[#E5E7EB]',
};

const SalaryHistoryTab = ({
  employeeId,
  isCeo = false,
  employeeName = '',
  reviewFrequencyMonths = 6,
  firstReviewDate = null,
}: Props) => {
  const queryClient = useQueryClient();
  const [revertTarget, setRevertTarget] = useState<any | null>(null);
  const [reverting, setReverting] = useState(false);

  const { data: rows, isLoading } = useQuery({
    queryKey: ['salary-history', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_history' as any)
        .select('*, approver:approved_by ( full_name ), proposer:proposed_by ( full_name )')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const handleRevert = async () => {
    if (!revertTarget) return;
    setReverting(true);
    try {
      const prev = Number(revertTarget.previous_salary || 0);
      const prevAllowance = Number(revertTarget.previous_allowance || 0);

      // Recalculate next_review_date: subtract one frequency period from current next review
      const freq = reviewFrequencyMonths ?? 6;
      const currentNext = computeNextReviewDate(firstReviewDate, freq);
      const patch: any = { basic_salary: prev, allowance: prevAllowance };
      if (currentNext) {
        const reverted = new Date(currentNext.getFullYear(), currentNext.getMonth() - freq, currentNext.getDate());
        patch.first_review_date = format(reverted, 'yyyy-MM-dd');
      }

      const { error: empErr } = await supabase
        .from('employees')
        .update(patch)
        .eq('id', employeeId);
      if (empErr) throw empErr;

      const { error: histErr } = await supabase
        .from('salary_history' as any)
        .update({ status: 'reverted' })
        .eq('id', revertTarget.id);
      if (histErr) throw histErr;

      toast.success(`Increment reverted. Salary restored to PKR ${prev.toLocaleString()}`);
      queryClient.invalidateQueries({ queryKey: ['salary-history', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee-profile', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['pending-increment', employeeId] });
      setRevertTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to revert');
    } finally {
      setReverting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-[14px] border p-6">
        <div className="bx-skeleton h-6 w-40 mb-4" />
        <div className="bx-skeleton h-32 w-full" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-card rounded-[14px] border p-12 text-center">
        <p className="text-muted-foreground text-[14px]">No salary history yet.</p>
        <p className="text-muted-foreground text-[12px] mt-1">Increments and adjustments will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-[14px] border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Change Type</TableHead>
              <TableHead className="text-right">Previous Salary</TableHead>
              <TableHead className="text-right">New Salary</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approved By</TableHead>
              {isCeo && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any) => {
              const prev = Number(row.previous_salary || 0);
              const next = Number(row.new_salary || 0);
              const delta = next - prev;
              const arrears = Number(row.arrears_amount || 0);
              const canRevert = isCeo && row.status === 'approved';
              return (
                <TableRow key={row.id}>
                  <TableCell className="text-[13px]">{formatDate(row.created_at)}</TableCell>
                  <TableCell className="text-[13px] capitalize">{row.change_type}</TableCell>
                  <TableCell className="text-right font-mono-bx text-[13px]">PKR {prev.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono-bx text-[13px] font-semibold">PKR {next.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono-bx text-[13px]">
                    {delta !== 0 ? (
                      <span className={`inline-flex items-center gap-1 font-medium ${delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {delta > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        PKR {Math.abs(delta).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[13px]">{format(parseISO(row.effective_date), 'd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={`capitalize border-0 ${STATUS_STYLES[row.status] || ''}`}>
                      {row.status}
                    </Badge>
                    {row.status === 'approved' && arrears > 0 && (
                      <div className="text-[11px] text-muted-foreground mt-1">
                        Arrears: PKR {arrears.toLocaleString()} ({row.arrears_paid ? 'paid' : 'pending'})
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-[13px]">
                    {row.status === 'approved' ? (row.approver?.full_name || '—') :
                     row.status === 'rejected' ? <span className="text-muted-foreground italic">Rejected</span> :
                     row.status === 'reverted' ? <span className="text-muted-foreground italic">Reverted</span> :
                     <span className="text-muted-foreground">Pending</span>}
                  </TableCell>
                  {isCeo && (
                    <TableCell className="text-right">
                      {canRevert ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRevertTarget(row)}
                          className="h-7 px-2.5 gap-1 text-[12px] font-medium"
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid rgba(232, 69, 69, 0.2)',
                          }}
                        >
                          <Undo2 className="h-3 w-3" />
                          Revert
                        </Button>
                      ) : null}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!revertTarget} onOpenChange={(o) => !o && setRevertTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revert this increment?</AlertDialogTitle>
            <AlertDialogDescription>
              {revertTarget && (
                <>
                  Are you sure you want to revert this increment? This will restore{' '}
                  <strong>{employeeName || 'this employee'}</strong>'s salary from{' '}
                  <strong>PKR {Number(revertTarget.new_salary || 0).toLocaleString()}</strong> back to{' '}
                  <strong>PKR {Number(revertTarget.previous_salary || 0).toLocaleString()}</strong>. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reverting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevert();
              }}
              disabled={reverting}
              style={{ backgroundColor: '#991B1B', color: '#fff' }}
            >
              {reverting ? 'Reverting…' : 'Revert Increment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalaryHistoryTab;
