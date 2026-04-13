import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveTypeForm {
  name: string;
  annual_entitlement: number;
  is_paid: boolean;
  allow_carry_over: boolean;
  max_carry_over: number;
  apply_proration: boolean;
  is_active: boolean;
}

const emptyForm: LeaveTypeForm = {
  name: '',
  annual_entitlement: 0,
  is_paid: true,
  allow_carry_over: false,
  max_carry_over: 0,
  apply_proration: false,
  is_active: true,
};

const LeaveTypesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; editId: string | null }>({ open: false, editId: null });
  const [form, setForm] = useState<LeaveTypeForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['settings-leave-types', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from('leave_types').select('*').eq('company_id', companyId!).order('name');
      return data || [];
    },
  });

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ open: true, editId: null });
  };

  const openEdit = (lt: any) => {
    setForm({
      name: lt.name,
      annual_entitlement: lt.annual_entitlement,
      is_paid: lt.is_paid,
      allow_carry_over: lt.allow_carry_over,
      max_carry_over: lt.max_carry_over,
      apply_proration: lt.apply_proration,
      is_active: lt.is_active,
    });
    setModal({ open: true, editId: lt.id });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (modal.editId) {
        const { error } = await supabase.from('leave_types').update({
          name: form.name.trim(),
          annual_entitlement: form.annual_entitlement,
          is_paid: form.is_paid,
          allow_carry_over: form.allow_carry_over,
          max_carry_over: form.allow_carry_over ? form.max_carry_over : 0,
          apply_proration: form.apply_proration,
          is_active: form.is_active,
        } as any).eq('id', modal.editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('leave_types').insert({
          company_id: companyId!,
          name: form.name.trim(),
          annual_entitlement: form.annual_entitlement,
          is_paid: form.is_paid,
          allow_carry_over: form.allow_carry_over,
          max_carry_over: form.allow_carry_over ? form.max_carry_over : 0,
          apply_proration: form.apply_proration,
          is_active: form.is_active,
        } as any);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['settings-leave-types'] });
      setModal({ open: false, editId: null });
      toast.success(modal.editId ? 'Leave type updated' : 'Leave type added');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('leave_types').update({ is_active: !current } as any).eq('id', id);
    if (error) toast.error('Failed');
    else {
      queryClient.invalidateQueries({ queryKey: ['settings-leave-types'] });
      toast.success(!current ? 'Activated' : 'Deactivated');
    }
  };

  return (
    <div style={{ fontFamily: 'var(--ff-body)' }} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">Leave Types</h3>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Leave Type</Button>
      </div>

      <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Entitlement</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Carry Over</TableHead>
              <TableHead>Proration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No leave types</TableCell></TableRow>
            ) : leaveTypes.map((lt: any) => (
              <TableRow key={lt.id}>
                <TableCell className="text-sm font-medium">{lt.name}</TableCell>
                <TableCell className="text-sm text-right">{lt.annual_entitlement}</TableCell>
                <TableCell className="text-sm">{lt.is_paid ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-sm">{lt.allow_carry_over ? `Yes (max ${lt.max_carry_over})` : 'No'}</TableCell>
                <TableCell className="text-sm">{lt.apply_proration ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Badge
                    className="text-xs cursor-pointer border-0"
                    style={{
                      backgroundColor: lt.is_active ? '#D1FAE5' : '#F3F4F6',
                      color: lt.is_active ? '#065F46' : '#374151',
                    }}
                    onClick={() => toggleActive(lt.id, lt.is_active)}
                  >
                    {lt.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(lt)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modal.open} onOpenChange={open => { if (!open) setModal({ open: false, editId: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-body)' }}>{modal.editId ? 'Edit Leave Type' : 'Add Leave Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Annual Entitlement (days)</Label>
              <Input type="number" value={form.annual_entitlement} onChange={e => setForm({ ...form, annual_entitlement: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Is Paid</Label>
              <Switch checked={form.is_paid} onCheckedChange={v => setForm({ ...form, is_paid: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Allow Carry Over</Label>
              <Switch checked={form.allow_carry_over} onCheckedChange={v => setForm({ ...form, allow_carry_over: v })} />
            </div>
            {form.allow_carry_over && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Max Carry Over Days</Label>
                <Input type="number" value={form.max_carry_over} onChange={e => setForm({ ...form, max_carry_over: parseInt(e.target.value) || 0 })} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Apply Proration</Label>
              <Switch checked={form.apply_proration} onCheckedChange={v => setForm({ ...form, apply_proration: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Is Active</Label>
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false, editId: null })}>Cancel</Button>
            <Button disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveTypesTab;
