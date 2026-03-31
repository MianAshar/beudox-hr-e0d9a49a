import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, XCircle, Building2 } from 'lucide-react';

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
}

const CURRENCIES = ['USD', 'PKR', 'AED', 'GBP', 'EUR'];

const emptyForm = {
  name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  country: '',
  billing_currency: 'USD',
  notes: '',
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

  const companyId = employee?.company_id;

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!companyId,
  });

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

  const filtered = clients?.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clients ? `${clients.length} active client${clients.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
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
          <p className="text-lg font-medium">{search ? 'No matching clients' : 'No clients yet'}</p>
          <p className="text-sm mt-1">{search ? 'Try a different search term' : 'Add your first client to get started'}</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
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
                  <TableCell>{c.contact_email || '—'}</TableCell>
                  <TableCell>{c.country || '—'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deactivateMutation.mutate(c.id)}>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
