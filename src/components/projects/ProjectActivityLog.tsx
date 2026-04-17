import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

interface ProjectActivityLogProps {
  projectId: string;
  companyId: string;
}

const actionLabels: Record<string, string> = {
  status_changed: 'Status changed',
  deadline_changed: 'Deadline changed',
};

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatValue = (action: string, value: string | null) => {
  if (!value) return '—';
  if (action === 'status_changed') return fmt(value);
  if (action === 'deadline_changed') return formatDate(value);
  return value;
};

export const ProjectActivityLog = ({ projectId, companyId }: ProjectActivityLogProps) => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['project-activity', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_activity_logs')
        .select('id, action, old_value, new_value, created_at, employee_id, employees:employees!project_activity_logs_employee_id_fkey(full_name)')
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId && !!companyId,
  });

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
        <History className="h-4 w-4" /> Activity Log
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !logs || logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log: any) => (
            <li key={log.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                  {actionLabels[log.action] || fmt(log.action)}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(log.created_at)}
                </span>
              </div>
              <div className="text-sm text-foreground">
                <span className="text-muted-foreground">{formatValue(log.action, log.old_value)}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="font-medium">{formatValue(log.action, log.new_value)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                by {log.employees?.full_name || 'Unknown'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
