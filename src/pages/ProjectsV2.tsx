import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import {
  Plus, Search, ChevronDown, ChevronRight, SlidersHorizontal, Loader2,
  CalendarIcon, X, Play,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['pending', 'in_progress', 'qc_required', 'on_hold', 'completed', 'cancelled', 'delayed'];

const statusColors: Record<string, string> = {
  pending: 'bg-[#F3F4F6] text-[#374151] hover:bg-[#F3F4F6]',
  in_progress: 'bg-blue-100 text-blue-700',
  qc_required: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  delayed: 'bg-orange-100 text-orange-700',
};

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const getInitials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?';

const toIso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const todayIso = () => toIso(new Date());

async function logProjectActivity(params: {
  companyId: string; projectId: string; employeeId: string;
  action: string; oldValue: string | null; newValue: string | null;
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

interface TeamMember {
  id: string; full_name: string; avatar_url: string | null; designation?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Start project CTA
// ─────────────────────────────────────────────────────────────────────────────

const StartProjectButton = ({
  projectId, companyId, employeeId,
}: { projectId: string; companyId: string; employeeId: string }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('projects').update({ status: 'in_progress' }).eq('id', projectId);
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId, employeeId,
        action: 'project_started', oldValue: 'pending', newValue: 'in_progress',
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects-v2'] });
      toast({ title: 'Project started' });
      setOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Failed to start project', description: e.message, variant: 'destructive' }),
  });

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#5B3FF8] text-[#5B3FF8] hover:bg-[#5B3FF8]/5 transition-colors px-3 py-2 text-[13px] font-medium"
        style={{ fontFamily: 'var(--ff-body)' }}
      >
        <Play className="h-3.5 w-3.5" /> Start Project
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to start this project? Assigned team members will be able to see it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              {mutation.isPending ? 'Starting…' : 'Start Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Team avatars stack
// ─────────────────────────────────────────────────────────────────────────────

const TeamMembersStack = ({ members }: { members: TeamMember[] }) => {
  if (!members || members.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const visible = members.slice(0, 4);
  const extra = members.length - visible.length;
  const allNames = members.map(m => m.full_name).join(', ');

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center -space-x-2">
            {visible.map(m => (
              <Avatar key={m.id} className="h-6 w-6 border-2 border-background">
                {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.full_name} />}
                <AvatarFallback className="text-[9px] font-medium bg-muted text-foreground">
                  {getInitials(m.full_name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extra > 0 && (
              <div className="h-6 w-6 rounded-full border-2 border-background bg-muted text-foreground text-[9px] font-medium flex items-center justify-center">
                +{extra}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-xs whitespace-pre-line">{allNames}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Status inline cell
// ─────────────────────────────────────────────────────────────────────────────

interface StatusCellProps {
  project: any; canEdit: boolean; companyId: string; employeeId: string;
}

const StatusCell = ({ project, canEdit, companyId, employeeId }: StatusCellProps) => {
  const qc = useQueryClient();
  const [optimistic, setOptimistic] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const previous = project.status;
      const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', project.id);
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId: project.id, employeeId,
        action: 'status_changed', oldValue: previous, newValue: newStatus,
      });
    },
    onSuccess: () => {
      setTimeout(() => setOptimistic(null), 50);
      qc.invalidateQueries({ queryKey: ['projects-v2'] });
    },
    onError: (e: Error) => {
      setOptimistic(null);
      toast({ title: 'Failed to update status', description: e.message, variant: 'destructive' });
    },
  });

  const status = optimistic ?? project.status;
  const isPending = mutation.isPending;

  const badge = (
    <Badge
      className={cn(
        statusColors[status] || '',
        'border border-transparent inline-flex items-center gap-1',
        canEdit && !isPending && 'cursor-pointer hover:border-foreground/30',
      )}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <>
          {fmt(status)}
          {canEdit && <ChevronDown className="h-3 w-3 opacity-70" />}
        </>
      )}
    </Badge>
  );

  if (!canEdit) return badge;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <button type="button" className="inline-flex">{badge}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-popover">
        {STATUS_OPTIONS.map(s => (
          <DropdownMenuItem
            key={s}
            onSelect={() => {
              if (s === status) return;
              setOptimistic(s);
              setOpen(false);
              mutation.mutate(s);
            }}
          >
            <Badge className={cn(statusColors[s] || '', 'pointer-events-none')}>{fmt(s)}</Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Deadline inline cell
// ─────────────────────────────────────────────────────────────────────────────

interface DeadlineCellProps {
  project: any; canEdit: boolean; companyId: string; employeeId: string;
}

const DeadlineCell = ({ project, canEdit, companyId, employeeId }: DeadlineCellProps) => {
  const qc = useQueryClient();
  const [optimistic, setOptimistic] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newDate: string) => {
      const previous = project.internal_deadline as string | null;
      const { error } = await supabase.from('projects').update({ internal_deadline: newDate }).eq('id', project.id);
      if (error) throw error;
      await logProjectActivity({
        companyId, projectId: project.id, employeeId,
        action: 'deadline_changed', oldValue: previous, newValue: newDate,
      });
    },
    onSuccess: () => {
      setTimeout(() => setOptimistic(undefined), 50);
      qc.invalidateQueries({ queryKey: ['projects-v2'] });
    },
    onError: (e: Error) => {
      setOptimistic(undefined);
      toast({ title: 'Failed to update deadline', description: e.message, variant: 'destructive' });
    },
  });

  const value = optimistic !== undefined ? optimistic : (project.internal_deadline as string | null);
  const isPending = mutation.isPending;
  const today = todayIso();
  const isOverdue = value && value < today && project.status !== 'completed' && project.status !== 'cancelled';
  const isToday = value === today;

  const display = (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm',
        isOverdue && 'text-destructive font-medium',
        isToday && !isOverdue && 'text-[#92400E] font-medium',
      )}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      ) : (
        <span>{value ? formatDate(value) : <span className="text-muted-foreground">—</span>}</span>
      )}
    </span>
  );

  if (!canEdit) return display;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isPending}>
        <button type="button" className="inline-flex cursor-pointer hover:text-foreground rounded px-1 -mx-1 hover:bg-muted/40">
          {display}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={d => {
            if (!d) return;
            const iso = toIso(d);
            if (iso === value) { setOpen(false); return; }
            setOptimistic(iso);
            setOpen(false);
            mutation.mutate(iso);
          }}
          initialFocus
          className={cn('p-3 pointer-events-auto')}
        />
      </PopoverContent>
    </Popover>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Tasks rows for a project (inline)
// ─────────────────────────────────────────────────────────────────────────────

interface TaskRowsProps {
  projectId: string;
  companyId: string;
  employeeId: string;
  teamMembers: TeamMember[];
  canManage: boolean; // can add tasks
  role: string | null | undefined;
}

const TaskRows = ({ projectId, companyId, employeeId, teamMembers, canManage, role }: TaskRowsProps) => {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDeadline, setNewDeadline] = useState<string | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['projects-v2-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('id, title, deadline, is_completed, assigned_to, created_at, assignee:employees!project_tasks_assigned_to_fkey(id, full_name, avatar_url)')
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('is_completed', { ascending: true })
        .order('deadline', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['projects-v2-tasks', projectId] });
    qc.invalidateQueries({ queryKey: ['projects-v2-task-counts'] });
    qc.invalidateQueries({ queryKey: ['my-tasks'] });
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

  const today = startOfDay(new Date());

  if (isLoading) {
    return (
      <div
        className="pl-8 pr-4 py-2.5 text-xs text-muted-foreground"
        style={{ borderBottom: '1px solid #F8F7FF' }}
      >
        Loading tasks…
      </div>
    );
  }

  const list = tasks ?? [];
  const empty = list.length === 0;

  const cancelAdd = () => {
    setAdding(false); setNewTitle(''); setNewAssignee(''); setNewDeadline(null);
  };

  const taskRowBorder = { borderBottom: '1px solid #F8F7FF' } as const;

  return (
    <>
      {empty && !adding && (
        <div
          className="flex items-center gap-3 pl-8 pr-4 py-2.5 text-sm text-muted-foreground"
          style={taskRowBorder}
        >
          <span className="italic">No tasks yet</span>
          {canManage && (
            <button
              type="button"
              className="not-italic text-[13px] font-medium text-[#5B3FF8] hover:underline"
              onClick={() => setAdding(true)}
            >
              + Add Task
            </button>
          )}
        </div>
      )}

      {list.map((t: any) => {
        const overdue = !t.is_completed && t.deadline && isBefore(parseISO(t.deadline), today);
        const isOwnTask = t.assigned_to === employeeId;
        const canToggle = canManage || isOwnTask;
        return (
          <div
            key={t.id}
            className="flex items-center gap-4 pl-8 pr-4 py-2.5 hover:bg-[#FAFAFA] transition-colors"
            style={taskRowBorder}
          >
            <Checkbox
              checked={!!t.is_completed}
              onCheckedChange={() => canToggle && toggleMutation.mutate(t)}
              disabled={!canToggle || toggleMutation.isPending}
              aria-label={t.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
            />
            <span
              className={cn(
                'flex-1 min-w-0 text-[13px] font-normal truncate',
                t.is_completed && 'line-through text-muted-foreground',
              )}
              style={{ fontFamily: 'var(--ff-body)' }}
              title={t.title}
            >
              {t.title}
            </span>
            <span className="text-xs shrink-0">
              {t.deadline ? (
                <span className={cn(overdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                  {format(parseISO(t.deadline), 'MMM d')}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 min-w-0 w-[160px] justify-end">
              {t.assignee ? (
                <>
                  <Avatar className="h-5 w-5 shrink-0">
                    {t.assignee.avatar_url && <AvatarImage src={t.assignee.avatar_url} alt={t.assignee.full_name} />}
                    <AvatarFallback className="text-[9px]">{getInitials(t.assignee.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-foreground truncate">{t.assignee.full_name}</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Unassigned</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Inline add row */}
      {canManage && adding && (
        <div
          className="flex items-center gap-3 pl-8 pr-4 py-2.5"
          style={taskRowBorder}
          onKeyDown={(e) => { if (e.key === 'Escape') cancelAdd(); }}
        >
          <Input
            autoFocus
            placeholder="Task title…"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newTitle.trim()) {
                e.preventDefault();
                addMutation.mutate();
              }
            }}
            className="h-8 text-[13px] flex-1 min-w-0"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('h-8 w-[130px] justify-start text-xs font-normal shrink-0', !newDeadline && 'text-muted-foreground')}
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                {newDeadline ? format(parseISO(newDeadline), 'MMM d') : 'Date'}
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
          <div className="w-[160px] shrink-0">
            <SearchableEmployeeSelect
              employees={teamMembers}
              value={newAssignee}
              onValueChange={setNewAssignee}
              placeholder="Assign…"
            />
          </div>
          <Button
            size="sm"
            className="h-8 px-3 shrink-0"
            onClick={() => addMutation.mutate()}
            disabled={!newTitle.trim() || addMutation.isPending}
          >
            {addMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 shrink-0"
            onClick={cancelAdd}
            disabled={addMutation.isPending}
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* + Add Task trigger row (when not adding and there are existing tasks) */}
      {canManage && !adding && !empty && (
        <div
          className="pl-8 pr-4 py-2"
          style={taskRowBorder}
        >
          <button
            type="button"
            className="text-[13px] font-medium text-[#5B3FF8] hover:underline"
            onClick={() => setAdding(true)}
          >
            + Add Task
          </button>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const ProjectsV2 = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const companyId = employee?.company_id;
  const employeeId = employee?.employee_id;
  const role = employee?.role_name ?? null;

  const isManager = role === 'hr_manager' || role === 'ceo';
  const isTeamLead = role === 'team_lead';
  const isEmployee = role === 'employee';
  const canSeeClient = isManager;
  const canSeeTeam = isManager || isTeamLead;
  const canEditStatus = isManager || isTeamLead;
  const canEditDeadline = canEditStatus;
  const canManageTasks = isManager || isTeamLead;
  const canAddProject = isManager;

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const canFilterByEmployee = isManager || isTeamLead;

  // Projects query — same access pattern as Projects page
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-v2', companyId, role, employeeId],
    queryFn: async () => {
      const projectSelect = '*, clients(id, name), lead:employees!projects_project_lead_id_fkey(id, full_name, avatar_url, designation)';

      if (isManager) {
        const { data, error } = await supabase
          .from('projects')
          .select(projectSelect)
          .eq('company_id', companyId!)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }

      const { data: assignments, error: aErr } = await supabase
        .from('project_assignments')
        .select('project_id')
        .eq('company_id', companyId!)
        .eq('employee_id', employeeId!)
        .eq('is_active', true);
      if (aErr) throw aErr;
      const assignedIds = assignments?.map(a => a.project_id) ?? [];

      if (isTeamLead) {
        const [leadRes, assignedRes] = await Promise.all([
          supabase
            .from('projects')
            .select(projectSelect)
            .eq('company_id', companyId!)
            .eq('is_active', true)
            .eq('project_lead_id', employeeId!),
          assignedIds.length > 0
            ? supabase
                .from('projects')
                .select(projectSelect)
                .eq('company_id', companyId!)
                .eq('is_active', true)
                .in('id', assignedIds)
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (leadRes.error) throw leadRes.error;
        if (assignedRes.error) throw assignedRes.error;
        const merged = [...(leadRes.data ?? []), ...(assignedRes.data ?? [])];
        const unique = Array.from(new Map(merged.map((p: any) => [p.id, p])).values());
        return unique.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      // Employee — assigned, non-pending only
      if (assignedIds.length === 0) return [];
      const { data, error } = await supabase
        .from('projects')
        .select(projectSelect)
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .in('id', assignedIds)
        .neq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && !!employeeId && !!role,
  });

  // Default-expanded: expand all on first load
  useEffect(() => {
    if (projects && projects.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set(projects.map((p: any) => p.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects?.length]);

  const projectIds = (projects ?? []).map((p: any) => p.id);

  const { data: clients } = useQuery({
    queryKey: ['projects-v2-clients', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients').select('id, name').eq('company_id', companyId!).eq('is_active', true).order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && isManager,
  });

  // Employees for filter dropdown
  const { data: filterEmployees } = useQuery({
    queryKey: ['projects-v2-filter-employees', companyId, role, employeeId, projectIds.join(',')],
    queryFn: async () => {
      if (isManager) {
        const { data, error } = await supabase
          .from('employees')
          .select('id, full_name, avatar_url, designation')
          .eq('company_id', companyId!)
          .eq('status', 'active')
          .order('full_name');
        if (error) throw error;
        return data ?? [];
      }
      // Team Lead: employees assigned to projects this lead can see
      if (isTeamLead) {
        if (projectIds.length === 0) return [];
        const { data, error } = await supabase
          .from('project_assignments')
          .select('employees!project_assignments_employee_id_fkey(id, full_name, avatar_url, designation)')
          .eq('company_id', companyId!)
          .eq('is_active', true)
          .in('project_id', projectIds);
        if (error) throw error;
        const map = new Map<string, any>();
        (data ?? []).forEach((row: any) => {
          const e = row.employees;
          if (e && !map.has(e.id)) map.set(e.id, e);
        });
        return Array.from(map.values()).sort((a, b) => a.full_name.localeCompare(b.full_name));
      }
      return [];
    },
    enabled: !!companyId && canFilterByEmployee,
  });

  const { data: teamAssignments } = useQuery({
    queryKey: ['projects-v2-team', companyId, projectIds.join(',')],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const { data, error } = await supabase
        .from('project_assignments')
        .select('project_id, employees!project_assignments_employee_id_fkey(id, full_name, avatar_url, designation)')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .in('project_id', projectIds);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && projectIds.length > 0,
  });

  const teamByProject = useMemo(() => {
    const map = new Map<string, TeamMember[]>();
    (teamAssignments ?? []).forEach((a: any) => {
      const emp = a.employees;
      if (!emp) return;
      const list = map.get(a.project_id) ?? [];
      list.push({ id: emp.id, full_name: emp.full_name, avatar_url: emp.avatar_url, designation: emp.designation });
      map.set(a.project_id, list);
    });
    return map;
  }, [teamAssignments]);

  // Search across project name/code AND task titles → expand matching task's project
  const { data: taskSearchHits } = useQuery({
    queryKey: ['projects-v2-task-search', companyId, search],
    queryFn: async () => {
      if (!search.trim() || projectIds.length === 0) return [];
      const { data, error } = await supabase
        .from('project_tasks')
        .select('project_id, title')
        .eq('company_id', companyId!)
        .in('project_id', projectIds)
        .ilike('title', `%${search.trim()}%`);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && !!search.trim() && projectIds.length > 0,
  });

  const projectIdsMatchingTasks = useMemo(
    () => new Set((taskSearchHits ?? []).map((t: any) => t.project_id)),
    [taskSearchHits],
  );

  const filtered = useMemo(() => {
    return (projects ?? []).filter((p: any) => {
      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
      // Client filter
      if (isManager && clientFilter !== 'all' && p.client_id !== clientFilter) return false;
      // Employee filter — only projects where selected employee is lead or assigned member
      if (canFilterByEmployee && employeeFilter !== 'all') {
        const isLead = p.project_lead_id === employeeFilter;
        const team = teamByProject.get(p.id) ?? [];
        const isMember = team.some(m => m.id === employeeFilter);
        if (!isLead && !isMember) return false;
      }
      // Search: project name/code OR matching task
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const inName = (p.project_name || '').toLowerCase().includes(q);
        const inCode = (p.project_code || '').toLowerCase().includes(q);
        const inTask = projectIdsMatchingTasks.has(p.id);
        if (!inName && !inCode && !inTask) return false;
      }
      return true;
    });
  }, [projects, statusFilter, priorityFilter, clientFilter, isManager, search, projectIdsMatchingTasks, canFilterByEmployee, employeeFilter, teamByProject]);

  const toggleOne = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const today = todayIso();

  return (
    <div className="min-h-full bg-[#F6F5FF] p-6 space-y-4">
      {/* Header bar: search + filter toggle + add */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background"
          />
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="sm"
          className="h-9 bg-background"
          onClick={() => setShowFilters(s => !s)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          {canAddProject && (
            <Button onClick={() => navigate('/projects/new')} className="h-9">
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 items-center p-3 rounded-lg border border-border bg-background/60">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px] h-9 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] h-9 bg-background"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {['high', 'medium', 'low'].map(p => (
                <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isManager && (
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[180px] h-9 bg-background"><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {(clients ?? []).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {canFilterByEmployee && (
            <div className="w-[220px]">
              <SearchableEmployeeSelect
                employees={filterEmployees ?? []}
                value={employeeFilter}
                onValueChange={setEmployeeFilter}
                placeholder="Team Member"
                allowAll
                allLabel="All Team Members"
              />
            </div>
          )}
          {(statusFilter !== 'all' || priorityFilter !== 'all' || clientFilter !== 'all' || employeeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-xs"
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setClientFilter('all'); setEmployeeFilter('all'); }}
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          {search || statusFilter !== 'all' || priorityFilter !== 'all' || clientFilter !== 'all'
            ? 'No matching projects'
            : 'No projects yet'}
        </div>
      ) : (
        <div>
          {filtered.map((p: any) => {
            const expanded = expandedIds.has(p.id);
            const team = teamByProject.get(p.id) ?? [];
            const isToday = p.internal_deadline === today;
            const isPending = p.status === 'pending';
            return (
              <div key={p.id}>
                {/* Project row */}
                <div
                  className="flex items-center gap-4 py-4"
                  style={{ borderBottom: '1px solid #F0EEFF' }}
                >
                  <button
                    type="button"
                    className="w-6 h-6 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={() => toggleOne(p.id)}
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  <span className="font-mono text-xs text-muted-foreground shrink-0">{p.project_code}</span>

                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="text-[14px] font-semibold text-foreground hover:underline truncate text-left min-w-0"
                    style={{ fontFamily: 'var(--ff-display)' }}
                    title={p.project_name}
                  >
                    {p.project_name}
                  </button>

                  {isToday && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            aria-label="Due today"
                            className="inline-block h-1.5 w-1.5 rounded-full bg-[#F5A623] shrink-0"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">Due today</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <div className="flex-1" />

                  {/* Status / Start CTA */}
                  <div className="shrink-0">
                    {isPending ? (
                      canEditStatus ? (
                        <StartProjectButton projectId={p.id} companyId={companyId!} employeeId={employeeId!} />
                      ) : null
                    ) : (
                      <StatusCell project={p} canEdit={canEditStatus} companyId={companyId!} employeeId={employeeId!} />
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="shrink-0 min-w-[90px] text-right">
                    <DeadlineCell project={p} canEdit={canEditDeadline} companyId={companyId!} employeeId={employeeId!} />
                  </div>

                  {/* Lead */}
                  <div className="shrink-0 flex items-center gap-2 min-w-0 w-[160px]">
                    {p.lead ? (
                      <>
                        <Avatar className="h-6 w-6 shrink-0">
                          {p.lead.avatar_url && <AvatarImage src={p.lead.avatar_url} alt={p.lead.full_name} />}
                          <AvatarFallback className="text-[10px]">{getInitials(p.lead.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground truncate">{p.lead.full_name}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No lead</span>
                    )}
                  </div>

                  {/* Team */}
                  <div className="shrink-0 w-[100px] flex justify-end">
                    {canSeeTeam ? <TeamMembersStack members={team} /> : <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </div>

                {/* Task rows */}
                {expanded && (
                  <TaskRows
                    projectId={p.id}
                    companyId={companyId!}
                    employeeId={employeeId!}
                    teamMembers={team}
                    canManage={canManageTasks}
                    role={role}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsV2;
