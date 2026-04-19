import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Pencil, Calendar, FileText, Users, Trash2, XCircle, Play, UserCog } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { ProjectActivityLog } from '@/components/projects/ProjectActivityLog';
import { ProjectTasksSection } from '@/components/projects/ProjectTasksSection';
import { ManageTeamModal } from '@/components/projects/ManageTeamModal';
import { ListChecks } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-[#F3F4F6] text-[#374151] hover:bg-[#F3F4F6]',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  invoiced: 'bg-purple-100 text-purple-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const qc = useQueryClient();
  const role = employee?.role_name;
  const companyId = employee?.company_id;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const isCeo = role === 'ceo';
  const canSeeClient = role === 'hr_manager' || role === 'ceo' || role === 'finance_manager';
  const canManageTasks = role === 'ceo' || role === 'hr_manager' || role === 'team_lead';
  const canSeeActivity = role === 'hr_manager' || role === 'ceo';
  const canStartProject = role === 'ceo' || role === 'hr_manager' || role === 'team_lead';
  const employeeId = employee?.employee_id;

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [startOpen, setStartOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project-detail', id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(id, name), project_categories(name), lead:employees!projects_project_lead_id_fkey(id, full_name, designation, avatar_url)')
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['project-team', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_assignments')
        .select(`
          id,
          is_active,
          removed_at,
          employees!project_assignments_employee_id_fkey (
            id,
            full_name,
            designation,
            avatar_url
          )
        `)
        .eq('project_id', id!)
        .eq('is_active', true)
        .is('removed_at', null);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deactivateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('projects').update({ is_active: false, status: 'cancelled' }).eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deactivated' });
      navigate('/projects');
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Delete assignments first, then project
      await supabase.from('project_assignments').delete().eq('project_id', id!);
      const { error } = await supabase.from('projects').delete().eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deleted' });
      navigate('/projects');
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('projects').update({ status: 'in_progress' }).eq('id', id!);
      if (error) throw error;
      await supabase.from('project_activity_logs').insert({
        company_id: companyId!,
        project_id: id!,
        employee_id: employeeId!,
        action: 'project_started',
        old_value: 'pending',
        new_value: 'in_progress',
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project-detail'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project-activity'] });
      toast({ title: 'Project started' });
      setStartOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Failed to start project', description: e.message, variant: 'destructive' }),
  });

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-6 text-muted-foreground">Project not found.</div>;
  }

  // Employees can't view pending projects
  if (project.status === 'pending' && !canStartProject) {
    return <div className="p-6 text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{project.project_name}</h1>
              <Badge className={statusColors[project.status] || ''}>{fmt(project.status)}</Badge>
              {project.priority && <Badge className={priorityColors[project.priority] || ''}>{fmt(project.priority)}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground font-mono">{project.project_code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.status === 'pending' && canStartProject && (
            <Button onClick={() => setStartOpen(true)}>
              <Play className="h-4 w-4 mr-2" /> Start Project
            </Button>
          )}
          {isManager && (
            <>
              <Button variant="outline" onClick={() => navigate(`/projects/${id}/edit`)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" onClick={() => setDeactivateOpen(true)}>
                <XCircle className="h-4 w-4 mr-2" /> Deactivate
              </Button>
            </>
          )}
          {isCeo && (
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Project Information</h2>
          <div className="space-y-3 text-sm">
            {canSeeClient && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client</span>
                <Link to={`/clients/${project.clients?.id}`} className="text-primary hover:underline font-medium">
                  {(project.clients as any)?.name || '—'}
                </Link>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground">{(project.project_categories as any)?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project Lead</span>
              <span className="text-foreground">{(project.lead as any)?.full_name || '—'}</span>
            </div>
            {isManager && project.fee != null && project.fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-foreground font-medium">{Number(project.fee).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Deadlines
          </h2>
          <div className="space-y-3 text-sm">
            {isManager && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client Deadline</span>
                <span className="text-foreground">{formatDate(project.client_deadline)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Internal Deadline</span>
              <span className="text-foreground">{formatDate(project.internal_deadline)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scope */}
      {project.scope_of_work && (
        <div className="rounded-lg border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" /> Scope of Work
          </h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{project.scope_of_work}</p>
        </div>
      )}

      {/* Notes */}
      {project.notes && (
        <div className="rounded-lg border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold text-foreground">Notes / Progress</h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{project.notes}</p>
        </div>
      )}

      {/* Team */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4" /> Team Members ({teamMembers?.length || 0})
        </h2>
        {teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {teamMembers.map((a: any) => {
              const emp = a.employees;
              if (!emp) return null;
              return (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={emp.avatar_url} />
                    <AvatarFallback className="text-xs">{initials(emp.full_name || '?')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{emp.full_name}</p>
                    {emp.designation && (
                      <p className="text-xs text-muted-foreground">{emp.designation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No team members assigned</p>
        )}
      </div>

      {/* Tasks */}
      {companyId && employeeId && (
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Tasks
          </h2>
          <ProjectTasksSection
            projectId={id!}
            companyId={companyId}
            employeeId={employeeId}
            teamMembers={(teamMembers ?? []).map((a: any) => ({
              id: a.employees?.id,
              full_name: a.employees?.full_name,
              avatar_url: a.employees?.avatar_url,
              designation: a.employees?.designation,
            })).filter(m => m.id)}
            canManage={canManageTasks}
          />
        </div>
      )}

      {/* Activity Log — managers only */}
      {canSeeActivity && companyId && (
        <ProjectActivityLog projectId={id!} companyId={companyId} />
      )}

      {/* Deactivate Dialog */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{project.project_name}"? The project will be marked as cancelled and hidden from views.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deactivateMutation.mutate()} disabled={deactivateMutation.isPending}>
              {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={v => { if (!v) { setDeleteOpen(false); setDeleteConfirmText(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project Permanently</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the project code <strong className="text-foreground">{project.project_code}</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder={`Type ${project.project_code} to confirm`}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); }}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteConfirmText !== project.project_code || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Project Dialog */}
      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to start this project? Assigned team members will be able to see it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartOpen(false)}>Cancel</Button>
            <Button onClick={() => startMutation.mutate()} disabled={startMutation.isPending}>
              {startMutation.isPending ? 'Starting…' : 'Start Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
