import { useState, useMemo } from 'react';
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
import TaskBoard from '@/components/tasks/TaskBoard';

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
        .select('id, title, deadline, is_completed, completed_at, project_id, project:projects!project_tasks_project_id_fkey(id, project_code, project_name, status)')
        .eq('company_id', companyId!)
        .eq('assigned_to', employeeId!);
      if (error) throw error;
      // Hide tasks belonging to pending projects
      return (data ?? []).filter((t: any) => t.project?.status !== 'pending');
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
      <TaskBoard scopeEmployeeId={employee?.employee_id} />
    </div>
  );
};

export default MyTasks;
