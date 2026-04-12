import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { List, CalendarDays, Check, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { sendNotification } from '@/lib/notifications';

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
  cancelled: { bg: '#F3F4F6', text: '#374151' },
};

const AllRequestsTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; requestId: string | null }>({ open: false, requestId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [calMonth, setCalMonth] = useState(() => new Date());

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['all-leave-requests', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*, leave_types!leave_requests_leave_type_id_fkey(name), employees!leave_requests_employee_id_fkey(full_name)')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-for-leave', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name').eq('company_id', companyId!).eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-types-filter', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('leave_types').select('id, name').eq('company_id', companyId!).eq('is_active', true).order('name');
      return data || [];
    },
  });

  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (employeeFilter !== 'all' && r.employee_id !== employeeFilter) return false;
    if (typeFilter !== 'all' && r.leave_type_id !== typeFilter) return false;
    return true;
  });

  const approveMutation = useMutation({
    mutationFn: async (request: any) => {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          actioned_by: employee!.employee_id,
          actioned_at: new Date().toISOString(),
        } as any)
        .eq('id', request.id);
      if (error) throw error;

      // TODO: Attendance integration — wire to attendance_records in Sprint A3

      // Update used_days
      const year = new Date(request.start_date).getFullYear();
      const { data: balance } = await supabase
        .from('leave_balances')
        .select('id, used_days')
        .eq('company_id', companyId!)
        .eq('employee_id', request.employee_id)
        .eq('leave_type_id', request.leave_type_id)
        .eq('year', year)
        .single();

      if (balance) {
        await supabase
          .from('leave_balances')
          .update({ used_days: (balance.used_days || 0) + request.days_requested } as any)
          .eq('id', balance.id);
      }

      // Notify employee
      sendNotification({
        companyId: companyId!,
        recipientIds: [request.employee_id],
        type: 'leave_actioned',
        title: 'Leave Approved',
        message: `Your ${request.leave_types?.name || 'leave'} from ${request.start_date} to ${request.end_date} has been approved.`,
        referenceType: 'leave',
        referenceId: request.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leave-requests'] });
      toast.success('Leave approved');
    },
    onError: () => toast.error('Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      const req = requests.find(r => r.id === requestId);
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          actioned_by: employee!.employee_id,
          actioned_at: new Date().toISOString(),
        } as any)
        .eq('id', requestId);
      if (error) throw error;

      if (req) {
        sendNotification({
          companyId: companyId!,
          recipientIds: [req.employee_id],
          type: 'leave_actioned',
          title: 'Leave Rejected',
          message: `Your ${(req as any).leave_types?.name || 'leave'} request was not approved. Reason: ${reason}.`,
          referenceType: 'leave',
          referenceId: requestId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leave-requests'] });
      setRejectModal({ open: false, requestId: null });
      setRejectionReason('');
      toast.success('Leave rejected');
    },
    onError: () => toast.error('Failed to reject'),
  });

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const calRequests = filtered.filter(r => {
    if (r.status !== 'approved' && r.status !== 'pending') return false;
    return r.start_date <= format(monthEnd, 'yyyy-MM-dd') && r.end_date >= format(monthStart, 'yyyy-MM-dd');
  });

  // Group by employee for calendar
  const calEmployees = [...new Set(calRequests.map(r => r.employee_id))];
  const employeeMap = Object.fromEntries(employees.map(e => [e.id, e.full_name]));

  return (
    <div style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Employee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Leave Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {leaveTypes.map(lt => <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>Employee</TableHead>
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
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No leave requests</TableCell></TableRow>
              ) : filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm font-medium">{(r as any).employees?.full_name || '-'}</TableCell>
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
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" onClick={() => approveMutation.mutate(r)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setRejectModal({ open: true, requestId: r.id })}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-background px-2 py-1.5 text-left font-medium border-b border-r" style={{ borderColor: 'hsl(var(--border))' }}>Employee</th>
                  {daysInMonth.map(day => (
                    <th key={day.toISOString()} className="px-1 py-1.5 text-center font-medium border-b min-w-[28px]" style={{ borderColor: 'hsl(var(--border))' }}>
                      <div>{format(day, 'd')}</div>
                      <div className="text-[8px] text-muted-foreground">{format(day, 'EEE')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calEmployees.map(empId => {
                  const empRequests = calRequests.filter(r => r.employee_id === empId);
                  return (
                    <tr key={empId}>
                      <td className="sticky left-0 bg-background px-2 py-1 font-medium border-r whitespace-nowrap" style={{ borderColor: 'hsl(var(--border))' }}>
                        {employeeMap[empId] || 'Unknown'}
                      </td>
                      {daysInMonth.map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const req = empRequests.find(r => r.start_date <= dateStr && r.end_date >= dateStr);
                        const style = req ? statusStyles[req.status] : undefined;
                        return (
                          <td
                            key={dateStr}
                            className="px-1 py-1 text-center"
                            style={style ? { backgroundColor: style.bg, color: style.text } : {}}
                            title={req ? `${employeeMap[empId]}: ${(req as any).leave_types?.name} (${req.status})` : undefined}
                          >
                            {req ? '•' : ''}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {calEmployees.length === 0 && (
                  <tr><td colSpan={daysInMonth.length + 1} className="text-center py-4 text-muted-foreground">No leave requests this month</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <Dialog open={rejectModal.open} onOpenChange={open => { if (!open) { setRejectModal({ open: false, requestId: null }); setRejectionReason(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-body)' }}>Reject Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Rejection Reason (required)</Label>
            <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3} placeholder="Enter reason..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, requestId: null })}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim()}
              onClick={() => rejectMutation.mutate({ requestId: rejectModal.requestId!, reason: rejectionReason.trim() })}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllRequestsTab;
