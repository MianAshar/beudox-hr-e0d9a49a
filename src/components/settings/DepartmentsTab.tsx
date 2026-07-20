import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus, Pencil, Check, X, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
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

type DeptRow = { id: string; original: string | null; name: string };

const genId = () => Math.random().toString(36).slice(2, 10);

const DepartmentsTab = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;

  const { data: company, isLoading } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: deptCounts } = useQuery({
    queryKey: ['department-counts', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('department')
        .eq('company_id', companyId!)
        .eq('status', 'active');
      if (error) throw error;
      const counts: Record<string, number> = {};
      data?.forEach(e => {
        if (e.department) counts[e.department] = (counts[e.department] || 0) + 1;
      });
      return counts;
    },
    enabled: !!companyId,
  });

  const [rows, setRows] = useState<DeptRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newDept, setNewDept] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeptRow | null>(null);

  useEffect(() => {
    if (company) {
      const list: string[] = (company as any).departments || ['GC Team', 'MEP Team', 'Admin', 'Director'];
      setRows(list.map(name => ({ id: genId(), original: name, name })));
    }
  }, [company]);

  const countFor = (row: DeptRow) => (row.original ? deptCounts?.[row.original] || 0 : 0);

  const startEdit = (row: DeptRow) => {
    setEditingId(row.id);
    setEditValue(row.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const commitEdit = (id: string) => {
    const name = editValue.trim();
    if (!name) {
      toast.error('Department name cannot be empty');
      return;
    }
    if (rows.some(r => r.id !== id && r.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Department already exists');
      return;
    }
    setRows(prev => prev.map(r => (r.id === id ? { ...r, name } : r)));
    setEditingId(null);
    setEditValue('');
  };

  const handleAdd = () => {
    const name = newDept.trim();
    if (!name) return;
    if (rows.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Department already exists');
      return;
    }
    setRows(prev => [...prev, { id: genId(), original: null, name }]);
    setNewDept('');
  };

  const confirmDelete = (row: DeptRow) => {
    if (countFor(row) > 0) {
      toast.error(
        `Cannot delete ${row.original} — ${countFor(row)} employee${countFor(row) > 1 ? 's are' : ' is'} assigned to this department`
      );
      return;
    }
    setDeleteTarget(row);
  };

  const performDelete = () => {
    if (!deleteTarget) return;
    setRows(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSave = useCallback(async () => {
    if (!companyId) return;
    // Determine renames (original present, name changed)
    const renames = rows
      .filter(r => r.original && r.original !== r.name)
      .map(r => ({ from: r.original as string, to: r.name }));
    const names = rows.map(r => r.name);

    setSaving(true);
    try {
      // Apply renames to employees first so the array update never orphans rows
      for (const { from, to } of renames) {
        const { error } = await supabase
          .from('employees')
          .update({ department: to })
          .eq('company_id', companyId)
          .eq('department', from);
        if (error) throw error;
      }

      const { error } = await supabase
        .from('companies')
        .update({ departments: names } as any)
        .eq('id', companyId);
      if (error) throw error;

      toast.success('Departments updated');
      qc.invalidateQueries({ queryKey: ['company-settings'] });
      qc.invalidateQueries({ queryKey: ['company-departments'] });
      qc.invalidateQueries({ queryKey: ['department-counts'] });
      qc.invalidateQueries({ queryKey: ['employees'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [companyId, rows, qc]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-[14px] border p-6"
        style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}
      >
        <h3
          className="text-[16px] font-semibold text-foreground mb-1"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Departments
        </h3>
        <p
          className="text-[13px] text-muted-foreground mb-5"
          style={{ fontFamily: 'var(--ff-body)' }}
        >
          Manage company departments. Rename, remove, or add departments. Renames automatically apply
          to all employees currently assigned.
        </p>

        {/* List */}
        <div className="divide-y rounded-[10px] border" style={{ borderColor: 'hsl(var(--border))' }}>
          {rows.length === 0 && (
            <p
              className="text-[13px] text-muted-foreground p-4"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              No departments added yet.
            </p>
          )}
          {rows.map(row => {
            const count = countFor(row);
            const isEditing = editingId === row.id;
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                {isEditing ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit(row.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="h-9 max-w-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary"
                      onClick={() => commitEdit(row.id)}
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={cancelEdit}
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span
                      className="text-[14px] text-foreground flex-1"
                      style={{ fontFamily: 'var(--ff-body)' }}
                    >
                      {row.name}
                    </span>
                    {count > 0 && (
                      <span
                        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground"
                        style={{ fontFamily: 'var(--ff-body)' }}
                        title={`${count} active employee${count > 1 ? 's' : ''}`}
                      >
                        <Users className="h-3.5 w-3.5" />
                        {count}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startEdit(row)}
                      title="Rename"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => confirmDelete(row)}
                      disabled={count > 0}
                      title={count > 0 ? 'Reassign employees before deleting' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add */}
        <div className="flex gap-2 max-w-sm mt-4">
          <Input
            value={newDept}
            onChange={e => setNewDept(e.target.value)}
            placeholder="New department name"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="outline" size="sm" onClick={handleAdd} className="shrink-0 gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || editingId !== null}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Departments
        </Button>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete department?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-semibold">{deleteTarget?.name}</span> from the department
              list. This won't take effect until you click Save Departments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentsTab;
