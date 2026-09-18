import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableHeader } from '@/components/ui/sortable-header';
import { useSort } from '@/hooks/useSort';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Country, State } from 'country-state-city';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Plus, Search, XCircle, Building2, RotateCcw, Users, Check, ChevronsUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ActivityCategory,
  ACTIVITY_LABELS,
  ACTIVITY_STYLES,
  ACTIVITY_DESCRIPTIONS,
  getActivityCategory,
  ProjectActivityInfo,
} from '@/lib/client-activity';

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
      body: {
        clientId,
        clientName,
        email: email.trim(),
        fullName: contactName || '',
        companyId,
      },
    });
  } catch (e) {
    console.error('Failed to send client invite:', e);
    // Non-blocking — don't throw
  }
};

const deleteClientUser = async (
  supabase: any,
  clientUserId: string,
  authUserId: string | null,
  companyId: string
) => {
  // Delete from client_users table
  await supabase
    .from('client_users')
    .delete()
    .eq('id', clientUserId)
    .eq('company_id', companyId);

  // Delete auth user via Edge Function (requires service role)
  if (authUserId) {
    try {
      await supabase.functions.invoke('delete-client-user', {
        body: { authUserId },
      });
    } catch (e) {
      console.error('Failed to delete auth user:', e);
      // Non-blocking
    }
  }
};

interface Client {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  country: string | null;
  billing_currency: string;
  notes: string | null;
  is_active: boolean;
  scope: string | null;
  client_requirements: string | null;
  category_id: string | null;
}

const CURRENCIES = ['USD', 'PKR', 'AED', 'GBP', 'EUR', 'AUD', 'CAD'];

const SOURCE_OPTIONS = ['Direct', 'Referral', 'LinkedIn', 'Cold Outreach', 'Website', 'Exhibition', 'Other'];

const emptyForm = {
  name: '',
  contact_name: '',
  contact_designation: '',
  contact_email: '',
  contact_phone: '',
  country: '',
  state: '',
  billing_currency: 'USD',
  source: '',
  nature_of_business: '',
  onboarding_date: '',
  notes: '',
  scope: '',
  client_requirements: '',
  category_id: '',
};

const Clients = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deactivateTarget, setDeactivateTarget] = useState<Client | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | ActivityCategory>('all');
  const [clientTab, setClientTab] = useState<'active' | 'past'>('active');
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<{ id: string; authUserId: string | null; email: string } | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const companyId = employee?.company_id;
  const roles = employee?.roles ?? [];
  const showActivity = ['ceo', 'hr_manager'].some(r => roles.includes(r));

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*, client_categories(id, name, code)')
        .eq('company_id', companyId!)
        .order('name');
      if (error) throw error;
      return data as unknown as Client[];
    },
    enabled: !!companyId,
  });

  const { data: clientCategories } = useQuery({
    queryKey: ['client-categories', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_categories')
        .select('id, name, code')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('display_order')
        .order('name');
      return data || [];
    },
    enabled: !!companyId,
  });

  // Fetch projects for activity categorisation (only if user can see activity)
  const { data: projects } = useQuery({
    queryKey: ['client-projects-activity', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('client_id, status, client_deadline, internal_deadline, created_at')
        .eq('company_id', companyId!)
        .eq('is_active', true);
      if (error) throw error;
      return data as Array<ProjectActivityInfo & { client_id: string }>;
    },
    enabled: !!companyId && showActivity,
  });

  // Client portal users for expanded client row
  const { data: clientPortalUsers } = useQuery({
    queryKey: ['client-users', expandedClientId, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_users')
        .select('id, email, full_name, status, invited_at, auth_user_id')
        .eq('client_id', expandedClientId)
        .eq('company_id', companyId!);
      if (error) throw error;
      return data || [];
    },
    enabled: !!expandedClientId && !!companyId,
  });


  // Per-client activity map

  const activityByClient = useMemo(() => {
    const map = new Map<string, ActivityCategory>();
    if (!showActivity || !clients) return map;
    const grouped = new Map<string, ProjectActivityInfo[]>();
    (projects || []).forEach(p => {
      if (!grouped.has(p.client_id)) grouped.set(p.client_id, []);
      grouped.get(p.client_id)!.push(p);
    });
    clients.forEach(c => {
      map.set(c.id, getActivityCategory(grouped.get(c.id) || []));
    });
    return map;
  }, [clients, projects, showActivity]);

  const activeClients = (clients ?? []).filter(c => c.is_active !== false);
  const pastClients = (clients ?? []).filter(c => c.is_active === false);

  // Activity counts for summary cards (only active clients counted)
  const activityCounts = useMemo(() => {
    const counts: Record<ActivityCategory, number> = {
      active: 0, inactive_2m: 0, inactive_4m: 0, inactive_6m: 0,
    };
    if (!showActivity || !clients) return counts;
    clients.forEach(c => {
      if (!c.is_active) return;
      const cat = activityByClient.get(c.id);
      if (cat) counts[cat]++;
    });
    return counts;
  }, [clients, activityByClient, showActivity]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        contact_name: form.contact_name.trim() || null,
        contact_designation: form.contact_designation.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        country: form.country.trim() || null,
        state: form.state.trim() || null,
        billing_currency: form.billing_currency,
        source: form.source || null,
        nature_of_business: form.nature_of_business.trim() || null,
        onboarding_date: form.onboarding_date || null,
        notes: form.notes.trim() || null,
        scope: form.scope.trim() || null,
        client_requirements: form.client_requirements.trim() || null,
        category_id: form.category_id || null,
        company_id: companyId!,
      };
      const { error } = await supabase.from('clients').insert(payload).select().single();
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client added' });
      closeModal();
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client deactivated' });
      setDeactivateTarget(null);
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').update({ is_active: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client reactivated' });
    },
  });

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setErrors({});
  };


  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Company name is required';
    if (!form.category_id) errs.category_id = 'Category is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    saveMutation.mutate();
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId || !companyId) return;
    setDeletingUser(true);
    await deleteClientUser(supabase, deleteUserId.id, deleteUserId.authUserId, companyId);
    setDeletingUser(false);
    setDeleteUserId(null);
    qc.invalidateQueries({ queryKey: ['client-users', expandedClientId, companyId] });
    toast({ title: `Portal user ${deleteUserId.email} removed` });
  };

  const filtered = activeClients.filter(c => {

    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (showActivity && activityFilter !== 'all') {
      if (activityByClient.get(c.id) !== activityFilter) return false;
    }
    return true;
  });

  const { sorted, sort, toggleSort } = useSort(filtered, {
    name: (c: Client) => c.name,
    activity: (c: Client) => activityByClient.get(c.id) || '',
    contact_name: (c: Client) => c.contact_name,
    contact_email: (c: Client) => c.contact_email,
    country: (c: Client) => c.country,
  });

  const SummaryCard = ({ category, count }: { category: ActivityCategory; count: number }) => {
    const isActive = activityFilter === category;
    const styles = ACTIVITY_STYLES[category];
    return (
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setActivityFilter(isActive ? 'all' : category)}
            className="rounded-[14px] bg-card text-left transition-all hover:shadow-sm"
            style={{
              border: isActive ? `1.5px solid ${styles.text}` : '1px solid rgba(91,63,248,0.15)',
              padding: '12px 16px',
              maxHeight: 80,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {ACTIVITY_LABELS[category]}
                </p>
                <p className="text-[18px] font-semibold mt-0.5" style={{ fontFamily: 'Outfit, sans-serif', color: '#120E36' }}>
                  {count}
                </p>
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: styles.text }}
                aria-hidden
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className="border-0 text-white"
          style={{
            backgroundColor: '#1A1240',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 12,
            lineHeight: 1.4,
            padding: 8,
            borderRadius: 8,
            maxWidth: 200,
          }}
        >
          {ACTIVITY_DESCRIPTIONS[category]}
        </TooltipContent>
      </Tooltip>
    );
  };

  const tabTriggerClass = 'rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0';

  const activeContent = (
    <div className="space-y-6">
      {/* Activity Summary Cards (CEO + HR only) */}
      {showActivity && (
        <TooltipProvider delayDuration={150}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard category="active" count={activityCounts.active} />
            <SummaryCard category="inactive_2m" count={activityCounts.inactive_2m} />
            <SummaryCard category="inactive_4m" count={activityCounts.inactive_4m} />
            <SummaryCard category="inactive_6m" count={activityCounts.inactive_6m} />
          </div>
        </TooltipProvider>
      )}

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-sm sm:flex-1 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {showActivity && (
          <Select value={activityFilter} onValueChange={v => setActivityFilter(v as 'all' | ActivityCategory)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="active">{ACTIVITY_LABELS.active}</SelectItem>
              <SelectItem value="inactive_2m">{ACTIVITY_LABELS.inactive_2m}</SelectItem>
              <SelectItem value="inactive_4m">{ACTIVITY_LABELS.inactive_4m}</SelectItem>
              <SelectItem value="inactive_6m">{ACTIVITY_LABELS.inactive_6m}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">{search || activityFilter !== 'all' ? 'No matching clients' : 'No clients yet'}</p>
          <p className="text-sm mt-1">{search || activityFilter !== 'all' ? 'Try a different search or filter' : 'Add your first client to get started'}</p>
        </div>
      ) : (
        <div className="rounded-[14px] border bg-card overflow-x-auto" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <SortableHeader column="name" sort={sort} onSort={toggleSort}>Client Name</SortableHeader>
                <TableHead>Category</TableHead>
                {showActivity && <SortableHeader column="activity" sort={sort} onSort={toggleSort}>Activity</SortableHeader>}
                <SortableHeader column="contact_name" sort={sort} onSort={toggleSort}>Contact Name</SortableHeader>
                <SortableHeader column="contact_email" sort={sort} onSort={toggleSort}>Contact Email</SortableHeader>
                <SortableHeader column="country" sort={sort} onSort={toggleSort}>Country</SortableHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(c => {
                const cat = activityByClient.get(c.id);
                const styles = cat ? ACTIVITY_STYLES[cat] : null;
                const isExpanded = expandedClientId === c.id;
                const colSpan = showActivity ? 7 : 6;
                return (
                  <>
                    <TableRow key={c.id}>
                      <TableCell>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => navigate(`/clients/${c.id}`)}
                          className="text-primary hover:underline font-medium"
                        >
                          {c.name}
                        </button>
                      </div>
                      </TableCell>
                      <TableCell>
                        {(c as any).client_categories ? (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-violet-50 text-violet-700">
                            {(c as any).client_categories.code}
                          </span>
                        ) : '—'}
                      </TableCell>
                      {showActivity && (
                        <TableCell>
                          {cat && styles && (
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-default"
                                    style={{ backgroundColor: styles.bg, color: styles.text }}
                                  >
                                    {ACTIVITY_LABELS[cat]}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  sideOffset={8}
                                  className="border-0 text-white"
                                  style={{
                                    backgroundColor: '#1A1240',
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: 12,
                                    lineHeight: 1.4,
                                    padding: 8,
                                    borderRadius: 8,
                                    maxWidth: 240,
                                  }}
                                >
                                  {ACTIVITY_DESCRIPTIONS[cat]}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                      )}
                      <TableCell>{c.contact_name || '—'}</TableCell>
                      <TableCell>{c.contact_email || '—'}</TableCell>
                      <TableCell>{c.country || '—'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setExpandedClientId(isExpanded ? null : c.id)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeactivateTarget(c)}>
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={colSpan}>
                          <div className="py-3 px-1">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              Client Portal Users
                            </h4>
                            {clientPortalUsers && clientPortalUsers.length > 0 ? (
                              <div className="space-y-2">
                                {clientPortalUsers.map((u: any) => (
                                  <div key={u.id} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <span className="text-sm font-medium truncate">{u.email}</span>
                                      {u.full_name && <span className="text-xs text-muted-foreground truncate">{u.full_name}</span>}
                                      <Badge className={u.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100 shrink-0' : 'bg-amber-100 text-amber-700 hover:bg-amber-100 shrink-0'}>
                                        {u.status === 'active' ? 'Active' : 'Invited'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                          await inviteClientUser(supabase, companyId!, c.id, c.name, u.email, u.full_name || null);
                                          toast({ title: `Invite resent to ${u.email}` });
                                        }}
                                      >
                                        Resend Invite
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => setDeleteUserId({ id: u.id, authUserId: u.auth_user_id ?? null, email: u.email })}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No portal users invited yet.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const pastContent = isLoading ? (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  ) : pastClients.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Building2 className="h-12 w-12 mb-4 opacity-40" />
      <p className="text-lg font-medium">No past clients</p>
      <p className="text-sm mt-1">Deactivated clients will appear here.</p>
    </div>
  ) : (
    <div className="rounded-[14px] border bg-card overflow-x-auto" style={{ borderColor: 'hsl(var(--border))' }}>
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastClients.map(c => (
            <TableRow key={c.id}>
              <TableCell>
                <button
                  onClick={() => navigate(`/clients/${c.id}`)}
                  className="text-primary hover:underline font-medium"
                >
                  {c.name}
                </button>
              </TableCell>
              <TableCell>{c.contact_name || '—'}</TableCell>
              <TableCell>{c.country || '—'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(c.id)}>
                  <RotateCcw className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {clients ? `${activeClients.length} client${activeClients.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true); }} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

      {showActivity ? (
        <Tabs value={clientTab} onValueChange={v => setClientTab(v as 'active' | 'past')} className="space-y-6">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto overflow-x-auto">
            <TabsTrigger value="active" className={tabTriggerClass}>Active Clients ({activeClients.length})</TabsTrigger>
            <TabsTrigger value="past" className={tabTriggerClass}>Past Clients ({pastClients.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-0">{activeContent}</TabsContent>
          <TabsContent value="past" className="mt-0">{pastContent}</TabsContent>
        </Tabs>
      ) : (
        activeContent
      )}


      {/* Deactivate Confirmation */}
      <Dialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Client</DialogTitle>
            <DialogDescription>
              Deactivate "{deactivateTarget?.name}"? Their projects will remain but no new projects can be added to this client.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deactivateMutation.mutate(deactivateTarget!.id)} disabled={deactivateMutation.isPending}>
              {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Sheet */}
      <Sheet open={modalOpen} onOpenChange={v => { if (!v) closeModal(); }}>
        <SheetContent className="w-full sm:max-w-[648px] overflow-y-auto flex flex-col">
          <SheetHeader className="shrink-0 px-6">
            <SheetTitle>Add Client</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-6 px-6">

            {/* Section: Company Info */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#5B3FF8' }}>Company Info</p>
              <div>
                <Label>Company Name *</Label>
                <Input className="bg-white" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({}); }} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category *</Label>
                  <Select value={form.category_id} onValueChange={v => { setForm({ ...form, category_id: v }); setErrors({}); }}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {(clientCategories || []).map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name} ({cat.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && <p className="text-sm text-destructive mt-1">{errors.category_id}</p>}
                </div>
                <div>
                  <Label>Source</Label>
                  <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
                    <SelectTrigger><SelectValue placeholder="How did they find us?" /></SelectTrigger>
                    <SelectContent>
                      {SOURCE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Onboarding Date</Label>
                <Input className="bg-white" type="date" value={form.onboarding_date} onChange={e => setForm({ ...form, onboarding_date: e.target.value })} />
              </div>
              <div>
                <Label>Nature of Business</Label>
                <Input className="bg-white" value={form.nature_of_business} onChange={e => setForm({ ...form, nature_of_business: e.target.value })} placeholder="e.g. Construction Estimating, Architecture, MEP" />
              </div>
            </div>

            {/* Section: Contact Details */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#5B3FF8' }}>Contact Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact Name</Label>
                  <Input className="bg-white" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input className="bg-white" value={form.contact_designation} onChange={e => setForm({ ...form, contact_designation: e.target.value })} placeholder="e.g. Project Manager" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact Email</Label>
                  <Input className="bg-white" type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input className="bg-white" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Section: Location & Billing */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#5B3FF8' }}>Location & Billing</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Country</Label>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between bg-white font-normal">
                        {form.country || <span className="text-muted-foreground">Select country…</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command>
                        <CommandInput placeholder="Search country…" />
                        <CommandList className="max-h-[200px]">
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {Country.getAllCountries().map(c => (
                              <CommandItem
                                key={c.isoCode}
                                value={c.name}
                                onSelect={val => {
                                  setForm({ ...form, country: val, state: '' });
                                  setCountryOpen(false);
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', form.country === c.name ? 'opacity-100' : 'opacity-0')} />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>State / Province</Label>
                  {(() => {
                    const isoCode = Country.getAllCountries().find(c => c.name === form.country)?.isoCode;
                    const stateList = isoCode ? State.getStatesOfCountry(isoCode) : [];
                    return (
                      <Popover open={stateOpen} onOpenChange={setStateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!form.country}
                            className="w-full justify-between bg-white font-normal"
                          >
                            {form.state || <span className="text-muted-foreground">{form.country ? 'Select state…' : 'Select country first'}</span>}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                          <Command>
                            <CommandInput placeholder="Search state…" />
                            <CommandList className="max-h-[200px]">
                              <CommandEmpty>No state found.</CommandEmpty>
                              <CommandGroup>
                                {stateList.length === 0
                                  ? <CommandItem disabled value="_none">No states available</CommandItem>
                                  : stateList.map(s => (
                                    <CommandItem
                                      key={s.isoCode}
                                      value={s.name}
                                      onSelect={val => {
                                        setForm({ ...form, state: val });
                                        setStateOpen(false);
                                      }}
                                    >
                                      <Check className={cn('mr-2 h-4 w-4', form.state === s.name ? 'opacity-100' : 'opacity-0')} />
                                      {s.name}
                                    </CommandItem>
                                  ))
                                }
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </div>
              </div>
              <div>
                <Label>Billing Currency</Label>
                <Select value={form.billing_currency} onValueChange={v => setForm({ ...form, billing_currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Section: Requirements */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#5B3FF8' }}>Requirements</p>
              <div>
                <Label>Scope</Label>
                <p className="text-xs text-muted-foreground mb-1">High-level description of work. Will auto-populate on new projects.</p>
                <Textarea className="bg-white" value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>Client Requirements</Label>
                <Textarea className="bg-white" value={form.client_requirements} onChange={e => setForm({ ...form, client_requirements: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea className="bg-white" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
              </div>
            </div>

          </div>

          <SheetFooter className="shrink-0 pt-4 border-t gap-2 px-6">
            <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1">
              {saveMutation.isPending ? 'Saving…' : 'Save Client'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Remove Portal User Confirmation */}
      <Dialog open={!!deleteUserId} onOpenChange={v => { if (!v) setDeleteUserId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Portal User</DialogTitle>
            <DialogDescription>
              Remove <strong>{deleteUserId?.email}</strong> from the client portal? They will lose access immediately and their account will be deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>Cancel</Button>
            <Button variant="destructive" disabled={deletingUser} onClick={handleDeleteUser}>
              {deletingUser ? 'Removing…' : 'Remove User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
