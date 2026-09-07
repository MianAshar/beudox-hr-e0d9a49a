import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Plus, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  ClipboardCheck, Star, ChevronDown, ChevronUp, ArrowLeft, Trash2, CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/format-date';
import { format } from 'date-fns';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const complexityColor = (c: string) => {
  if (c === 'easy') return { bg: '#D1FAE5', text: '#065F46' };
  if (c === 'medium') return { bg: '#FEF3C7', text: '#92400E' };
  return { bg: '#FEE2E2', text: '#991B1B' };
};

const statusColors: Record<string, string> = {
  in_progress: 'bg-[#EBE6FF] text-[#2B1899]',
  completed: 'bg-[#D1FAE5] text-[#065F46]',
  submitted: 'bg-[#D1FAE5] text-[#065F46]',
  on_hold: 'bg-[#DBEAFE] text-[#1E40AF]',
  pending: 'bg-[#FEF3C7] text-[#92400E]',
  cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
};

const StarRating = ({ value, onChange, max = 5 }: { value: number; onChange: (v: number) => void; max?: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: max }, (_, i) => (
      <button key={i} type="button" onClick={() => onChange(i + 1)} className="focus:outline-none">
        <Star className={`h-5 w-5 transition-colors ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
      </button>
    ))}
    <span className="ml-1.5 text-xs font-medium text-muted-foreground">{value}/{max}</span>
  </div>
);

// ─── Employee List View ───────────────────────────────────────────────

const EmployeeListView = ({ onSelect }: { onSelect: (emp: any) => void }) => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const { data: employees, isLoading } = useQuery({
    queryKey: ['perf-employees', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id, full_name, designation, department, avatar_url,
          employee_roles(roles(name))
        `)
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      // Exclude CEO and Director roles/departments
      return (data || []).filter((emp: any) => {
        const roleNames = (emp.employee_roles || []).map((er: any) => er?.roles?.name).filter(Boolean);
        const dept = (emp.department || '').toLowerCase();
        return !roleNames.includes('ceo') && dept !== 'director';
      });
    },
    enabled: !!companyId,
  });

  const { data: taskStats } = useQuery({
    queryKey: ['perf-task-stats', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('assigned_to, is_completed, completed_at, deadline, complexity')
        .eq('company_id', companyId!);
      if (error) throw error;
      // Group by employee
      const stats: Record<string, any> = {};
      for (const t of (data || [])) {
        if (!t.assigned_to) continue;
        if (!stats[t.assigned_to]) stats[t.assigned_to] = { total: 0, completed: 0, onTime: 0, easy: 0, medium: 0, hard: 0 };
        const s = stats[t.assigned_to];
        s.total++;
        if (t.is_completed) {
          s.completed++;
          if (t.deadline && t.completed_at && new Date(t.completed_at) <= new Date(t.deadline)) s.onTime++;
        }
        if (t.complexity === 'easy') s.easy++;
        else if (t.complexity === 'medium') s.medium++;
        else if (t.complexity === 'hard') s.hard++;
      }
      return stats;
    },
    enabled: !!companyId,
  });

  const { data: ratingStats } = useQuery({
    queryKey: ['perf-rating-stats', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_evaluations')
        .select('reviewee_id, overall_score')
        .eq('company_id', companyId!);
      const stats: Record<string, { count: number; total: number }> = {};
      for (const r of (data || [])) {
        if (!r.reviewee_id) continue;
        if (!stats[r.reviewee_id]) stats[r.reviewee_id] = { count: 0, total: 0 };
        stats[r.reviewee_id].count++;
        stats[r.reviewee_id].total += Number(r.overall_score || 0);
      }
      return stats;
    },
    enabled: !!companyId,
  });

  if (isLoading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
    </div>
  );

  if (!employees || employees.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-lg border bg-card">
      <ClipboardCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">No employees found</p>
    </div>
  );

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-4 py-3 bg-[#F6F5FF] border-b text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Employee</span>
        <span>Tasks Done</span>
        <span>On-Time Rate</span>
        <span>Complexity</span>
        <span>Avg Rating</span>
        <span />
      </div>
      <div className="divide-y">
        {employees.map((emp: any) => {
          const s = taskStats?.[emp.id] || { total: 0, completed: 0, onTime: 0, easy: 0, medium: 0, hard: 0 };
          const onTimeRate = s.completed > 0 ? Math.round((s.onTime / s.completed) * 100) : null;
          const r = ratingStats?.[emp.id];
          const avgRating = r && r.count > 0 ? (r.total / r.count).toFixed(1) : null;
          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => onSelect(emp)}
              className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-4 py-3.5 items-center hover:bg-muted/30 transition-colors text-left"
            >
              {/* Employee */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={emp.avatar_url || ''} />
                  <AvatarFallback className="text-xs">{getInitials(emp.full_name || '?')}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{emp.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.designation || emp.department || '—'}</p>
                </div>
              </div>
              {/* Tasks Done */}
              <div className="text-sm">
                <span className="font-semibold text-foreground">{s.completed}</span>
                <span className="text-muted-foreground"> / {s.total}</span>
              </div>
              {/* On-Time Rate */}
              <div className="text-sm">
                {onTimeRate !== null
                  ? <span className={cn('font-semibold', onTimeRate >= 80 ? 'text-green-600' : onTimeRate >= 50 ? 'text-amber-600' : 'text-red-600')}>{onTimeRate}%</span>
                  : <span className="text-muted-foreground">—</span>
                }
              </div>
              {/* Complexity */}
              <div className="flex items-center gap-1 flex-wrap">
                {s.easy > 0 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: '#D1FAE5', color: '#065F46' }}>E:{s.easy}</span>}
                {s.medium > 0 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>M:{s.medium}</span>}
                {s.hard > 0 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>H:{s.hard}</span>}
                {s.easy === 0 && s.medium === 0 && s.hard === 0 && <span className="text-muted-foreground text-xs">—</span>}
              </div>
              {/* Avg Rating */}
              <div className="flex items-center gap-1">
                {avgRating
                  ? <><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /><span className="text-sm font-semibold">{avgRating}</span><span className="text-xs text-muted-foreground">/5</span></>
                  : <span className="text-muted-foreground text-xs">No ratings</span>
                }
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Employee Detail View ─────────────────────────────────────────────

const EmployeeDetailView = ({ emp, onBack }: { emp: any; onBack: () => void }) => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = employee?.company_id;
  const [expandedRatings, setExpandedRatings] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [ratingProject, setRatingProject] = useState<any>(null); // project to rate on
  const [ratingScores, setRatingScores] = useState<Record<string, number>>({});
  const [ratingRemarks, setRatingRemarks] = useState('');
  const [ratingDate, setRatingDate] = useState<Date>(new Date());
  const roles = employee?.roles ?? [];
  const isManager = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const myId = employee?.employee_id;

  // Fetch tasks grouped by project
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['perf-tasks', emp.id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id, title, complexity, deadline, is_completed, completed_at,
          project:projects!project_tasks_project_id_fkey(id, project_name, project_code, status)
        `)
        .eq('assigned_to', emp.id)
        .eq('company_id', companyId!)
        .order('deadline', { ascending: true, nullsFirst: false });
      if (error) throw error;
      // Group by project
      const groups: Record<string, { project: any; tasks: any[] }> = {};
      for (const t of (data || [])) {
        const pid = (t.project as any)?.id || 'no-project';
        if (!groups[pid]) groups[pid] = { project: t.project, tasks: [] };
        groups[pid].tasks.push(t);
      }
      return Object.values(groups);
    },
    enabled: !!companyId,
  });

  // Fetch qualitative ratings
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['perf-ratings', emp.id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_evaluations')
        .select(`
          id, date, direction, overall_score, remarks, reviewer_id,
          reviewer:employees!daily_evaluations_reviewer_id_fkey(full_name, avatar_url),
          project:projects!daily_evaluations_project_id_fkey(project_name, project_code),
          project_evaluation_scores(score, parameter:evaluation_parameters!project_evaluation_scores_parameter_id_fkey(name))
        `)
        .eq('reviewee_id', emp.id)
        .eq('company_id', companyId!)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('project_evaluation_scores').delete().eq('project_evaluation_id', id).eq('company_id', companyId!);
      const { error } = await supabase.from('project_evaluations').delete().eq('id', id).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Rating deleted');
      queryClient.invalidateQueries({ queryKey: ['perf-ratings', emp.id, companyId] });
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  // Summary stats
  const allTasks = (tasks || []).flatMap(g => g.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.is_completed).length;
  const onTimeTasks = allTasks.filter(t => t.is_completed && t.deadline && t.completed_at && new Date(t.completed_at) <= new Date(t.deadline)).length;
  const onTimeRate = completedTasks > 0 ? Math.round((onTimeTasks / completedTasks) * 100) : null;
  const easy = allTasks.filter(t => t.complexity === 'easy').length;
  const medium = allTasks.filter(t => t.complexity === 'medium').length;
  const hard = allTasks.filter(t => t.complexity === 'hard').length;

  const getTaskStatus = (t: any) => {
    if (t.is_completed) {
      if (!t.deadline) return { label: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-green-600' };
      return new Date(t.completed_at) <= new Date(t.deadline)
        ? { label: 'On Time', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-green-600' }
        : { label: 'Late', icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'text-red-600' };
    }
    if (t.deadline && new Date(t.deadline) < new Date()) {
      return { label: 'Overdue', icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'text-red-600' };
    }
    return { label: 'Pending', icon: <Clock className="h-3.5 w-3.5" />, color: 'text-amber-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={emp.avatar_url || ''} />
          <AvatarFallback>{getInitials(emp.full_name || '?')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{emp.full_name}</h2>
          <p className="text-sm text-muted-foreground">{emp.designation || '—'} · {emp.department || '—'}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => navigate(`/evaluations/project/new?revieweeId=${emp.id}`)}>
            <Plus className="h-4 w-4 mr-2" /> Submit Rating
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Tasks Completed', value: `${completedTasks} / ${totalTasks}` },
          { label: 'On-Time Rate', value: onTimeRate !== null ? `${onTimeRate}%` : '—', color: onTimeRate !== null ? (onTimeRate >= 80 ? 'text-green-600' : onTimeRate >= 50 ? 'text-amber-600' : 'text-red-600') : '' },
          { label: 'Easy Tasks', value: String(easy), color: 'text-green-600' },
          { label: 'Medium Tasks', value: String(medium), color: 'text-amber-600' },
          { label: 'Hard Tasks', value: String(hard), color: 'text-red-600' },
          { label: 'Ratings Received', value: String((ratings || []).length) },
        ].map(c => (
          <div key={c.label} className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className={cn('text-2xl font-bold', c.color || 'text-foreground')}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Project Breakdown */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-foreground">Project Breakdown</h3>
        {tasksLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No tasks assigned to this employee yet.</div>
        ) : (
          tasks.map((group, idx) => (
            <div key={idx} className="rounded-lg border bg-card overflow-hidden">
              {/* Project header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F6F5FF] border-b">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                      {group.project ? `${(group.project as any).project_code} — ${(group.project as any).project_name}` : 'Unknown Project'}
                    </span>
                    {group.project && (
                      <Badge className={cn('text-xs', statusColors[(group.project as any).status] || 'bg-muted text-muted-foreground')}>
                        {fmt((group.project as any).status || '')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {/* Task rows */}
              <div className="divide-y">
                {group.tasks.map((t: any) => {
                  const status = getTaskStatus(t);
                  const cc = complexityColor(t.complexity || '');
                  return (
                    <div key={t.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center">
                      <span className="text-sm text-foreground">{t.title}</span>
                      {t.complexity && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ background: cc.bg, color: cc.text }}>
                          {t.complexity.charAt(0).toUpperCase() + t.complexity.slice(1)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {t.deadline ? formatDate(t.deadline) : 'No deadline'}
                      </span>
                      <div className={cn('flex items-center gap-1 text-xs font-medium whitespace-nowrap', status.color)}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Qualitative Ratings */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-foreground">Qualitative Ratings</h3>
        {ratingsLoading ? (
          <div className="space-y-3">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
        ) : !ratings || ratings.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No ratings submitted for this employee yet.</div>
        ) : (
          <div className="rounded-lg border bg-card divide-y overflow-hidden">
            {ratings.map((r: any) => {
              const isExpanded = expandedRatings.has(r.id);
              const canDel = isManager || r.reviewer_id === myId;
              return (
                <div key={r.id}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={r.reviewer?.avatar_url || ''} />
                      <AvatarFallback className="text-xs">{getInitials(r.reviewer?.full_name || '?')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{r.reviewer?.full_name || '—'}</span>
                        {r.project && (
                          <span className="text-xs text-muted-foreground">· {(r.project as any).project_code} — {(r.project as any).project_name}</span>
                        )}
                        <span className="text-xs text-muted-foreground">· {formatDate(r.date)}</span>
                      </div>
                      {r.remarks && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.remarks}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{Number(r.overall_score).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                    {canDel && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setDeleteId(r.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                    <button type="button" className="text-muted-foreground hover:text-foreground shrink-0" onClick={() => setExpandedRatings(prev => {
                      const next = new Set(prev);
                      next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                      return next;
                    })}>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  {isExpanded && r.project_evaluation_scores?.length > 0 && (
                    <div className="px-4 pb-3 pl-14 space-y-1.5">
                      {r.project_evaluation_scores.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{s.parameter?.name || '—'}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, j) => (
                              <Star key={j} className={cn('h-3 w-3', j < s.score ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">{s.score}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rating</DialogTitle>
            <DialogDescription>Delete this rating? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" disabled={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────

const DailyEvaluations = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  return (
    <div className="space-y-6">
      {!selectedEmployee && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Click on an employee to view their performance and ratings.</p>
          <Button onClick={() => navigate('/evaluations/project/new')}>
            <Plus className="h-4 w-4 mr-2" /> Submit Rating
          </Button>
        </div>
      )}
      {selectedEmployee
        ? <EmployeeDetailView emp={selectedEmployee} onBack={() => setSelectedEmployee(null)} />
        : <EmployeeListView onSelect={setSelectedEmployee} />
      }
    </div>
  );
};

export default DailyEvaluations;
