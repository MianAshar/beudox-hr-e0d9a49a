import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, FolderKanban, XCircle, Loader2, ChevronDown, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
}

const TeamMembersCell = ({ members }: { members: TeamMember[] }) => {
  if (!members || members.length === 0) {
    return <span className="text-muted-foreground">—</span>;
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

const STATUS_OPTIONS = ['pending', 'in_progress', 'qc_required', 'on_hold', 'completed', 'cancelled', 'delayed'];

const statusColors: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-700',
  qc_required: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  invoiced: 'bg-purple-100 text-purple-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  delayed: 'bg-orange-100 text-orange-700',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const Projects = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const canSeeClient = role === 'hr_manager' || role === 'ceo' || role === 'finance_manager';
  const canSeeTeam = role === 'hr_manager' || role === 'ceo' || role === 'team_lead';
  const canEditStatus = role === 'hr_manager' || role === 'ceo' || role === 'team_lead';
  const canEditDeadline = canEditStatus;
  const employeeId = employee?.employee_id;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<any>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', companyId, role, showInactive],
    queryFn: async () => {
      if (isManager) {
        let query = supabase
          .from('projects')
          .select('*, clients(name), project_categories(name), lead:employees!projects_project_lead_id_fkey(full_name)')
          .eq('company_id', companyId!);
        if (!showInactive) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        const { data: assignments, error: aErr } = await supabase
          .from('project_assignments')
          .select('project_id')
          .eq('company_id', companyId!)
          .eq('employee_id', employee?.employee_id!)
          .eq('is_active', true);
        if (aErr) throw aErr;
        const pIds = assignments?.map(a => a.project_id) || [];
        if (pIds.length === 0) return [];
        const { data, error } = await supabase
          .from('projects')
          .select('*, clients(name), project_categories(name), lead:employees!projects_project_lead_id_fkey(full_name)')
          .eq('company_id', companyId!)
          .eq('status', 'in_progress')
          .eq('is_active', true)
          .in('id', pIds)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
    },
    enabled: !!companyId && !!employee,
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
        .select('project_id, employees!project_assignments_employee_id_fkey(id, full_name, avatar_url)')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .in('project_id', projectIds);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && canSeeTeam && projectIds.length > 0,
  });

  const teamByProject = new Map<string, TeamMember[]>();
  (teamAssignments ?? []).forEach((a: any) => {
    const emp = a.employees;
    if (!emp) return;
    const list = teamByProject.get(a.project_id) ?? [];
    list.push({ id: emp.id, full_name: emp.full_name, avatar_url: emp.avatar_url });
    teamByProject.set(a.project_id, list);
  });

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

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {projects ? `${projects.length} project${projects.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => navigate('/projects/new')}>
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative max-w-xs flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search code or name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {isManager && (
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
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
            <div className="flex items-center gap-2 ml-auto">
              <Switch id="show-inactive-projects" checked={showInactive} onCheckedChange={setShowInactive} />
              <Label htmlFor="show-inactive-projects" className="text-sm text-muted-foreground cursor-pointer">Show inactive</Label>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">{search || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'}</p>
        </div>
      ) : (
        <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Project Name</TableHead>
                {canSeeClient && <TableHead>Client</TableHead>}
                <TableHead>Category</TableHead>
                <TableHead>Lead</TableHead>
                {canSeeTeam && <TableHead>Team Members</TableHead>}
                <TableHead>Internal Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                {isManager && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => {
                const isDueToday = p.internal_deadline === todayIso;
                return (
                <TableRow
                  key={p.id}
                  className={cn('cursor-pointer', isDueToday && 'bg-[#FEF3C7] hover:bg-[#FEF3C7]/80')}
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  <TableCell className="font-mono text-sm">{p.project_code}</TableCell>
                  <TableCell className="font-medium">{p.project_name}</TableCell>
                  {canSeeClient && <TableCell>{p.clients?.name || '—'}</TableCell>}
                  <TableCell>{p.project_categories?.name || '—'}</TableCell>
                  <TableCell>{p.lead?.full_name || '—'}</TableCell>
                  {canSeeTeam && (
                    <TableCell onClick={e => e.stopPropagation()}>
                      <TeamMembersCell members={teamByProject.get(p.id) ?? []} />
                    </TableCell>
                  )}
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DeadlineCell
                      project={p}
                      canEdit={canEditDeadline}
                      companyId={companyId!}
                      employeeId={employeeId!}
                      isDueToday={isDueToday}
                    />
                  </TableCell>
                  <TableCell>
                    {p.priority && <Badge className={priorityColors[p.priority] || ''}>{fmt(p.priority)}</Badge>}
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <StatusCell
                      project={p}
                      canEdit={canEditStatus}
                      fmt={fmt}
                      companyId={companyId!}
                      employeeId={employeeId!}
                    />
                    {!p.is_active && <Badge variant="outline" className="ml-1 text-xs">Inactive</Badge>}
                  </TableCell>
                  {isManager && (
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      {p.is_active && (
                        <Button variant="ghost" size="icon" onClick={() => setDeactivateTarget(p)}>
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
    </div>
  );
};

interface StatusCellProps {
  project: any;
  canEdit: boolean;
  fmt: (s: string) => string;
  companyId: string;
  employeeId: string;
}

const StatusCell = ({ project, canEdit, fmt, companyId, employeeId }: StatusCellProps) => {
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
          <span>{formatDate(value)}</span>
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
