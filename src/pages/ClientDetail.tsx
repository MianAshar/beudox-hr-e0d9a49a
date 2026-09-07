import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Mail, Phone, Globe, DollarSign, StickyNote, Trash2, Pencil, Users, UserCircle, LogOut } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { SubSeriesTagInput } from '@/components/clients/SubSeriesTagInput';

const inviteClientUser = async (
  supabase: any,
  companyId: string,
  clientId: string,
  clientName: string,
  email: string,
  contactName: string | null
) => {
  if (!email || !email.trim()) return;
  try {
    await supabase.functions.invoke('invite-client', {
      body: { clientId, clientName, email: email.trim(), fullName: contactName || '', companyId },
    });
  } catch (e) {
    console.error('Failed to send client invite:', e);
  }
};

const deleteClientUserHelper = async (
  supabase: any,
  clientUserId: string,
  authUserId: string | null,
  companyId: string
) => {
  await supabase.from('client_users').delete().eq('id', clientUserId).eq('company_id', companyId);
  if (authUserId) {
    try {
      await supabase.functions.invoke('delete-client-user', { body: { authUserId } });
    } catch (e) {
      console.error('Failed to delete auth user:', e);
    }
  }
};

const CURRENCIES = ['USD', 'PKR', 'AED', 'GBP', 'EUR', 'AUD', 'CAD'];

const statusColors: Record<string, string> = {
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  invoiced: 'bg-purple-100 text-purple-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};


const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const isCeo = (employee?.roles ?? []).includes('ceo');
  const roles = employee?.roles ?? [];
  const isManager = ['ceo', 'hr_manager'].some(r => roles.includes(r));

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [invitingUser, setInvitingUser] = useState(false);
  const [deletePortalUser, setDeletePortalUser] = useState<{ id: string; authUserId: string | null; email: string } | null>(null);
  const [deletingPortalUser, setDeletingPortalUser] = useState(false);

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

  const { data: portalUsers, refetch: refetchPortalUsers } = useQuery({
    queryKey: ['client-users-detail', id, companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_users')
        .select('id, email, full_name, status, invited_at, auth_user_id')
        .eq('client_id', id!)
        .eq('company_id', companyId!);
      return data || [];
    },
    enabled: !!id && !!companyId && isManager,
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: editForm.name.trim(),
        contact_name: editForm.contact_name?.trim() || null,
        contact_email: editForm.contact_email?.trim() || null,
        contact_phone: editForm.contact_phone?.trim() || null,
        country: editForm.country?.trim() || null,
        billing_currency: editForm.billing_currency,
        notes: editForm.notes?.trim() || null,
        sub_series: editForm.sub_series || [],
      };
      const { error } = await supabase.from('clients').update(payload).eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', id] });
      qc.invalidateQueries({ queryKey: ['clients'] });
      setEditOpen(false);
      toast({ title: 'Client updated' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleInviteUser = async () => {
    if (!newUserEmail.trim() || !id || !client) return;
    setInvitingUser(true);
    await inviteClientUser(supabase, companyId!, id, client.name, newUserEmail.trim(), newUserName.trim() || null);
    setNewUserEmail('');
    setNewUserName('');
    setInvitingUser(false);
    refetchPortalUsers();
    toast({ title: `Invite sent to ${newUserEmail.trim()}` });
  };

  const handleDeletePortalUser = async () => {
    if (!deletePortalUser || !companyId) return;
    setDeletingPortalUser(true);
    await deleteClientUserHelper(supabase, deletePortalUser.id, deletePortalUser.authUserId, companyId);
    setDeletingPortalUser(false);
    setDeletePortalUser(null);
    refetchPortalUsers();
    toast({ title: `Portal user ${deletePortalUser.email} removed` });
  };

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
        {isManager && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setEditForm({
                  name: client.name,
                  contact_name: client.contact_name || '',
                  contact_email: client.contact_email || '',
                  contact_phone: client.contact_phone || '',
                  country: client.country || '',
                  billing_currency: client.billing_currency || 'USD',
                  notes: client.notes || '',
                  sub_series: client.sub_series || [],
                });
                setEditOpen(true);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Client
            </Button>
          </div>
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

      {isManager && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Portal Users</h2>
          </div>
          <p className="text-xs text-muted-foreground">Users who can log in to the Forte Client Portal to view this client's projects.</p>

          {/* Existing users */}
          {portalUsers && portalUsers.length > 0 && (
            <div className="space-y-2">
              {portalUsers.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium truncate">{u.email}</span>
                    {u.full_name && <span className="text-xs text-muted-foreground">({u.full_name})</span>}
                    <Badge className={u.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                      {u.status === 'active' ? 'Active' : 'Invited'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={async () => {
                      await inviteClientUser(supabase, companyId!, id!, client.name, u.email, u.full_name || null);
                      toast({ title: `Invite resent to ${u.email}` });
                    }}
                  >
                    Resend
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new user */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Email address *"
                type="email"
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInviteUser(); } }}
              />
              <Input
                placeholder="Full name (optional)"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInviteUser(); } }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!newUserEmail.trim() || invitingUser}
              onClick={handleInviteUser}
            >
              {invitingUser ? 'Sending invite…' : '+ Add & Invite User'}
            </Button>
          </div>
        </div>
      )}

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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={v => { if (!v) setEditOpen(false); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Company Name *</Label>
                <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name</Label>
                  <Input value={editForm.contact_name} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={editForm.contact_email} onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={editForm.contact_phone} onChange={e => setEditForm({ ...editForm, contact_phone: e.target.value })} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Billing Currency</Label>
                <Select value={editForm.billing_currency} onValueChange={v => setEditForm({ ...editForm, billing_currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sub-Series</Label>
                <SubSeriesTagInput value={editForm.sub_series} onChange={v => setEditForm({ ...editForm, sub_series: v })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => updateMutation.mutate()} disabled={!editForm?.name?.trim() || updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
