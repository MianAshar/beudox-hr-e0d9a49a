import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchableEmployeeSelect, { EmployeeOption } from '@/components/SearchableEmployeeSelect';
import { toast } from '@/hooks/use-toast';
import { Plus, X, Loader2 } from 'lucide-react';

interface ManageTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  companyId: string;
  currentUserId: string;
}

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?';

export const ManageTeamModal = ({
  open, onOpenChange, projectId, projectName, companyId, currentUserId,
}: ManageTeamModalProps) => {
  const qc = useQueryClient();
  const [selectedToAdd, setSelectedToAdd] = useState('');

  const { data: assignments, isLoading: loadingAssignments } = useQuery({
    queryKey: ['manage-team-assignments', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_assignments')
        .select('id, employee_id, employees:employees!project_assignments_employee_id_fkey(id, full_name, designation, avatar_url)')
        .eq('project_id', projectId)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: allEmployees } = useQuery({
    queryKey: ['manage-team-employees', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, designation, avatar_url')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data as EmployeeOption[];
    },
    enabled: open,
  });

  const assignedIds = useMemo(
    () => new Set((assignments ?? []).map((a: any) => a.employee_id)),
    [assignments],
  );

  const availableEmployees = useMemo(
    () => (allEmployees ?? []).filter(e => !assignedIds.has(e.id)),
    [allEmployees, assignedIds],
  );

  const addMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase.from('project_assignments').insert({
        project_id: projectId,
        employee_id: employeeId,
        company_id: companyId,
        assigned_by: currentUserId,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['manage-team-assignments', projectId] });
      qc.invalidateQueries({ queryKey: ['project-team-members'] });
      qc.invalidateQueries({ queryKey: ['project-team', projectId] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      setSelectedToAdd('');
      toast({ title: 'Team member added' });
    },
    onError: (e: Error) => toast({ title: 'Failed to add', description: e.message, variant: 'destructive' }),
  });

  const removeMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('project_assignments')
        .update({ is_active: false, removed_at: new Date().toISOString() })
        .eq('id', assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['manage-team-assignments', projectId] });
      qc.invalidateQueries({ queryKey: ['project-team-members'] });
      qc.invalidateQueries({ queryKey: ['project-team', projectId] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Team member removed' });
    },
    onError: (e: Error) => toast({ title: 'Failed to remove', description: e.message, variant: 'destructive' }),
  });

  const handleAdd = () => {
    if (selectedToAdd) addMutation.mutate(selectedToAdd);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Team</DialogTitle>
          <DialogDescription>
            Add or remove team members for <strong className="text-foreground">{projectName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Add Team Member
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchableEmployeeSelect
                  employees={availableEmployees}
                  value={selectedToAdd}
                  onChange={setSelectedToAdd}
                  placeholder="Select employee…"
                />
              </div>
              <Button
                onClick={handleAdd}
                disabled={!selectedToAdd || addMutation.isPending}
                size="sm"
              >
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span className="ml-1.5">Add</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Current Team ({assignments?.length ?? 0})
            </label>
            {loadingAssignments ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !assignments || assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No team members assigned</p>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {assignments.map((a: any) => {
                  const emp = a.employees;
                  if (!emp) return null;
                  return (
                    <div key={a.id} className="flex items-center justify-between gap-3 p-2 rounded-md border bg-card">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-7 w-7">
                          {emp.avatar_url && <AvatarImage src={emp.avatar_url} alt={emp.full_name} />}
                          <AvatarFallback className="text-[10px]">{initials(emp.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{emp.full_name}</p>
                          {emp.designation && (
                            <p className="text-xs text-muted-foreground truncate">{emp.designation}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeMutation.mutate(a.id)}
                        disabled={removeMutation.isPending}
                        aria-label="Remove team member"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTeamModal;
