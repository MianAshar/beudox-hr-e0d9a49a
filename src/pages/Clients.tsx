import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Search, Pencil, XCircle, Building2, RotateCcw } from 'lucide-react';
import { SubSeriesTagInput } from '@/components/clients/SubSeriesTagInput';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ActivityCategory,
  ACTIVITY_LABELS,
  ACTIVITY_STYLES,
  ACTIVITY_DESCRIPTIONS,
  getActivityCategory,
  ProjectActivityInfo,
} from '@/lib/client-activity';

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
  sub_series: string[] | null;
}

const CURRENCIES = ['USD', 'PKR', 'AED', 'GBP', 'EUR', 'AUD', 'CAD'];

const emptyForm = {
  name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  country: '',
  billing_currency: 'USD',
  notes: '',
  sub_series: [] as string[],
};

const Clients = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showInactive, setShowInactive] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Client | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | ActivityCategory>('all');

  const companyId = employee?.company_id;
  const roles = employee?.roles ?? [];
  const showActivity = ['ceo', 'hr_manager'].some(r => roles.includes(r));

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', companyId, showInactive],
    queryFn: async () => {
      let query = supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId!)
        .order('name');
      if (!showInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!companyId,
  });

  // Fetch projects for activity categorisation (only if user can see activity)
  const { data: projects } = useQuery({
    queryKey: ['client-projects-activity', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('client_id, status, updated_at, created_at')
        .eq('company_id', companyId!);
      if (error) throw error;
      return data as Array<ProjectActivityInfo & { client_id: string }>;
    },
    enabled: !!companyId && showActivity,
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
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        country: form.country.trim() || null,
        billing_currency: form.billing_currency,
        notes: form.notes.trim() || null,
        company_id: companyId!,
      };
      if (editingId) {
        const { error } = await supabase.from('clients').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: editingId ? 'Client updated' : 'Client added' });
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
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const openEdit = (c: Client) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      contact_name: c.contact_name || '',
      contact_email: c.contact_email || '',
      contact_phone: c.contact_phone || '',
      country: c.country || '',
      billing_currency: c.billing_currency,
      notes: c.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Company name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    saveMutation.mutate();
  };

  const filtered = (clients ?? []).filter(c => {
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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {clients ? `${clients.length} client${clients.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive_2m">Inactive 2M</SelectItem>
              <SelectItem value="inactive_4m">Inactive 4M</SelectItem>
              <SelectItem value="inactive_6m">Inactive 6M+</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-2">
          <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
          <Label htmlFor="show-inactive" className="text-sm text-muted-foreground cursor-pointer">Show inactive</Label>
        </div>
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
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/clients/${c.id}`)}
                        className="text-primary hover:underline font-medium"
                      >
                        {c.name}
                      </button>
                      {!c.is_active && <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>}
                    </TableCell>
                    {showActivity && (
                      <TableCell>
                        {cat && styles && (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: styles.bg, color: styles.text }}
                          >
                            {ACTIVITY_LABELS[cat]}
                          </span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{c.contact_name || '—'}</TableCell>
                    <TableCell>{c.contact_email || '—'}</TableCell>
                    <TableCell>{c.country || '—'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {c.is_active ? (
                        <Button variant="ghost" size="icon" onClick={() => setDeactivateTarget(c)}>
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => reactivateMutation.mutate(c.id)}>
                          <RotateCcw className="h-4 w-4 text-primary" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={v => { if (!v) closeModal(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Client' : 'Add Client'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Company Name *</Label>
              <Input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({}); }} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Name</Label>
                <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Phone</Label>
                <Input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Billing Currency</Label>
              <Select value={form.billing_currency} onValueChange={v => setForm({ ...form, billing_currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
