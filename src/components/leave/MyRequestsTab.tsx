import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth, isWeekend } from 'date-fns';
import { toast } from 'sonner';

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
  cancelled: { bg: '#F3F4F6', text: '#374151' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  // Fetch public holidays for calendar muted style
  const { data: publicHolidays = [] } = useQuery({
    queryKey: ['public-holidays-my', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('public_holidays').select('date').eq('company_id', companyId!);
      return (data || []).map((h: any) => h.date);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leave_requests').update({ status: 'cancelled' } as any).eq('id', id).eq('employee_id', employeeId!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leave-requests'] });
      toast.success('Leave request cancelled');
    },
    onError: () => toast.error('Failed to cancel'),
  });

  // Active requests (pending/approved) for calendar blocking
  const activeRequests = requests.filter((r: any) => r.status === 'approved' || r.status === 'pending');

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const holidaySet = new Set(publicHolidays);

  const getLeaveForDate = (dateStr: string) => {
    return activeRequests.find((r: any) => r.start_date <= dateStr && r.end_date >= dateStr);
  };

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
        <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
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
              ) : requests.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.leave_types?.name || '-'}</TableCell>
                  <TableCell className="text-sm">{r.start_date}</TableCell>
                  <TableCell className="text-sm">{r.end_date}</TableCell>
                  <TableCell className="text-sm">{r.days_requested}</TableCell>
                  <TableCell className="text-sm">{r.half_day ? (r.half_day_period || 'Yes') : '-'}</TableCell>
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
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCalMonth(prev => subMonths(prev, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold">{format(calMonth, 'MMMM yyyy')}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCalMonth(prev => addMonths(prev, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-px rounded-lg border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
            {WEEKDAYS.map(d => (
              <div key={d} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {calDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const inMonth = isSameMonth(day, calMonth);
              const isWkend = isWeekend(day);
              const isHoliday = holidaySet.has(dateStr);
              const leave = inMonth ? getLeaveForDate(dateStr) : null;
              const style = leave ? statusStyles[leave.status] : undefined;
              const isMuted = !inMonth || isWkend || isHoliday;

              return (
                <div
                  key={dateStr}
                  className={cn(
                    'min-h-[72px] p-1.5 text-xs border-t',
                    !inMonth && 'opacity-30',
                    isMuted && !leave && 'bg-muted/40',
                  )}
                  style={{
                    borderColor: 'hsl(var(--border))',
                    ...(style ? { backgroundColor: style.bg, color: style.text } : {}),
                  }}
                >
                  <div className="font-medium mb-0.5">{format(day, 'd')}</div>
                  {leave && (
                    <div className="text-[10px] leading-tight font-medium truncate">{(leave as any).leave_types?.name}</div>
                  )}
                  {isMuted && !leave && isHoliday && inMonth && (
                    <div className="text-[9px] text-muted-foreground">Holiday</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default MyRequestsTab;
