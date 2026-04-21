import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableHeader } from '@/components/ui/sortable-header';
import { useSort } from '@/hooks/useSort';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Plus, Search, FileText, Send, Trash2, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const isCeo = (employee?.roles ?? []).includes('ceo');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  // PDF loading per-row
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  // Send modal
  const [sendOpen, setSendOpen] = useState(false);
  const [sendInvoice, setSendInvoice] = useState<any>(null);
  const [sendTo, setSendTo] = useState('');
  const [sendSubject, setSendSubject] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteInvoice, setDeleteInvoice] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', companyId, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*, clients(id, name, contact_name, contact_email)')
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

  const { data: company } = useQuery({
    queryKey: ['company-invoice', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from('companies').select('name').eq('id', companyId!).single();
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

  const { sorted, sort, toggleSort } = useSort(filtered, {
    invoice_number: (i: any) => i.invoice_number,
    client: (i: any) => (i.clients as any)?.name,
    title: (i: any) => i.title,
    total_amount: (i: any) => Number(i.total_amount),
    amount_due: (i: any) => Number(i.amount_due),
    due_date: (i: any) => i.due_date,
    status: (i: any) => i.status,
    created: (i: any) => i.created_at,
  });

  // View PDF handler
  const handleViewPdf = async (inv: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (inv.pdf_url) {
      window.open(inv.pdf_url, '_blank');
      return;
    }
    setPdfLoadingId(inv.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoice_id: inv.id },
      });
      if (error) throw error;
      if (data?.pdf_url) {
        window.open(data.pdf_url, '_blank');
        qc.invalidateQueries({ queryKey: ['invoices'] });
      }
    } catch (err: any) {
      toast.error(err.message || 'PDF generation failed');
    } finally {
      setPdfLoadingId(null);
    }
  };

  // Send handler
  const handleOpenSend = (inv: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const client = inv.clients as any;
    setSendInvoice(inv);
    setSendTo(client?.contact_email || '');
    setSendSubject(inv.title || '');
    setSendMessage(
      `Dear ${client?.contact_name || client?.name || 'Client'},\n\nPlease find attached invoice ${inv.invoice_number} for ${inv.currency} ${Number(inv.total_amount).toLocaleString()}.\n\nThank you for your business.\n\nBest regards,\n${company?.name || ''}`
    );
    setSendOpen(true);
  };

  const handleSend = async () => {
    if (!sendInvoice) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoice_id: sendInvoice.id, to_email: sendTo, subject: sendSubject, message: sendMessage },
      });
      if (error) throw error;
      toast.success('Invoice sent');
      setSendOpen(false);
      qc.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  // Delete handler
  const handleOpenDelete = (inv: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteInvoice(inv);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteInvoice) return;
    setDeleting(true);
    try {
      await supabase.from('invoice_line_items').delete().eq('invoice_id', deleteInvoice.id).eq('company_id', companyId!);
      await supabase.from('invoice_payments').delete().eq('invoice_id', deleteInvoice.id).eq('company_id', companyId!);
      const { error } = await supabase.from('invoices').delete().eq('id', deleteInvoice.id).eq('company_id', companyId!);
      if (error) throw error;
      toast.success('Invoice deleted');
      setDeleteOpen(false);
      qc.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
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
        <TooltipProvider delayDuration={300}>
          <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="invoice_number" sort={sort} onSort={toggleSort}>Invoice #</SortableHeader>
                  <SortableHeader column="client" sort={sort} onSort={toggleSort}>Client</SortableHeader>
                  <SortableHeader column="title" sort={sort} onSort={toggleSort}>Title</SortableHeader>
                  <SortableHeader column="total_amount" sort={sort} onSort={toggleSort} align="right">Total</SortableHeader>
                  <SortableHeader column="amount_due" sort={sort} onSort={toggleSort} align="right">Amount Due</SortableHeader>
                  <SortableHeader column="due_date" sort={sort} onSort={toggleSort}>Due Date</SortableHeader>
                  <SortableHeader column="status" sort={sort} onSort={toggleSort}>Status</SortableHeader>
                  <SortableHeader column="created" sort={sort} onSort={toggleSort}>Created</SortableHeader>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(inv => (
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
                      {inv.due_date ? formatDate(inv.due_date) : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status] || ''}`}>
                        {statusLabel[inv.status] || inv.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(inv.created_at!)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={pdfLoadingId === inv.id}
                              onClick={(e) => handleViewPdf(inv, e)}
                            >
                              {pdfLoadingId === inv.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View PDF</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleOpenSend(inv, e)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send Invoice</TooltipContent>
                        </Tooltip>

                        {isCeo && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={(e) => handleOpenDelete(inv, e)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Invoice</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      )}

      {/* Send Invoice Modal */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>Send this invoice to the client via email</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>To</Label>
              <Input value={sendTo} onChange={e => setSendTo(e.target.value)} />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={sendSubject} onChange={e => setSendSubject(e.target.value)} />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={sendMessage} onChange={e => setSendMessage(e.target.value)} rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>Cancel</Button>
            <Button onClick={handleSend} disabled={sending || !sendTo}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Delete invoice {deleteInvoice?.invoice_number}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
