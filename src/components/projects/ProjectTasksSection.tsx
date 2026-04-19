import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Props {
  projectId: string;
  companyId: string;
  employeeId: string;
  /** Employees assigned to this project, for the assign-to dropdown */
  teamMembers: Array<{ id: string; full_name: string; avatar_url?: string | null; designation?: string | null }>;
  /** Whether the current user can add/delete tasks */
  canManage: boolean;
}

const isAssignee = (taskAssignedTo: string | null | undefined, employeeId: string) =>
  !!taskAssignedTo && taskAssignedTo === employeeId;

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?';

const toIso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

async function logProjectActivity(params: {
  companyId: string;
  projectId: string;
  employeeId: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
}) {
  await supabase.from('project_activity_logs').insert({
    company_id: params.companyId,
    project_id: params.projectId,
    employee_id: params.employeeId,
    action: params.action,
    old_value: params.oldValue,
    new_value: params.newValue,
  });
}

export const ProjectTasksSection = ({ projectId, companyId, employeeId, teamMembers, canManage }: Props) => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDeadline, setNewDeadline] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('id, title, deadline, is_completed, completed_at, assigned_to, created_at, assignee:employees!project_tasks_assigned_to_fkey(id, full_name, avatar_url)')
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('is_completed', { ascending: true })
        .order('deadline', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { incomplete, complete } = useMemo(() => {
    const all = tasks ?? [];
    return {
      incomplete: all.filter((t: any) => !t.is_completed),
      complete: all.filter((t: any) => t.is_completed),
    };
  }, [tasks]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    qc.invalidateQueries({ queryKey: ['project-task-counts'] });
    qc.invalidateQueries({ queryKey: ['my-tasks'] });
    qc.invalidateQueries({ queryKey: ['project-activity-inline', projectId] });
  };

  const addMutation = useMutation({
    mutationFn: async () => {
      const title = newTitle.trim();
      if (!title) throw new Error('Task title is required');
      const { error } = await supabase.from('project_tasks').insert({
        company_id: companyId,
        project_id: projectId,
        title,
        assigned_to: newAssignee || null,
        deadline: newDeadline || null,
        created_by: employeeId,
      });
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId, employeeId,
        action: 'task_added', oldValue: null, newValue: title,
      });
    },
    onSuccess: () => {
      setNewTitle(''); setNewAssignee(''); setNewDeadline(null); setAdding(false);
      invalidate();
      toast({ title: 'Task added' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (task: any) => {
      const next = !task.is_completed;
      const { error } = await supabase.from('project_tasks').update({
        is_completed: next,
        completed_at: next ? new Date().toISOString() : null,
        completed_by: next ? employeeId : null,
      }).eq('id', task.id);
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId, employeeId,
        action: next ? 'task_completed' : 'task_reopened',
        oldValue: task.title,
        newValue: next ? 'completed' : 'reopened',
      });
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (task: any) => {
      const { error } = await supabase.from('project_tasks').delete().eq('id', task.id);
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId, employeeId,
        action: 'task_deleted', oldValue: task.title, newValue: null,
      });
    },
    onSuccess: () => {
      setDeleteTarget(null);
      invalidate();
      toast({ title: 'Task deleted' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const today = startOfDay(new Date());

  const renderTask = (t: any) => {
    const overdue = !t.is_completed && t.deadline && isBefore(parseISO(t.deadline), today);
    return (
      <li
        key={t.id}
        className={cn(
          'flex items-center gap-3 py-2 px-2 rounded-md hover:bg-background/60 group',
          t.is_completed && 'opacity-60',
        )}
      >
        <Checkbox
          checked={t.is_completed}
          onCheckedChange={() => toggleMutation.mutate(t)}
          disabled={toggleMutation.isPending}
          aria-label={t.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <span className={cn('flex-1 text-sm text-foreground min-w-0 truncate', t.is_completed && 'line-through')}>
          {t.title}
        </span>
        {t.assignee && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Avatar className="h-5 w-5">
              {t.assignee.avatar_url && <AvatarImage src={t.assignee.avatar_url} alt={t.assignee.full_name} />}
              <AvatarFallback className="text-[9px]">{initials(t.assignee.full_name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{t.assignee.full_name}</span>
          </div>
        )}
        {t.deadline && (
          <span className={cn('text-xs shrink-0', overdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
            {format(parseISO(t.deadline), 'MMM d')}
          </span>
        )}
        {canManage && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setDeleteTarget(t)}
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading tasks…</p>
      ) : incomplete.length === 0 && complete.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet</p>
      ) : (
        <ul className="space-y-0.5">
          {incomplete.map(renderTask)}
          {complete.map(renderTask)}
        </ul>
      )}

      {canManage && !adding && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
        </Button>
      )}

      {canManage && adding && (
        <div className="border border-border rounded-md p-3 bg-card space-y-3">
          <Input
            autoFocus
            placeholder="Task title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <SearchableEmployeeSelect
              employees={teamMembers}
              value={newAssignee}
              onValueChange={setNewAssignee}
              placeholder="Assign to (optional)"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn('justify-start font-normal', !newDeadline && 'text-muted-foreground')}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {newDeadline ? format(parseISO(newDeadline), 'PPP') : 'Deadline (optional)'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDeadline ? parseISO(newDeadline) : undefined}
                  onSelect={d => setNewDeadline(d ? toIso(d) : null)}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setAdding(false); setNewTitle(''); setNewAssignee(''); setNewDeadline(null); }}
              disabled={addMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => addMutation.mutate()}
              disabled={!newTitle.trim() || addMutation.isPending}
            >
              {addMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteTarget)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
