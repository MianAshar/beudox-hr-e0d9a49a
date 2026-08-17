import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  History, GitBranch, Clock, MapPin, FileText, Play,
  CheckSquare, Trash2, RotateCcw, Pencil, AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/format-date';

interface ProjectActivityLogProps {
  projectId: string;
  companyId: string;
}

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\bQc\b/g, 'QC');

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
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

interface ActionConfig {
  icon: React.ReactNode;
  color: string;
  label: string;
  dot: string;
}

const getActionConfig = (action: string): ActionConfig => {
  const configs: Record<string, ActionConfig> = {
    status_changed:   { icon: <GitBranch className="h-3.5 w-3.5" />, color: 'text-blue-600',   dot: 'bg-blue-500',   label: 'Status changed' },
    deadline_changed: { icon: <Clock className="h-3.5 w-3.5" />,     color: 'text-amber-600',  dot: 'bg-amber-500',  label: 'Deadline changed' },
    name_changed:     { icon: <Pencil className="h-3.5 w-3.5" />,    color: 'text-violet-600', dot: 'bg-violet-500', label: 'Name changed' },
    location_changed: { icon: <MapPin className="h-3.5 w-3.5" />,    color: 'text-teal-600',   dot: 'bg-teal-500',   label: 'Location changed' },
    scope_updated:    { icon: <FileText className="h-3.5 w-3.5" />,  color: 'text-orange-600', dot: 'bg-orange-500', label: 'Scope updated' },
    notes_updated:    { icon: <FileText className="h-3.5 w-3.5" />,  color: 'text-orange-600', dot: 'bg-orange-500', label: 'Instructions updated' },
    project_started:  { icon: <Play className="h-3.5 w-3.5" />,      color: 'text-green-600',  dot: 'bg-green-500',  label: 'Project started' },
    task_added:       { icon: <CheckSquare className="h-3.5 w-3.5" />, color: 'text-green-600', dot: 'bg-green-400',  label: 'Task added' },
    task_completed:   { icon: <CheckSquare className="h-3.5 w-3.5" />, color: 'text-green-700', dot: 'bg-green-600',  label: 'Task completed' },
    task_reopened:    { icon: <RotateCcw className="h-3.5 w-3.5" />,  color: 'text-amber-600', dot: 'bg-amber-400',  label: 'Task reopened' },
    task_deleted:     { icon: <Trash2 className="h-3.5 w-3.5" />,    color: 'text-red-600',   dot: 'bg-red-400',    label: 'Task deleted' },
    task_edited:      { icon: <Pencil className="h-3.5 w-3.5" />,    color: 'text-violet-600', dot: 'bg-violet-400', label: 'Task edited' },
  };
  return configs[action] ?? {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: fmt(action),
  };
};

const getDescription = (log: any): React.ReactNode => {
  const { action, old_value, new_value } = log;

  if (action === 'project_started') {
    return <span className="text-muted-foreground text-xs">Project moved to In Progress</span>;
  }
  if (action === 'scope_updated' || action === 'notes_updated') {
    return <span className="text-muted-foreground text-xs">Instructions were updated for team review</span>;
  }
  if (action === 'task_added') {
    return <span className="text-muted-foreground text-xs">"{new_value}"</span>;
  }
  if (action === 'task_completed') {
    return <span className="text-muted-foreground text-xs">"{old_value}" marked complete</span>;
  }
  if (action === 'task_reopened') {
    return <span className="text-muted-foreground text-xs">"{old_value}" reopened</span>;
  }
  if (action === 'task_deleted') {
    return <span className="text-muted-foreground text-xs">"{old_value}" was removed</span>;
  }
  if (action === 'task_edited') {
    return <span className="text-muted-foreground text-xs">{new_value}</span>;
  }
  if (old_value && new_value) {
    return (
      <span className="text-xs flex items-center gap-1.5 flex-wrap">
        <span className="text-muted-foreground line-through">{formatValue(action, old_value)}</span>
        <span className="text-muted-foreground">→</span>
        <span className="font-medium text-foreground">{formatValue(action, new_value)}</span>
      </span>
    );
  }
  if (new_value) {
    return <span className="text-muted-foreground text-xs">{formatValue(action, new_value)}</span>;
  }
  return null;
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
        <History className="h-4 w-4" /> Activity
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 pt-0.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : !logs || logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet</p>
      ) : (
        <ol className="relative space-y-0">
          {logs.map((log: any, idx: number) => {
            const config = getActionConfig(log.action);
            const isLast = idx === logs.length - 1;
            return (
              <li key={log.id} className="flex gap-3 relative">
                {/* Timeline line */}
                {!isLast && (
                  <div
                    className="absolute left-[13px] top-7 w-px bg-border"
                    style={{ bottom: 0 }}
                  />
                )}

                {/* Icon dot */}
                <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card border-2 border-border ${config.color}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pb-5 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                  <div className="mt-0.5 space-y-0.5">
                    {getDescription(log)}
                    <p className="text-[11px] text-muted-foreground">
                      by {log.employees?.full_name || 'Unknown'}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
