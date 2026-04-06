import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, X, Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

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

  // Fetch employee department counts
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
        if (e.department) {
          counts[e.department] = (counts[e.department] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!companyId,
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [newDept, setNewDept] = useState('');
  const [saving, setSaving] = useState(false);
  const [removeErrors, setRemoveErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setDepartments((company as any).departments || ['GC Team', 'MEP Team', 'Admin', 'Director']);
    }
  }, [company]);

  const handleAdd = () => {
    const name = newDept.trim();
    if (!name) return;
    if (departments.includes(name)) {
      toast.error('Department already exists');
      return;
    }
    setDepartments(prev => [...prev, name]);
    setNewDept('');
  };

  const handleRemove = (dept: string) => {
    const count = deptCounts?.[dept] || 0;
    if (count > 0) {
      setRemoveErrors(prev => ({
        ...prev,
        [dept]: `Cannot remove ${dept} — ${count} employee${count > 1 ? 's are' : ' is'} currently assigned to this department`,
      }));
      return;
    }
    setRemoveErrors(prev => {
      const next = { ...prev };
      delete next[dept];
      return next;
    });
    setDepartments(prev => prev.filter(d => d !== dept));
  };

  const handleSave = useCallback(async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({ departments } as any)
        .eq('id', companyId);
      if (error) throw error;
      toast.success('Departments updated');
      qc.invalidateQueries({ queryKey: ['company-settings'] });
      qc.invalidateQueries({ queryKey: ['company-departments'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [companyId, departments, qc]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-[200px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Departments
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          Manage company departments. These appear as options in the employee form.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {departments.map(dept => (
            <div key={dept} className="flex flex-col">
              <Badge
                variant="secondary"
                className="text-[13px] px-3 py-1.5 gap-1.5"
                style={{ fontFamily: 'var(--ff-body)' }}
              >
                {dept}
                <button
                  onClick={() => handleRemove(dept)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              {removeErrors[dept] && (
                <p className="text-[10px] text-destructive mt-1 max-w-[200px]" style={{ fontFamily: 'var(--ff-body)' }}>
                  {removeErrors[dept]}
                </p>
              )}
            </div>
          ))}
          {departments.length === 0 && (
            <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
              No departments added yet.
            </p>
          )}
        </div>

        <div className="flex gap-2 max-w-sm">
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
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Departments
        </Button>
      </div>
    </div>
  );
};

export default DepartmentsTab;
