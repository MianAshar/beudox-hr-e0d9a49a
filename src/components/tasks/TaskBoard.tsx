import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';

type Stage = 'todo' | 'in_progress' | 'qc' | 'done';

const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
  { key: 'todo',        label: 'To Do',       color: '#4B4468', bg: '#F6F5FF' },
  { key: 'in_progress', label: 'In Progress',  color: '#1E40AF', bg: '#DBEAFE' },
  { key: 'qc',          label: 'QC',           color: '#92400E', bg: '#FEF3C7' },
  { key: 'done',        label: 'Done',         color: '#065F46', bg: '#D1FAE5' },
];

const complexityColors: Record<string, { bg: string; text: string }> = {
  easy:   { bg: '#D1FAE5', text: '#065F46' },
  medium: { bg: '#FEF3C7', text: '#92400E' },
  hard:   { bg: '#FEE2E2', text: '#991B1B' },
};

const DONE_PAGE_SIZE = 10;

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// Returns human-readable duration from minutes
const fmtDuration = (mins: number) => {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Compute execution + QC minutes from stage logs
const computeDurations = (logs: any[]) => {
  let execMins = 0;
  let qcMins = 0;
  const sorted = [...logs].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());
  for (let i = 0; i < sorted.length; i++) {
    const log = sorted[i];
    const nextLog = sorted[i + 1];
    if (!nextLog) break;
    const duration = Math.round((new Date(nextLog.changed_at).getTime() - new Date(log.changed_at).getTime()) / 60000);
    if (log.to_stage === 'in_progress') execMins += duration;
    if (log.to_stage === 'qc') qcMins += duration;
  }
  return { execMins, qcMins };
};

interface TaskBoardProps {
  scopeEmployeeId?: string; // set on My Tasks page to show only own tasks
}

const TaskCard = ({
  task,
  onMove,
  myRoles,
  myId,
  myEmployeeId,
}: {
  task: any;
  onMove: (task: any, toStage: Stage, reason?: string) => void;
  myRoles: string[];
  myId: string;
  myEmployeeId: string;
}) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isManager = myRoles.some(r => ['ceo', 'hr_manager'].includes(r));
  const isTeamLead = myRoles.includes('team_lead');
  const isEmployee = myRoles.includes('employee') && !isManager && !isTeamLead;
  const isOwner = task.assigned_to === myEmployeeId;
  const stage: Stage = task.status;
  const isDone = stage === 'done';

  // Determine which stages this user can move this task to
  const allowedTargets = (): Stage[] => {
    if (isDone) return [];
    if (isEmployee) {
      if (!isOwner) return [];
      if (stage === 'todo') return ['in_progress'];
      if (stage === 'in_progress') return ['qc'];
      return [];
    }
    // Team lead or manager — any stage except current
    return STAGES.map(s => s.key).filter(s => s !== stage);
  };
  const targets = allowedTargets();

  const cc = complexityColors[task.complexity] || complexityColors.easy;
  const assignee = task.assignee;
  const logs = task.task_stage_logs || [];
  const { execMins, qcMins } = computeDurations(logs);
  const qcRejections = logs.filter((l: any) => l.from_stage === 'qc' && l.to_stage === 'in_progress').length;

  const handleMoveTo = (toStage: Stage) => {
    // QC → in_progress requires reject modal
    if (stage === 'qc' && toStage === 'in_progress') {
      setRejectOpen(true);
      return;
    }
    onMove(task, toStage);
  };

  const handleRejectConfirm = () => {
    onMove(task, 'in_progress', rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <>
      <div
        className="bg-white rounded-[10px] border p-3 space-y-2.5 select-none"
        style={{ borderColor: 'rgba(91,63,248,0.15)' }}
      >
        {/* Project tag + complexity */}
        <div className="flex items-center justify-between gap-2">
          {task.project && (
            <span className="text-[10px] font-mono font-medium text-muted-foreground bg-[#F6F5FF] px-1.5 py-0.5 rounded">
              {task.project.project_code}
            </span>
          )}
          {task.complexity && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full ml-auto" style={{ background: cc.bg, color: cc.text }}>
              {task.complexity.charAt(0).toUpperCase() + task.complexity.slice(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>

        {/* Assignee */}
        {assignee && (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={assignee.avatar_url || ''} />
              <AvatarFallback className="text-[9px]">{getInitials(assignee.full_name || '?')}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{assignee.full_name}</span>
          </div>
        )}

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(task.deadline)}</span>
            {!task.is_completed && new Date(task.deadline) < new Date() && (
              <AlertTriangle className="h-3 w-3 text-red-500 ml-0.5" />
            )}
          </div>
        )}

        {/* Duration badges */}
        {(execMins > 0 || qcMins > 0) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {execMins > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                ⏱ {fmtDuration(execMins)} exec
              </span>
            )}
            {qcMins > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                ⏱ {fmtDuration(qcMins)} QC
              </span>
            )}
            {qcRejections > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-700">
                ✕ {qcRejections} rejection{qcRejections > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Move action */}
        {targets.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full h-7 text-xs justify-between px-2 border border-dashed border-border hover:border-primary hover:text-primary">
                Move to <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {targets.map(t => {
                const stageInfo = STAGES.find(s => s.key === t)!;
                return (
                  <DropdownMenuItem key={t} onClick={() => handleMoveTo(t)}>
                    <span className="text-xs px-1.5 py-0.5 rounded-full mr-2" style={{ background: stageInfo.bg, color: stageInfo.color }}>
                      {stageInfo.label}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isDone && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Done
          </div>
        )}
      </div>

      {/* QC Reject modal */}
      <Dialog open={rejectOpen} onOpenChange={v => { if (!v) { setRejectOpen(false); setRejectReason(''); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject from QC</DialogTitle>
            <DialogDescription>Move "{task.title}" back to In Progress. Add an optional reason.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Reason <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
            <Textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Takeoff numbers don't match scope..."
              rows={3}
              className="mt-1.5"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setRejectReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>Reject & Move Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TaskBoard = ({ scopeEmployeeId }: TaskBoardProps) => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const myEmployeeId = employee?.employee_id ?? '';
  const myRoles = employee?.roles ?? [];
  const isManager = myRoles.some(r => ['ceo', 'hr_manager'].includes(r));
  const isTeamLead = myRoles.includes('team_lead');
  const canSeeAll = isManager || isTeamLead;

  const qc = useQueryClient();
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [doneLimit, setDoneLimit] = useState(DONE_PAGE_SIZE);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Projects for filter dropdown
  const { data: projects } = useQuery({
    queryKey: ['board-projects', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, project_code, project_name')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('project_code');
      return data || [];
    },
    enabled: !!companyId && !scopeEmployeeId,
  });

  // Fetch tasks with stage logs and assignee
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['board-tasks', companyId, scopeEmployeeId, projectFilter],
    queryFn: async () => {
      let q = supabase
        .from('project_tasks')
        .select(`
          id, title, complexity, deadline, status, is_completed, assigned_to, project_id,
          assignee:employees!project_tasks_assigned_to_fkey(id, full_name, avatar_url),
          project:projects!project_tasks_project_id_fkey(id, project_code, project_name),
          task_stage_logs(id, from_stage, to_stage, changed_at, reason)
        `)
        .eq('company_id', companyId!);

      if (scopeEmployeeId) {
        q = q.eq('assigned_to', scopeEmployeeId);
      } else if (!canSeeAll) {
        q = q.eq('assigned_to', myEmployeeId);
      }

      if (projectFilter !== 'all') {
        q = q.eq('project_id', projectFilter);
      }

      const { data, error } = await q.order('deadline', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const moveTask = async (task: any, toStage: Stage, reason?: string) => {
    setMovingId(task.id);
    try {
      const { error } = await supabase.functions.invoke('move-task-stage', {
        body: { taskId: task.id, toStage, reason },
      });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ['board-tasks'] });
      await qc.invalidateQueries({ queryKey: ['project-tasks'] });
      await qc.invalidateQueries({ queryKey: ['my-tasks'] });
      toast.success(`Moved to ${STAGES.find(s => s.key === toStage)?.label}`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to move task');
    } finally {
      setMovingId(null);
    }
  };

  // Group tasks by stage
  const grouped = useMemo(() => {
    const g: Record<Stage, any[]> = { todo: [], in_progress: [], qc: [], done: [] };
    for (const t of (tasks || [])) {
      const s = (t.status || 'todo') as Stage;
      if (g[s]) g[s].push(t);
    }
    return g;
  }, [tasks]);

  if (isLoading) return (
    <div className="grid grid-cols-4 gap-4">
      {STAGES.map(s => (
        <div key={s.key} className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      {!scopeEmployeeId && (
        <div className="flex items-center gap-3">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {(projects || []).map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.project_code} — {p.project_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {movingId && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      )}

      {/* Board columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {STAGES.map(stage => {
          const columnTasks = stage.key === 'done'
            ? grouped.done.slice(0, doneLimit)
            : grouped[stage.key];
          const totalDone = grouped.done.length;

          return (
            <div key={stage.key} className="flex flex-col gap-2 min-h-[200px]">
              {/* Column header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: stage.color }}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-medium rounded-full px-1.5 py-0.5" style={{ background: stage.bg, color: stage.color }}>
                    {grouped[stage.key].length}
                  </span>
                </div>
              </div>

              {/* Column drop zone */}
              <div className="flex flex-col gap-2 rounded-[12px] p-2 min-h-[100px]" style={{ background: stage.bg + '66' }}>
                {columnTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No tasks</p>
                ) : (
                  columnTasks.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={moveTask}
                      myRoles={myRoles}
                      myId={employee?.auth_user_id ?? ''}
                      myEmployeeId={myEmployeeId}
                    />
                  ))
                )}

                {/* Done — load more */}
                {stage.key === 'done' && totalDone > doneLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-foreground mt-1"
                    onClick={() => setDoneLimit(prev => prev + DONE_PAGE_SIZE)}
                  >
                    Load more ({Math.min(DONE_PAGE_SIZE, totalDone - doneLimit)} of {totalDone - doneLimit} remaining)
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
