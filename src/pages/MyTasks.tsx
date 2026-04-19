import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { ListChecks } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'pending' | 'completed';

const MyTasks = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const employeeId = employee?.employee_id;
  const companyId = employee?.company_id;

  const [filter, setFilter] = useState<Filter>('pending');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks', employeeId, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('id, title, deadline, is_completed, completed_at, project_id, project:projects!project_tasks_project_id_fkey(id, project_code, project_name)')
        .eq('company_id', companyId!)
        .eq('assigned_to', employeeId!);
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId && !!companyId,
  });

  const today = startOfDay(new Date());

  const filtered = useMemo(() => {
    const list = tasks ?? [];
    const byFilter = list.filter((t: any) => {
      if (filter === 'pending') return !t.is_completed;
      if (filter === 'completed') return t.is_completed;
      return true;
    });
    // Sort by deadline ascending (no deadline last); within same deadline, incomplete first
    return [...byFilter].sort((a: any, b: any) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [tasks, filter]);

  const counts = useMemo(() => {
    const list = tasks ?? [];
    return {
      all: list.length,
      pending: list.filter((t: any) => !t.is_completed).length,
      completed: list.filter((t: any) => t.is_completed).length,
    };
  }, [tasks]);

  const toggleMutation = useMutation({
    mutationFn: async (task: any) => {
      const next = !task.is_completed;
      const { error } = await supabase.from('project_tasks').update({
        is_completed: next,
        completed_at: next ? new Date().toISOString() : null,
        completed_by: next ? employeeId : null,
      }).eq('id', task.id);
      if (error) throw error;
      // Activity log
      await supabase.from('project_activity_logs').insert({
        company_id: companyId,
        project_id: task.project_id,
        employee_id: employeeId,
        action: next ? 'task_completed' : 'task_reopened',
        old_value: task.title,
        new_value: next ? 'completed' : 'reopened',
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-tasks'] });
      qc.invalidateQueries({ queryKey: ['project-tasks'] });
      qc.invalidateQueries({ queryKey: ['project-task-counts'] });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="p-6 space-y-6">
      <Tabs value={filter} onValueChange={v => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ListChecks className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">
            {filter === 'pending' ? 'No pending tasks' : filter === 'completed' ? 'No completed tasks' : 'No tasks assigned'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="w-[140px]">Deadline</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t: any) => {
                const overdue = !t.is_completed && t.deadline && isBefore(parseISO(t.deadline), today);
                return (
                  <TableRow key={t.id} className={cn(t.is_completed && 'opacity-60')}>
                    <TableCell>
                      <Checkbox
                        checked={t.is_completed}
                        onCheckedChange={() => toggleMutation.mutate(t)}
                        disabled={toggleMutation.isPending}
                        aria-label={t.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                      />
                    </TableCell>
                    <TableCell className={cn('font-medium', t.is_completed && 'line-through')}>
                      {t.title}
                    </TableCell>
                    <TableCell>
                      {t.project ? (
                        <Link to={`/projects/${t.project.id}`} className="text-primary hover:underline">
                          <span className="font-mono text-xs text-muted-foreground mr-2">{t.project.project_code}</span>
                          {t.project.project_name}
                        </Link>
                      ) : '—'}
                    </TableCell>
                    <TableCell className={cn('text-sm', overdue && 'text-destructive font-medium')}>
                      {t.deadline ? format(parseISO(t.deadline), 'MMM d, yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      {t.is_completed ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
                      ) : overdue ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
