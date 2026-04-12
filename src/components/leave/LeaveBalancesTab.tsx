import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ensureLeaveBalance } from '@/lib/leave-utils';

const LeaveBalancesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const [adjustModal, setAdjustModal] = useState<{ open: boolean; balanceId: string | null; empName: string; ltName: string; current: number }>({
    open: false, balanceId: null, empName: '', ltName: '', current: 0,
  });
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

  // Ensure balances exist for all employees x leave types
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

  const handleAdjust = async () => {
    if (!adjustModal.balanceId || !adjReason.trim() || !adjDays) return;
    setSaving(true);
    try {
      const days = parseFloat(adjDays);
      if (isNaN(days)) { toast.error('Invalid number'); return; }

      const balance = balances.find((b: any) => b.id === adjustModal.balanceId);
      if (!balance) return;

      const prevAdj = balance.adjustment_days || 0;
      const newAdj = prevAdj + days;
      const prevBalance = (balance.system_days || 0) + prevAdj + (balance.carried_over_days || 0) - (balance.used_days || 0);
      const newBalance = prevBalance + days;

      const { error } = await supabase
        .from('leave_balances')
        .update({ adjustment_days: newAdj } as any)
        .eq('id', adjustModal.balanceId);
      if (error) throw error;

      await supabase.from('leave_balance_history').insert({
        company_id: companyId!,
        leave_balance_id: adjustModal.balanceId,
        adjusted_by: employee!.employee_id,
        adjustment_days: days,
        previous_balance: prevBalance,
        new_balance: newBalance,
        reason: adjReason.trim(),
      } as any);

      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      setAdjustModal({ open: false, balanceId: null, empName: '', ltName: '', current: 0 });
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
      <div className="rounded-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead className="text-right">Entitlement</TableHead>
              <TableHead className="text-right">Carried Over</TableHead>
              <TableHead className="text-right">Adjustments</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No balances</TableCell></TableRow>
            ) : balances.map((b: any) => {
              const remaining = (b.system_days || 0) + (b.adjustment_days || 0) + (b.carried_over_days || 0) - (b.used_days || 0);
              return (
                <TableRow key={b.id}>
                  <TableCell className="text-sm font-medium">{b.employees?.full_name || '-'}</TableCell>
                  <TableCell className="text-sm">{b.leave_types?.name || '-'}</TableCell>
                  <TableCell className="text-sm text-right">{b.system_days}</TableCell>
                  <TableCell className="text-sm text-right">{b.carried_over_days}</TableCell>
                  <TableCell className="text-sm text-right">{b.adjustment_days}</TableCell>
                  <TableCell className="text-sm text-right">{b.used_days}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{remaining}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setAdjustModal({
                        open: true,
                        balanceId: b.id,
                        empName: b.employees?.full_name || '',
                        ltName: b.leave_types?.name || '',
                        current: remaining,
                      })}
                    >
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={adjustModal.open} onOpenChange={open => { if (!open) setAdjustModal({ open: false, balanceId: null, empName: '', ltName: '', current: 0 }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-body)' }}>Adjust Balance</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{adjustModal.empName} — {adjustModal.ltName} (Current: {adjustModal.current})</p>
          <div className="space-y-3">
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
            <Button variant="outline" onClick={() => setAdjustModal({ open: false, balanceId: null, empName: '', ltName: '', current: 0 })}>Cancel</Button>
            <Button disabled={!adjDays || !adjReason.trim() || saving} onClick={handleAdjust}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveBalancesTab;
