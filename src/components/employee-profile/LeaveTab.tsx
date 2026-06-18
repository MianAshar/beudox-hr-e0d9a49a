import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

const statusCls: Record<string, string> = {
  pending: 'bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]',
  approved: 'bg-bx-success-bg text-[hsl(var(--bx-success-text))]',
  rejected: 'bg-bx-danger-bg text-[hsl(var(--bx-danger-text))]',
  cancelled: 'bg-muted text-muted-foreground',
};

const LeaveTab = ({ employeeId }: { employeeId: string }) => {
  const year = new Date().getFullYear();

  const { data: balances, isLoading: balLoading } = useQuery({
    queryKey: ['employee-leave-balances', employeeId, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select(`*, leave_types ( id, name, annual_entitlement )`)
        .eq('employee_id', employeeId)
        .eq('year', year);
      if (error) throw error;
      return data || [];
    },
    enabled: !!employeeId,
  });

  const { data: requests, isLoading: reqLoading } = useQuery({
    queryKey: ['employee-leave-requests', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`*, leave_types ( name )`)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!employeeId,
  });

  const overdrawn = (balances || [])
    .map((b: any) => {
      const total = Number(b.system_days || 0) + Number(b.adjustment_days || 0) + Number(b.carried_over_days || 0);
      const remaining = total - Number(b.used_days || 0);
      return { name: b.leave_types?.name || 'Leave', remaining };
    })
    .filter((x) => x.remaining < 0);

  return (
    <div className="space-y-6">
      {overdrawn.length > 0 && (
        <div
          className="rounded-[10px] p-4 flex gap-3"
          style={{ background: '#FEF3C7', borderLeft: '3px solid #F5A623', color: '#92400E' }}
        >
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>
            <p className="font-semibold mb-1">This employee has overdrawn leave balances:</p>
            <ul className="space-y-0.5">
              {overdrawn.map((o) => (
                <li key={o.name}>{o.name}: {o.remaining} days</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Balances */}
      <div>
        <h3 className="font-display font-semibold text-[14px] text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Leave Balances · {year}
        </h3>
        {balLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (balances || []).length === 0 ? (
          <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>No leave balances on record.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {balances!.map((b: any) => {
              const total = Number(b.system_days || 0) + Number(b.adjustment_days || 0) + Number(b.carried_over_days || 0);
              const used = Number(b.used_days || 0);
              const remaining = total - used;
              const over = remaining < 0;
              return (
                <div key={b.id} className="bg-card rounded-[12px] border p-4">
                  <p className="text-[11px] text-muted-foreground mb-1" style={{ fontFamily: 'var(--ff-body)' }}>
                    {b.leave_types?.name || 'Leave'}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-[22px] font-bold" style={{ fontFamily: 'var(--ff-display)', color: over ? '#E84545' : undefined }}>{remaining}</p>
                    <p className="text-[11px] text-muted-foreground">/ {total} days</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Used: {used}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Requests */}
      <div>
        <h3 className="font-display font-semibold text-[14px] text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Leave Requests
        </h3>
        <div className="bg-card rounded-[14px] border overflow-hidden">
          {reqLoading ? (
            <div className="p-6 space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : (requests || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <CalendarDays className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>No leave requests yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests!.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-[13px]">{r.leave_types?.name || '—'}</TableCell>
                    <TableCell className="text-[13px]">{formatDate(r.start_date)}</TableCell>
                    <TableCell className="text-[13px]">{formatDate(r.end_date)}</TableCell>
                    <TableCell className="text-[13px] font-mono">{Number(r.days_requested).toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] border-0 capitalize ${statusCls[r.status] || ''}`}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTab;
