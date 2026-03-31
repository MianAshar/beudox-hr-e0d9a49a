import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Pencil, Calendar, DollarSign, FileText, Users } from 'lucide-react';

const statusColors: Record<string, string> = {
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
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const companyId = employee?.company_id;

  const { data: project, isLoading } = useQuery({
    queryKey: ['project-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(id, name), project_categories(name), lead:employees!projects_project_lead_id_fkey(full_name, avatar_url)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['project-team', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_assignments')
        .select('employee_id, employees(full_name, avatar_url, designation)')
        .eq('project_id', id!)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
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
        {isManager && (
          <Button variant="outline" onClick={() => navigate(`/projects/${id}/edit`)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Project Info */}
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Project Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client</span>
              <Link to={`/clients/${project.clients?.id}`} className="text-primary hover:underline font-medium">
                {(project.clients as any)?.name || '—'}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground">{(project.project_categories as any)?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project Lead</span>
              <span className="text-foreground">{(project.lead as any)?.full_name || '—'}</span>
            </div>
            {project.fee != null && project.fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-foreground font-medium">{Number(project.fee).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Dates */}
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Deadlines
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client Deadline</span>
              <span className="text-foreground">{project.client_deadline || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Internal Deadline</span>
              <span className="text-foreground">{project.internal_deadline || '—'}</span>
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
            {teamMembers.map((a: any) => (
              <div key={a.employee_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={a.employees?.avatar_url} />
                  <AvatarFallback className="text-xs">{initials(a.employees?.full_name || '?')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.employees?.full_name}</p>
                  {a.employees?.designation && (
                    <p className="text-xs text-muted-foreground">{a.employees.designation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No team members assigned</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
