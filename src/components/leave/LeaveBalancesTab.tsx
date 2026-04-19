import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableHeader } from '@/components/ui/sortable-header';
import { useSort } from '@/hooks/useSort';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ensureLeaveBalance } from '@/lib/leave-utils';

const LeaveBalancesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const [adjustModal, setAdjustModal] = useState<{ open: boolean; employeeId: string; empName: string }>({
    open: false, employeeId: '', empName: '',
  });
  const [adjLeaveType, setAdjLeaveType] = useState('');
  const [adjDays, setAdjDays] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: employees = [] } = useQuery({
    queryKey: ['leave-bal-employees', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name').eq('company_id', companyId!).eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-bal-types', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('leave_types').select('*').eq('company_id', companyId!).eq('is_active', true).order('name');
      return data || [];
    },
  });

  // Ensure balances exist
  useEffect(() => {
    if (!companyId || employees.length === 0 || leaveTypes.length === 0) return;
    (async () => {
      for (const emp of employees) {
        for (const lt of leaveTypes) {
          await ensureLeaveBalance(companyId, emp.id, lt.id, currentYear);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['leave-balances', companyId] });
    })();
  }, [companyId, employees, leaveTypes, currentYear]);

  const { data: balances = [] } = useQuery({
    queryKey: ['leave-balances', companyId, currentYear],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from('leave_balances')
        .select('*, employees!leave_balances_employee_id_fkey(full_name), leave_types!leave_balances_leave_type_id_fkey(name)')
        .eq('company_id', companyId!)
        .eq('year', currentYear)
        .order('employee_id');
      return data || [];
    },
  });

  // Pivot: group balances by employee
  const employeeRows = employees.map(emp => {
    const empBalances: Record<string, { used: number; remaining: number; balanceId: string }> = {};
    for (const lt of leaveTypes) {
      const b = (balances as any[]).find((bal: any) => bal.employee_id === emp.id && bal.leave_type_id === lt.id);
      if (b) {
        const remaining = (b.system_days || 0) + (b.adjustment_days || 0) + (b.carried_over_days || 0) - (b.used_days || 0);
        empBalances[lt.id] = { used: b.used_days || 0, remaining, balanceId: b.id };
      } else {
        empBalances[lt.id] = { used: 0, remaining: lt.annual_entitlement || 0, balanceId: '' };
      }
    }
    return { id: emp.id, name: emp.full_name, balances: empBalances };
  });

  const handleAdjust = async () => {
    if (!adjustModal.employeeId || !adjLeaveType || !adjDays || !adjReason.trim()) return;
    setSaving(true);
    try {
      const days = parseFloat(adjDays);
      if (isNaN(days)) { toast.error('Invalid number'); setSaving(false); return; }

      const empRow = employeeRows.find(e => e.id === adjustModal.employeeId);
      const balInfo = empRow?.balances[adjLeaveType];
      if (!balInfo?.balanceId) { toast.error('Balance not found'); setSaving(false); return; }

      const balance = (balances as any[]).find((b: any) => b.id === balInfo.balanceId);
      if (!balance) { setSaving(false); return; }

      const prevAdj = balance.adjustment_days || 0;
      const newAdj = prevAdj + days;
      const prevBalance = balInfo.remaining;
      const newBalance = prevBalance + days;

      const { error } = await supabase
        .from('leave_balances')
        .update({ adjustment_days: newAdj } as any)
        .eq('id', balInfo.balanceId);
      if (error) throw error;

      await supabase.from('leave_balance_history').insert({
        company_id: companyId!,
        leave_balance_id: balInfo.balanceId,
        adjusted_by: employee!.employee_id,
        adjustment_days: days,
        previous_balance: prevBalance,
        new_balance: newBalance,
        reason: adjReason.trim(),
      } as any);

      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      setAdjustModal({ open: false, employeeId: '', empName: '' });
      setAdjLeaveType('');
      setAdjDays('');
      setAdjReason('');
      toast.success('Balance adjusted');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--ff-body)' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Leave Balances — {currentYear}</h3>
      <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              {leaveTypes.map((lt: any) => (
                <TableHead key={lt.id} className="text-center">{lt.name}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeRows.length === 0 ? (
              <TableRow><TableCell colSpan={leaveTypes.length + 2} className="text-center text-muted-foreground">No employees</TableCell></TableRow>
            ) : employeeRows.map(row => (
              <TableRow key={row.id}>
                <TableCell className="text-sm font-medium">{row.name}</TableCell>
                {leaveTypes.map((lt: any) => {
                  const b = row.balances[lt.id];
                  return (
                    <TableCell key={lt.id} className="text-sm text-center">
                      <span className="text-muted-foreground">{b?.used ?? 0}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="font-medium">{b?.remaining ?? 0}</span>
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setAdjustModal({ open: true, employeeId: row.id, empName: row.name })}
                  >
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={adjustModal.open} onOpenChange={open => { if (!open) setAdjustModal({ open: false, employeeId: '', empName: '' }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-body)' }}>Adjust Balance — {adjustModal.empName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Leave Type</Label>
              <Select value={adjLeaveType} onValueChange={setAdjLeaveType}>
                <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((lt: any) => (
                    <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Adjustment Days (+ or −)</Label>
              <Input type="number" step="0.5" value={adjDays} onChange={e => setAdjDays(e.target.value)} placeholder="e.g. 2 or -1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Reason (required)</Label>
              <Textarea value={adjReason} onChange={e => setAdjReason(e.target.value)} rows={2} placeholder="Enter reason..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustModal({ open: false, employeeId: '', empName: '' })}>Cancel</Button>
            <Button disabled={!adjLeaveType || !adjDays || !adjReason.trim() || saving} onClick={handleAdjust}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveBalancesTab;
