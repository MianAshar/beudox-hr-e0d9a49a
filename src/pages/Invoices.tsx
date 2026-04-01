import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusStyles: Record<string, string> = {
  draft: 'bg-[hsl(var(--bx-warning-bg))] text-[hsl(var(--bx-warning-text))]',
  sent: 'bg-blue-100 text-blue-700',
  partially_paid: 'bg-orange-100 text-orange-700',
  paid: 'bg-[hsl(var(--bx-success-bg))] text-[hsl(var(--bx-success-text))]',
  cancelled: 'bg-[hsl(var(--bx-danger-bg))] text-[hsl(var(--bx-danger-text))]',
};

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const Invoices = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const companyId = employee?.company_id;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', companyId, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*, clients(id, name)')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: clients } = useQuery({
    queryKey: ['clients-list', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const filtered = invoices?.filter(inv => {
    const clientName = (inv.clients as any)?.name || '';
    const matchSearch = !search ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchClient = clientFilter === 'all' || inv.client_id === clientFilter;
    return matchSearch && matchClient;
  }) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
            {invoices ? `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}>
          <Plus className="h-4 w-4 mr-2" /> Create Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice # or client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients?.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
            {search || statusFilter !== 'all' ? 'No matching invoices' : 'No invoices yet'}
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
            {search || statusFilter !== 'all' ? 'Try different filters' : 'Create your first invoice to get started'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow
                  key={inv.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <TableCell className="font-medium font-mono-bx">{inv.invoice_number}</TableCell>
                  <TableCell>{(inv.clients as any)?.name || '—'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{inv.title}</TableCell>
                  <TableCell className="text-right font-mono-bx">
                    {inv.currency} {Number(inv.total_amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono-bx">
                    {inv.currency} {Number(inv.amount_due).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {inv.due_date ? format(new Date(inv.due_date), 'dd MMM yyyy') : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status] || ''}`}>
                      {statusLabel[inv.status] || inv.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(inv.created_at!), 'dd MMM yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Invoices;
