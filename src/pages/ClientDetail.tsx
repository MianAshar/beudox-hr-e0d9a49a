import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Mail, Phone, Globe, DollarSign, StickyNote, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

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

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const isCeo = (employee?.roles ?? []).includes('ceo');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['client-projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_categories(name)')
        .eq('client_id', id!)
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // 1. Get all project IDs for this client
      const { data: clientProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', id!)
        .eq('company_id', companyId!);
      const projectIds = clientProjects?.map(p => p.id) || [];

      // 2. Deactivate projects
      if (projectIds.length > 0) {
        await supabase.from('projects').update({ is_active: false }).in('id', projectIds);
        // 3. Delete assignments
        await supabase.from('project_assignments').delete().in('project_id', projectIds);
        // 4. Delete projects
        await supabase.from('projects').delete().in('id', projectIds);
      }

      // 5. Delete client
      const { error } = await supabase.from('clients').delete().eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client deleted permanently' });
      navigate('/clients');
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  if (clientLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!client) {
    return <div className="p-6"><p className="text-muted-foreground">Client not found.</p></div>;
  }

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="p-6 space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground break-words">{client.name}</h1>
            <p className="text-sm text-muted-foreground">Client Details</p>
          </div>
        </div>
        {isCeo && (
          <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="w-full sm:w-auto">
            <Trash2 className="h-4 w-4 mr-2" /> Delete Client
          </Button>
        )}
      </div>

      {/* Client Info Card */}
      <div className="rounded-lg border bg-card p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {client.contact_name && (
          <div className="flex items-start gap-2">
            <span className="text-sm text-muted-foreground">Contact:</span>
            <span className="text-sm font-medium text-foreground">{client.contact_name}</span>
          </div>
        )}
        {client.contact_email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{client.contact_email}</span>
          </div>
        )}
        {client.contact_phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{client.contact_phone}</span>
          </div>
        )}
        {client.country && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{client.country}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{client.billing_currency}</span>
        </div>
        {client.notes && (
          <div className="col-span-full flex items-start gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm text-foreground">{client.notes}</span>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Projects</h2>
        {client.is_active && (
          <Button onClick={() => navigate(`/projects/new?clientId=${id}`)}>
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      {projectsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-1">Create a project for this client</p>
        </div>
      ) : (
        <div className="rounded-[14px] border bg-card overflow-x-auto" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Internal Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p: any) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                  <TableCell className="font-mono text-sm">{p.project_code}</TableCell>
                  <TableCell className="font-medium">{p.project_name}</TableCell>
                  <TableCell>{p.project_categories?.name || '—'}</TableCell>
                  <TableCell>
                    {p.priority && <Badge className={priorityColors[p.priority] || ''}>{fmt(p.priority)}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[p.status] || ''}>{fmt(p.status)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(p.internal_deadline)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={v => { if (!v) { setDeleteOpen(false); setDeleteConfirmText(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client Permanently</DialogTitle>
            <DialogDescription>
              This will permanently delete "{client.name}", all their projects, and all project assignments. This action cannot be undone. Type the client name <strong className="text-foreground">{client.name}</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder={`Type "${client.name}" to confirm`}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); }}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteConfirmText !== client.name || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
