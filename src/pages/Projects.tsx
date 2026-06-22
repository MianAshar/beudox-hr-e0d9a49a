import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import {
  Plus, Search, FolderKanban, XCircle, Loader2, ChevronDown, ChevronRight, Trash2,
  Pencil, FileText, Users, ListChecks, History, ChevronsDownUp, ChevronsUpDown, ArrowUpDown, Play,
} from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ProjectTasksSection } from '@/components/projects/ProjectTasksSection';
import { ManageTeamModal } from '@/components/projects/ManageTeamModal';
import { ProjectsSummary } from '@/components/projects/ProjectsSummary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || '?';

interface TeamMember {
  id: string;
  full_name: string;
  avatar_url: string | null;
  designation?: string | null;
}

const TeamMembersStack = ({ members }: { members: TeamMember[] }) => {
  if (!members || members.length === 0) {
    return <span className="text-xs text-muted-foreground">No team</span>;
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
              <Avatar key={m.id} className="h-7 w-7 border-2 border-background">
                {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.full_name} />}
                <AvatarFallback className="text-[10px] font-medium bg-muted text-foreground">
                  {getInitials(m.full_name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extra > 0 && (
              <div className="h-7 w-7 rounded-full border-2 border-background bg-muted text-foreground text-[10px] font-medium flex items-center justify-center">
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

interface StartProjectButtonProps {
  projectId: string;
  companyId: string;
  employeeId: string;
  size?: 'sm' | 'default';
}

const StartProjectButton = ({ projectId, companyId, employeeId, size = 'sm' }: StartProjectButtonProps) => {
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
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project-detail'] });
      qc.invalidateQueries({ queryKey: ['project-activity'] });
      qc.invalidateQueries({ queryKey: ['project-activity-inline'] });
      toast({ title: 'Project started' });
      setOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Failed to start project', description: e.message, variant: 'destructive' }),
  });

  return (
    <>
      <Button size={size} onClick={e => { e.stopPropagation(); setOpen(true); }}>
        <Play className="h-4 w-4 mr-2" /> Start Project
      </Button>
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

const STATUS_OPTIONS = ['pending', 'in_progress', 'qc_required', 'completed', 'submitted', 'on_hold', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-[#F3F4F6] text-[#374151] hover:bg-[#F3F4F6]',
  in_progress: 'bg-blue-100 text-blue-700',
  qc_required: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  submitted: 'bg-purple-100 text-purple-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\bQc\b/g, 'QC');

const Projects = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const roles = employee?.roles ?? [];
  const role = employee?.role_name ?? null;
  const isManager = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const canSeeClient = ['hr_manager', 'ceo', 'finance_manager'].some(r => roles.includes(r));
  const canSeeFinancial = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const canSeeTeam = ['hr_manager', 'ceo', 'team_lead'].some(r => roles.includes(r));
  const canEditDeadline = ['hr_manager', 'ceo', 'team_lead'].some(r => roles.includes(r));
  const canSeeActivity = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const canManageTeam = ['hr_manager', 'ceo', 'team_lead'].some(r => roles.includes(r));
  const employeeId = employee?.employee_id;
  const isPureEmployee = roles.length > 0 && roles.every(r => r === 'employee');

  const { data: currentEmpMeta } = useQuery({
    queryKey: ['current-employee-employment-type', employeeId],
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('employment_type, department').eq('id', employeeId!).maybeSingle();
      return data;
    },
    enabled: !!employeeId,
  });
  const isCeoOrDirector = roles.includes('ceo') || currentEmpMeta?.employment_type === 'director';
  const currentDept = (currentEmpMeta?.department || '').trim().toLowerCase();
  const isEstimationTeam = currentDept === 'gc team' || currentDept === 'mep team';
  // Estimation team members can edit status on projects they're assigned to (handled per-row).
  const canEditStatus = isManager || roles.includes('team_lead') || isCeoOrDirector || isEstimationTeam;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [manageTeamProject, setManageTeamProject] = useState<any>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('default');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', companyId, role, employeeId, showInactive],
    queryFn: async () => {
      const projectSelect = '*, clients(id, name), project_categories(name), lead:employees!projects_project_lead_id_fkey(id, full_name, avatar_url, designation)';

      if (isManager) {
        let query = supabase
          .from('projects')
          .select(projectSelect)
          .eq('company_id', companyId!);
        if (!showInactive) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }

      const { data: assignments, error: assignmentError } = await supabase
        .from('project_assignments')
        .select('project_id')
        .eq('company_id', companyId!)
        .eq('employee_id', employeeId!)
        .eq('is_active', true);
      if (assignmentError) throw assignmentError;

      const assignedIds = assignments?.map((assignment) => assignment.project_id) ?? [];

      if (roles.includes('team_lead')) {
        const [leadProjectsResult, assignedProjectsResult] = await Promise.all([
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

        if (leadProjectsResult.error) throw leadProjectsResult.error;
        if (assignedProjectsResult.error) throw assignedProjectsResult.error;

        const mergedProjects = [...(leadProjectsResult.data ?? []), ...(assignedProjectsResult.data ?? [])];
        const uniqueProjects = Array.from(new Map(mergedProjects.map((project: any) => [project.id, project])).values());
        return uniqueProjects.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      if (assignedIds.length === 0) return [];

      const { data, error } = await supabase
        .from('projects')
        .select(projectSelect)
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .in('id', assignedIds)
        .neq('status', 'pending')
        .neq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!companyId && !!employeeId && !!role,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients-filter', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('id, name').eq('company_id', companyId!).eq('is_active', true).order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && isManager,
  });

  const projectIds = (projects ?? []).map((p: any) => p.id);

  const { data: teamAssignments } = useQuery({
    queryKey: ['project-team-members', companyId, projectIds.join(',')],
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
    enabled: !!companyId && canSeeTeam && projectIds.length > 0,
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

  const { data: taskCounts } = useQuery({
    queryKey: ['project-task-counts', companyId, projectIds.join(',')],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const { data, error } = await supabase
        .from('project_tasks')
        .select('project_id, is_completed')
        .eq('company_id', companyId!)
        .in('project_id', projectIds);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && projectIds.length > 0,
  });

  const taskCountByProject = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    (taskCounts ?? []).forEach((t: any) => {
      const c = map.get(t.project_id) ?? { total: 0, completed: 0 };
      c.total += 1;
      if (t.is_completed) c.completed += 1;
      map.set(t.project_id, c);
    });
    return map;
  }, [taskCounts]);

  const deactivateMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.from('projects').update({ is_active: false, status: 'cancelled' }).eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deactivated' });
      setDeactivateTarget(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const todayIso = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const filtered = (projects ?? []).filter((p: any) => {
    if (search && !p.project_code.toLowerCase().includes(search.toLowerCase()) && !p.project_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
    if (clientFilter !== 'all' && p.client_id !== clientFilter) return false;
    return true;
  });

  const sortedFiltered = useMemo(() => {
    if (sortBy === 'default') {
      if (!isPureEmployee) return filtered;
      // Employee default sort: pending/in-progress first, then QC, on-hold, completed, cancelled.
      // Within each group, sort by internal_deadline ascending (soonest first).
      const priority: Record<string, number> = {
        in_progress: 1,
        pending: 1,
        qc_required: 2,
        on_hold: 3,
        completed: 4,
        cancelled: 5,
      };
      return [...filtered].sort((a, b) => {
        const pa = priority[a.status] ?? 99;
        const pb = priority[b.status] ?? 99;
        if (pa !== pb) return pa - pb;
        const da = a.internal_deadline || '';
        const db = b.internal_deadline || '';
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return String(da).localeCompare(String(db));
      });
    }
    const accessors: Record<string, (p: any) => any> = {
      project_code: (p) => p.project_code || '',
      project_name: (p) => p.project_name || '',
      status: (p) => p.status || '',
      internal_deadline: (p) => p.internal_deadline,
    };
    const acc = accessors[sortBy];
    if (!acc) return filtered;
    const mul = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = acc(a); const vb = acc(b);
      const aNil = va === null || va === undefined || va === '';
      const bNil = vb === null || vb === undefined || vb === '';
      if (aNil && bNil) return 0;
      if (aNil) return 1;
      if (bNil) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * mul;
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' }) * mul;
    });
  }, [filtered, sortBy, sortDir, isPureEmployee]);

  const allExpanded = filtered.length > 0 && filtered.every((p: any) => expandedIds.has(p.id));
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filtered.map((p: any) => p.id)));
    }
  };
  const toggleOne = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const isCEO = roles.includes('ceo');

  const listContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {projects ? `${projects.length} project${projects.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => navigate('/projects/new')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-full sm:max-w-xs sm:flex-1 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search code or name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {isManager && (
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {['high', 'medium', 'low'].map(p => (
                  <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients && clients.length > 0 && (
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Client" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <Switch id="show-inactive-projects" checked={showInactive} onCheckedChange={setShowInactive} />
              <Label htmlFor="show-inactive-projects" className="text-sm text-muted-foreground cursor-pointer">Show inactive</Label>
            </div>
          </>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default order</SelectItem>
              <SelectItem value="project_code">Project Code</SelectItem>
              <SelectItem value="project_name">Project Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="internal_deadline">Internal Deadline</SelectItem>
            </SelectContent>
          </Select>
          {sortBy !== 'default' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              aria-label={`Sort ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
              title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDir === 'asc' ? <ChevronsUpDown className="h-4 w-4" /> : <ChevronsDownUp className="h-4 w-4" />}
              <span className="ml-1.5 text-xs">{sortDir === 'asc' ? 'Asc' : 'Desc'}</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
            disabled={filtered.length === 0}
          >
            {allExpanded ? (
              <><ChevronsDownUp className="h-4 w-4 mr-2" /> Collapse All</>
            ) : (
              <><ChevronsUpDown className="h-4 w-4 mr-2" /> Expand All</>
            )}
          </Button>
        </div>
      </div>

      {/* Project list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">{search || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Sticky column headers — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:flex sticky top-0 z-10 h-10 items-center gap-3 border-b bg-secondary px-4">
            <div className="w-8 shrink-0" />
            <span className="w-20 shrink-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Code</span>
            <span className="flex-1 min-w-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
            <span className="w-[220px] shrink-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Scope of Work</span>
            <span className="w-[180px] shrink-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Deadline</span>
            <span className="w-[160px] shrink-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Lead</span>
            <span className="w-[160px] shrink-0 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
            <div className="w-10 shrink-0" />
          </div>

          {sortedFiltered.map((p: any) => {
            const isDueToday = p.internal_deadline === todayIso;
            const isCollapsed = !expandedIds.has(p.id);
            const team = teamByProject.get(p.id) ?? [];
            const tc = taskCountByProject.get(p.id);
            return (
              <ProjectCard
                key={p.id}
                project={p}
                team={team}
                taskCount={tc}
                isCollapsed={isCollapsed}
                onToggle={() => toggleOne(p.id)}
                onOpenDetail={() => navigate(`/projects/${p.id}`)}
                onDeactivate={() => setDeactivateTarget(p)}
                onManageTeam={() => setManageTeamProject(p)}
                canManageTeam={canManageTeam}
                isDueToday={isDueToday}
                isManager={isManager}
                canSeeClient={canSeeClient}
                canSeeFinancial={canSeeFinancial}
                canSeeTeam={canSeeTeam}
                canEditStatus={canEditStatus}
                canEditDeadline={canEditDeadline}
                canSeeActivity={canSeeActivity}
                companyId={companyId!}
                employeeId={employeeId!}
                role={role}
                isCeoOrDirector={isCeoOrDirector}
              />
            );
          })}
        </div>
      )}

      {/* Deactivate Dialog */}
      <Dialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{deactivateTarget?.project_name}"? The project will be marked as cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deactivateMutation.mutate(deactivateTarget?.id)} disabled={deactivateMutation.isPending}>
              {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Team Modal */}
      {manageTeamProject && companyId && employeeId && (
        <ManageTeamModal
          open={!!manageTeamProject}
          onOpenChange={(open) => { if (!open) setManageTeamProject(null); }}
          projectId={manageTeamProject.id}
          projectName={manageTeamProject.project_name}
          companyId={companyId}
          currentUserId={employeeId}
        />
      )}
    </>
  );

  if (isCEO) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList
            className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start overflow-x-auto flex-nowrap"
            style={{ borderColor: 'hsl(var(--border))' }}
          >
            <TabsTrigger
              value="summary"
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              All Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-6"><ProjectsSummary /></TabsContent>
          <TabsContent value="list" className="space-y-6 mt-6">{listContent}</TabsContent>
        </Tabs>
      </div>
    );
  }

  return <div className="p-4 lg:p-6 space-y-6">{listContent}</div>;
};

interface ProjectCardProps {
  project: any;
  team: TeamMember[];
  taskCount?: { total: number; completed: number };
  isCollapsed: boolean;
  onToggle: () => void;
  onOpenDetail: () => void;
  onDeactivate: () => void;
  onManageTeam: () => void;
  isDueToday: boolean;
  isManager: boolean;
  canSeeClient: boolean;
  canSeeFinancial: boolean;
  canSeeTeam: boolean;
  canManageTeam: boolean;
  canEditStatus: boolean;
  canEditDeadline: boolean;
  canSeeActivity: boolean;
  companyId: string;
  employeeId: string;
  role?: string | null;
  isCeoOrDirector: boolean;
}

const ProjectCard = ({
  project: p, team, taskCount, isCollapsed, onToggle, onOpenDetail, onDeactivate, onManageTeam, isDueToday,
  isManager, canSeeClient, canSeeFinancial, canSeeTeam, canManageTeam, canEditStatus, canEditDeadline, canSeeActivity,
  companyId, employeeId, role, isCeoOrDirector,
}: ProjectCardProps) => {
  const isExpanded = !isCollapsed;
  const canManageTasks = ['ceo', 'hr_manager', 'team_lead'].includes(role || '');
  return (
    <div
      className={cn(
        'rounded-[14px] border overflow-hidden transition-colors',
        isExpanded ? 'bg-[#F6F5FF]' : 'bg-card',
        isDueToday && !isExpanded && 'bg-[#FEF3C7]',
      )}
      style={{
        borderColor: 'hsl(var(--border))',
        borderLeftWidth: isExpanded ? '3px' : undefined,
        borderLeftColor: isExpanded ? '#5B3FF8' : undefined,
      }}
    >
      {/* Header row (always visible) */}
      <div
        className={cn(
          'flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-2 px-4 py-3 cursor-pointer transition-colors',
          isExpanded ? 'bg-[#F6F5FF] hover:bg-[#EFEDFF]' : 'hover:bg-muted/40',
          isDueToday && !isExpanded && 'hover:bg-[#FEF3C7]/80',
        )}
        onClick={onToggle}
      >
        {/* Chevron */}
        <div className="w-8 shrink-0 flex items-center justify-center">
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            className="text-muted-foreground hover:text-foreground"
            onClick={e => { e.stopPropagation(); onToggle(); }}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Project Code */}
        <span className="font-mono text-xs text-muted-foreground w-16 lg:w-20 shrink-0 truncate">{p.project_code}</span>

        {/* Project Name */}
        <div className="flex-1 min-w-0 flex items-center gap-2 order-1 lg:order-none basis-full lg:basis-auto">
          <button
            type="button"
            className="font-medium text-sm text-foreground hover:underline truncate text-left min-w-0"
            onClick={e => { e.stopPropagation(); onOpenDetail(); }}
            title={p.project_name}
          >
            {p.project_name}
          </button>
          {!p.is_active && <Badge variant="outline" className="text-xs shrink-0">Inactive</Badge>}
        </div>

        {/* Scope of Work */}
        <div className="w-[220px] shrink-0 text-xs text-foreground/80 truncate order-2 lg:order-none" title={p.scope_of_work || ''}>
          {p.scope_of_work?.trim() || <span className="text-muted-foreground">—</span>}
        </div>

        {/* Deadline */}
        <div onClick={e => e.stopPropagation()} className="w-[180px] shrink-0 text-sm order-3 lg:order-none">
          {isCeoOrDirector ? (
            <div className="flex flex-col leading-tight">
              <span style={{ fontFamily: 'DM Sans', fontWeight: 400, fontSize: 12, color: '#4B4468' }}>
                Client: {formatDate(p.client_deadline) || '—'}
              </span>
              <span style={{ fontFamily: 'DM Sans', fontWeight: 400, fontSize: 12, color: '#9490B4' }}>
                Internal: {formatDate(p.internal_deadline) || '—'}
              </span>
            </div>
          ) : (
            <DeadlineCell project={p} canEdit={canEditDeadline} companyId={companyId} employeeId={employeeId} isDueToday={isDueToday} />
          )}
        </div>

        {/* Lead */}
        <div className="w-[160px] shrink-0 flex items-center gap-2 min-w-0 order-4 lg:order-none">
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

        {/* Status */}
        <div onClick={e => e.stopPropagation()} className="w-[160px] shrink-0 order-5 lg:order-none">
          <StatusCell project={p} canEdit={canEditStatus} companyId={companyId} employeeId={employeeId} />
        </div>

        {/* Delete */}
        <div className="w-10 shrink-0 flex items-center justify-center ml-auto lg:ml-0 order-6 lg:order-none">
          {isManager && p.is_active && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={e => { e.stopPropagation(); onDeactivate(); }}
              aria-label="Deactivate project"
            >
              <XCircle className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {!isCollapsed && (
        <div
          className="px-4 py-4 space-y-5 bg-white"
          style={{ borderTop: '1px solid rgba(91,63,248,0.15)' }}
        >
          {p.status === 'pending' && canEditStatus && (
            <div className="flex justify-end">
              <StartProjectButton projectId={p.id} companyId={companyId} employeeId={employeeId} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left column: Scope + Notes */}
            <div className="space-y-4">
              <Section icon={<FileText className="h-3.5 w-3.5" />} title="Scope of Work">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {p.scope_of_work?.trim() || <span className="text-muted-foreground italic">No scope defined</span>}
                </p>
              </Section>
              <Section title="Notes / Progress">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {p.notes?.trim() || <span className="text-muted-foreground italic">No notes</span>}
                </p>
              </Section>
            </div>

            {/* Right column: meta */}
            <div className="space-y-2 text-sm">
              {canSeeClient && (
                <MetaRow label="Client">
                  {p.clients?.id ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Link to={`/clients/${p.clients.id}`} className="text-primary hover:underline" onClick={e => e.stopPropagation()}>
                        {p.clients.name}
                      </Link>
                      {(p as any).sub_series && (
                        <span className="inline-flex items-center rounded-full" style={{ backgroundColor: '#F6F5FF', color: '#4B4468', fontSize: 11, padding: '2px 8px' }}>
                          {(p as any).sub_series}
                        </span>
                      )}
                    </span>
                  ) : '—'}
                </MetaRow>
              )}
              {canSeeFinancial && (
                <MetaRow label="Fee">
                  {p.fee != null && p.fee > 0 ? Number(p.fee).toLocaleString() : '—'}
                </MetaRow>
              )}
              {isCeoOrDirector && (
                <MetaRow label="Client Deadline">{formatDate(p.client_deadline) || '—'}</MetaRow>
              )}
              <MetaRow label="Internal Deadline">{formatDate(p.internal_deadline) || '—'}</MetaRow>
              {p.priority && (
                <MetaRow label="Priority">
                  <Badge className={priorityColors[p.priority] || ''}>{fmt(p.priority)}</Badge>
                </MetaRow>
              )}
              {p.project_categories?.name && (
                <MetaRow label="Category">{p.project_categories.name}</MetaRow>
              )}
            </div>
          </div>

          {/* Team members */}
          {canSeeTeam && (
            <Section icon={<Users className="h-3.5 w-3.5" />} title={`Team Members (${team.length})`}>
              {team.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members assigned</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {team.map(m => (
                    <div key={m.id} className="flex items-center gap-2 p-2 rounded-md bg-card border border-border">
                      <Avatar className="h-7 w-7">
                        {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.full_name} />}
                        <AvatarFallback className="text-[10px]">{getInitials(m.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{m.full_name}</p>
                        {m.designation && <p className="text-xs text-muted-foreground truncate">{m.designation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Tasks */}
          <Section icon={<ListChecks className="h-3.5 w-3.5" />} title="Tasks">
            <ProjectTasksSection
              projectId={p.id}
              companyId={companyId}
              employeeId={employeeId}
              teamMembers={team}
              canManage={canManageTasks}
            />
          </Section>

          {/* Activity log — managers only */}
          {canSeeActivity && (
            <Section icon={<History className="h-3.5 w-3.5" />} title="Activity">
              <InlineActivityLog projectId={p.id} companyId={companyId} />
            </Section>
          )}
        </div>
      )}
    </div>
  );
};

const Section = ({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
      {icon}{title}
    </h3>
    {children}
  </div>
);

const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="text-foreground text-sm text-right">{children}</span>
  </div>
);

interface InlineActivityLogProps {
  projectId: string;
  companyId: string;
}

const InlineActivityLog = ({ projectId, companyId }: InlineActivityLogProps) => {
  const [showAll, setShowAll] = useState(false);
  const { data: logs, isLoading } = useQuery({
    queryKey: ['project-activity-inline', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_activity_logs')
        .select('id, action, old_value, new_value, created_at, employees:employees!project_activity_logs_employee_id_fkey(full_name)')
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId && !!companyId,
  });

  if (isLoading) return <Skeleton className="h-12 w-full" />;
  if (!logs || logs.length === 0) return <p className="text-sm text-muted-foreground">No activity yet</p>;

  const visible = showAll ? logs : logs.slice(0, 3);
  const formatValue = (action: string, value: string | null) => {
    if (!value) return '—';
    if (action === 'status_changed') return fmt(value);
    if (action === 'deadline_changed') return formatDate(value);
    return value;
  };
  const actionLabels: Record<string, string> = {
    status_changed: 'Status',
    deadline_changed: 'Deadline',
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-1.5">
        {visible.map((log: any) => (
          <li key={log.id} className="text-xs flex items-baseline justify-between gap-3">
            <span className="text-foreground">
              <span className="text-muted-foreground">{actionLabels[log.action] || fmt(log.action)}:</span>{' '}
              <span className="text-muted-foreground">{formatValue(log.action, log.old_value)}</span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="font-medium">{formatValue(log.action, log.new_value)}</span>
              <span className="text-muted-foreground"> by {log.employees?.full_name || 'Unknown'}</span>
            </span>
            <span className="text-muted-foreground whitespace-nowrap">
              {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </li>
        ))}
      </ul>
      {logs.length > 3 && (
        <button
          type="button"
          className="text-xs text-primary hover:underline"
          onClick={() => setShowAll(s => !s)}
        >
          {showAll ? 'Show less' : `View all (${logs.length})`}
        </button>
      )}
    </div>
  );
};

interface StatusCellProps {
  project: any;
  canEdit: boolean;
  companyId: string;
  employeeId: string;
}

const StatusCell = ({ project, canEdit, companyId, employeeId }: StatusCellProps) => {
  const qc = useQueryClient();
  const [optimistic, setOptimistic] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const previousStatus = project.status;
      const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', project.id);
      if (error) throw error;
      await logProjectActivity({
        companyId,
        projectId: project.id,
        employeeId,
        action: 'status_changed',
        oldValue: previousStatus,
        newValue: newStatus,
      });
    },
    onSuccess: () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
      setTimeout(() => setOptimistic(null), 50);
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project-activity'] });
      qc.invalidateQueries({ queryKey: ['project-activity-inline'] });
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
        'transition-all border border-transparent inline-flex items-center gap-1',
        flash && 'ring-2 ring-bx-success ring-offset-1',
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

interface DeadlineCellProps {
  project: any;
  canEdit: boolean;
  companyId: string;
  employeeId: string;
  isDueToday?: boolean;
}

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const DeadlineCell = ({ project, canEdit, companyId, employeeId, isDueToday }: DeadlineCellProps) => {
  const qc = useQueryClient();
  const [optimistic, setOptimistic] = useState<string | null | undefined>(undefined);
  const [flash, setFlash] = useState(false);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newDate: string) => {
      const previousDate = project.internal_deadline as string | null;
      const { error } = await supabase
        .from('projects')
        .update({ internal_deadline: newDate })
        .eq('id', project.id);
      if (error) throw error;
      await logProjectActivity({
        companyId,
        projectId: project.id,
        employeeId,
        action: 'deadline_changed',
        oldValue: previousDate,
        newValue: newDate,
      });
    },
    onSuccess: () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
      setTimeout(() => setOptimistic(undefined), 50);
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project-activity'] });
      qc.invalidateQueries({ queryKey: ['project-activity-inline'] });
    },
    onError: (e: Error) => {
      setOptimistic(undefined);
      toast({ title: 'Failed to update deadline', description: e.message, variant: 'destructive' });
    },
  });

  const value = optimistic !== undefined ? optimistic : (project.internal_deadline as string | null);
  const isPending = mutation.isPending;

  const display = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-1 py-0.5 transition-all',
        flash && 'ring-2 ring-bx-success ring-offset-1',
        isDueToday && 'text-[#92400E] font-medium',
      )}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      ) : (
        <>
          {isDueToday && (
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
          <span>{formatDate(value) || '—'}</span>
          {canEdit && (
            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          )}
        </>
      )}
    </span>
  );

  if (!canEdit) return display;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isPending}>
        <button type="button" className="group inline-flex cursor-pointer hover:text-foreground">
          {display}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={d => {
            if (!d) return;
            const iso = toIsoDate(d);
            if (iso === value) {
              setOpen(false);
              return;
            }
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

export default Projects;
