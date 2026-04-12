import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
  cancelled: { bg: '#F3F4F6', text: '#374151' },
};

const MyRequestsTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const employeeId = employee?.employee_id;
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calMonth, setCalMonth] = useState(() => new Date());

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['my-leave-requests', employeeId],
    enabled: !!companyId && !!employeeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*, leave_types!leave_requests_leave_type_id_fkey(name)')
        .eq('company_id', companyId!)
        .eq('employee_id', employeeId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: 'cancelled' } as any)
        .eq('id', id)
        .eq('employee_id', employeeId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
      toast.success('Leave request cancelled');
    },
    onError: () => toast.error('Failed to cancel'),
  });

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const calRequests = requests.filter(r => {
    if (r.status !== 'approved' && r.status !== 'pending') return false;
    return r.start_date <= format(monthEnd, 'yyyy-MM-dd') && r.end_date >= format(monthStart, 'yyyy-MM-dd');
  });

  return (
    <div style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">My Leave Requests</h3>
        <div className="flex gap-1">
          <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === 'calendar' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('calendar')}>
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="rounded-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Half Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No leave requests</TableCell></TableRow>
              ) : requests.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{(r as any).leave_types?.name || '-'}</TableCell>
                  <TableCell className="text-sm">{r.start_date}</TableCell>
                  <TableCell className="text-sm">{r.end_date}</TableCell>
                  <TableCell className="text-sm">{r.days_requested}</TableCell>
                  <TableCell className="text-sm">{(r as any).half_day ? ((r as any).half_day_period || 'Yes') : '-'}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: statusStyles[r.status]?.bg, color: statusStyles[r.status]?.text }} className="text-xs font-medium border-0">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => cancelMutation.mutate(r.id)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Select value={format(calMonth, 'yyyy-MM')} onValueChange={v => setCalMonth(new Date(v + '-01'))}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const d = new Date(calMonth.getFullYear(), i, 1);
                  return <SelectItem key={i} value={format(d, 'yyyy-MM')}>{format(d, 'MMMM yyyy')}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-0.5 overflow-x-auto">
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const req = calRequests.find(r => r.start_date <= dateStr && r.end_date >= dateStr);
              const style = req ? statusStyles[req.status] : undefined;
              return (
                <div
                  key={dateStr}
                  className="flex flex-col items-center min-w-[32px] rounded px-1 py-1 text-[10px]"
                  style={style ? { backgroundColor: style.bg, color: style.text } : {}}
                  title={req ? `${(req as any).leave_types?.name} (${req.status})` : undefined}
                >
                  <span className="font-medium">{format(day, 'd')}</span>
                  <span className="text-[8px]">{format(day, 'EEE')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequestsTab;
