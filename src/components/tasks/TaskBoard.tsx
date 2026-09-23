import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';


type Stage = 'todo' | 'in_progress' | 'qc' | 'done';

const STAGES = [
  { key: 'todo',        label: 'To Do',       dot: '#DFE1E6', topBorder: '#DFE1E6', textColor: '#172B4D' },
  { key: 'in_progress', label: 'In Progress',  dot: '#0052CC', topBorder: '#0052CC', textColor: '#172B4D' },
  { key: 'qc',          label: 'QC',           dot: '#FF8B00', topBorder: '#FF8B00', textColor: '#172B4D' },
  { key: 'done',        label: 'Done',         dot: '#36B37E', topBorder: '#36B37E', textColor: '#172B4D' },
] as const;

const complexityColors: Record<string, { bg: string; text: string }> = {
  easy:   { bg: '#E3FCEF', text: '#006644' },
  medium: { bg: '#FFFAE6', text: '#974F0C' },
  hard:   { bg: '#FFEBE6', text: '#BF2600' },
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
  headerAction?: React.ReactNode;
}


const TaskCard = ({
  task,
  onMove,
  onOpenDetail,
  myRoles,
  myEmployeeId,
}: {
  task: any;
  onMove: (task: any, toStage: Stage, reason?: string) => void;
  onOpenDetail: (task: any) => void;
  myRoles: string[];
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
  const isOverdue = !!task.deadline && !task.is_completed && new Date(task.deadline) < new Date();

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
        className="group bg-white rounded-[3px] border cursor-pointer select-none transition-shadow hover:shadow-md"
        style={{ borderColor: '#DFE1E6', boxShadow: '0 1px 2px rgba(9,30,66,0.08)' }}
        onClick={() => onOpenDetail(task)}
      >

        <div className="p-[10px_12px] space-y-2">
          {/* Complexity badge top */}
          {task.complexity && (
            <span
              className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-[3px]"
              style={{ background: cc.bg, color: cc.text }}
            >
              {task.complexity.charAt(0).toUpperCase() + task.complexity.slice(1)}
            </span>
          )}

          {/* Title */}
          <p className="text-[14px] font-medium leading-snug line-clamp-2" style={{ color: '#172B4D' }}>
            {task.title}
          </p>

          {/* Duration badges */}
          {(execMins > 0 || qcMins > 0 || qcRejections > 0) && (
            <div className="flex flex-wrap gap-1">
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

          {/* Assignee row */}
          {assignee && (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarImage src={assignee.avatar_url || ''} />
                <AvatarFallback className="text-[8px] bg-[#DFE1E6] text-[#42526E]">
                  {getInitials(assignee.full_name || '?')}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px]" style={{ color: '#42526E' }}>{assignee.full_name}</span>
            </div>
          )}

          {/* Bottom row: project code + deadline + move button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              {task.project && (
                <span
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded-[3px] shrink-0"
                  style={{ background: '#DFE1E6', color: '#42526E' }}
                >
                  {task.project.project_code}
                </span>
              )}
              {task.deadline && (
                <span className={cn("text-[11px] truncate", isOverdue ? "text-red-600 font-medium" : "text-[#6B778C]")}>
                  {formatDate(task.deadline)}
                </span>
              )}
            </div>
            {targets.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 rounded flex items-center justify-center hover:bg-[#DFE1E6] shrink-0"
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 text-[#42526E]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {targets.map(t => {
                    const stageInfo = STAGES.find(s => s.key === t)!;
                    return (
                      <DropdownMenuItem key={t} onClick={() => handleMoveTo(t)}>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full mr-2"
                          style={{ background: '#DFE1E6', color: stageInfo.dot }}
                        >
                          {stageInfo.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

        </div>
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

const TaskBoard = ({ scopeEmployeeId, headerAction }: TaskBoardProps) => {
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
  const [selectedTask, setSelectedTask] = useState<any>(null);


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
    <div className="flex gap-3 items-stretch overflow-x-auto pb-4">
      {STAGES.map(s => (
        <div key={s.key} className="flex flex-col min-w-0 flex-1" style={{ borderTop: `3px solid ${s.topBorder}` }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-t-sm" style={{ background: '#F8F9FA', minHeight: 36 }}>
            <span className="h-[6px] w-[6px] rounded-full shrink-0" style={{ background: s.dot }} />
            <span className="text-[13px] font-semibold" style={{ color: '#172B4D' }}>{s.label}</span>
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-b-sm" style={{ background: '#F8F9FA', minHeight: 'calc(100vh - 280px)' }}>
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-[3px]" />)}
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="space-y-3">
      {/* Filters + header action */}
      <div className="flex items-center gap-2">
        {!scopeEmployeeId && (
          <>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {(projects || []).map((p: any) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.project_code} — {p.project_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {movingId && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </>
        )}
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </div>


      {/* Board columns */}
      <div className="flex gap-3 items-stretch overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const columnTasks = stage.key === 'done'
            ? grouped.done.slice(0, doneLimit)
            : grouped[stage.key];
          const totalDone = grouped.done.length;

          return (
            <div key={stage.key} className="flex flex-col min-w-0 flex-1" style={{ borderTop: `3px solid ${stage.topBorder}` }}>
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-t-sm" style={{ background: '#F8F9FA', minHeight: 36 }}>
                <span className="h-[6px] w-[6px] rounded-full shrink-0" style={{ background: stage.dot }} />
                <span className="text-[13px] font-semibold" style={{ color: stage.textColor }}>
                  {stage.label}
                </span>
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: '#DFE1E6', color: '#42526E' }}
                >
                  {grouped[stage.key].length}
                </span>
              </div>

              {/* Body */}
              <div
                className="flex flex-col gap-2 p-2 rounded-b-sm"
                style={{ background: '#F8F9FA', minHeight: 'calc(100vh - 280px)' }}
              >

                {columnTasks.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: '#5E6C84' }}>No issues</p>
                ) : (
                  columnTasks.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={moveTask}
                      onOpenDetail={setSelectedTask}
                      myRoles={myRoles}
                      myEmployeeId={myEmployeeId}
                    />

                  ))
                )}

                {/* Done — load more */}
                {stage.key === 'done' && totalDone > doneLimit && (
                  <button
                    type="button"
                    className="text-[11px] text-center py-2 hover:underline"
                    style={{ color: '#5E6C84' }}
                    onClick={() => setDoneLimit(prev => prev + DONE_PAGE_SIZE)}
                  >
                    Load more ({Math.min(DONE_PAGE_SIZE, totalDone - doneLimit)} of {totalDone - doneLimit} remaining)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task detail modal */}
      {selectedTask && (() => {
        const t = selectedTask;
        const logs: any[] = t.task_stage_logs || [];
        const { execMins, qcMins } = computeDurations(logs);
        const qcRejections = logs.filter((l: any) => l.from_stage === 'qc' && l.to_stage === 'in_progress').length;
        const sortedLogs = [...logs].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());
        const stageInfo = STAGES.find(s => s.key === t.status)!;
        const cc = complexityColors[t.complexity] || complexityColors.easy;
        const isOverdue = !!t.deadline && !t.is_completed && new Date(t.deadline) < new Date();
        const stage: Stage = t.status;
        const assignee = t.assignee;

        return (
          <Dialog open={!!selectedTask} onOpenChange={v => { if (!v) setSelectedTask(null); }}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
              {/* Header bar */}
              <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b">
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Breadcrumb */}
                  {t.project && (
                    <p className="text-[11px] font-mono" style={{ color: '#42526E' }}>
                      {t.project.project_code} — {t.project.project_name}
                    </p>
                  )}
                  <h2 className="text-[18px] font-semibold leading-snug" style={{ color: '#172B4D' }}>{t.title}</h2>
                </div>
              </div>

              {/* Body: two columns */}
              <div className="flex gap-0 min-h-0">
                {/* Left: description + activity */}
                <div className="flex-1 min-w-0 px-6 py-4 space-y-5 border-r">
                  {/* Description */}
                  {t.description ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B778C' }}>Description</p>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: '#172B4D' }}>{t.description}</p>
                    </div>
                  ) : (
                    <p className="text-sm italic" style={{ color: '#A5ADBA' }}>No description</p>
                  )}

                  {/* Stage history */}
                  {sortedLogs.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B778C' }}>Activity</p>
                      <div className="space-y-2">
                        {sortedLogs.map((log: any, i: number) => {
                          const fromStage = STAGES.find(s => s.key === log.from_stage);
                          const toStage = STAGES.find(s => s.key === log.to_stage);
                          return (
                            <div key={log.id || i} className="flex items-start gap-2 text-xs" style={{ color: '#42526E' }}>
                              <div className="h-5 w-5 rounded-full bg-[#DFE1E6] shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ color: '#42526E' }}>
                                →
                              </div>
                              <div className="flex-1 min-w-0">
                                <span>
                                  Moved
                                  {fromStage && <> from <span className="font-medium">{fromStage.label}</span></>}
                                  {toStage && <> to <span className="font-medium" style={{ color: toStage.dot }}>{toStage.label}</span></>}
                                </span>
                                {log.reason && <span className="block text-[11px] mt-0.5 italic" style={{ color: '#6B778C' }}>"{log.reason}"</span>}
                                <span className="block text-[10px] mt-0.5" style={{ color: '#97A0AF' }}>
                                  {new Date(log.changed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: metadata sidebar */}
                <div className="w-52 shrink-0 px-4 py-4 space-y-4">
                  {/* Status */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B778C' }}>Status</p>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-1 rounded-[3px]" style={{ background: '#F8F9FA', color: '#172B4D' }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: stageInfo?.dot }} />
                      {stageInfo?.label}
                    </span>
                  </div>

                  {/* Assignee */}
                  {assignee && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B778C' }}>Assignee</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar_url || ''} />
                          <AvatarFallback className="text-[9px] bg-[#DFE1E6] text-[#42526E]">{getInitials(assignee.full_name || '?')}</AvatarFallback>
                        </Avatar>
                        <span className="text-[13px]" style={{ color: '#172B4D' }}>{assignee.full_name}</span>
                      </div>
                    </div>
                  )}

                  {/* Complexity */}
                  {t.complexity && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B778C' }}>Complexity</p>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-[3px]" style={{ background: cc.bg, color: cc.text }}>
                        {t.complexity.charAt(0).toUpperCase() + t.complexity.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Deadline */}
                  {t.deadline && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B778C' }}>Deadline</p>
                      <p className={`text-[13px] font-medium ${isOverdue ? 'text-red-600' : ''}`} style={isOverdue ? {} : { color: '#172B4D' }}>
                        {formatDate(t.deadline)}
                        {isOverdue && <span className="ml-1 text-[11px] font-normal">(overdue)</span>}
                      </p>
                    </div>
                  )}

                  {/* Timing */}
                  {(execMins > 0 || qcMins > 0) && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B778C' }}>Time Spent</p>
                      <div className="space-y-1">
                        {execMins > 0 && <p className="text-[12px]" style={{ color: '#172B4D' }}>⏱ {fmtDuration(execMins)} execution</p>}
                        {qcMins > 0 && <p className="text-[12px]" style={{ color: '#172B4D' }}>⏱ {fmtDuration(qcMins)} QC</p>}
                        {qcRejections > 0 && <p className="text-[12px] text-red-600">✕ {qcRejections} QC rejection{qcRejections > 1 ? 's' : ''}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
};

export default TaskBoard;

