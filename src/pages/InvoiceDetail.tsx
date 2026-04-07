import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sendNotification, getEmployeeIdsByRole, uniqueRecipients } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft, Send, CreditCard, Pencil, Ban, Loader2, FileText, Trash2,
} from 'lucide-react';
import { format } from 'date-fns';

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

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cash', label: 'Cash' },
  { value: 'wire_transfer', label: 'Wire Transfer' },
  { value: 'other', label: 'Other' },
];

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const isCeo = employee?.role_name === 'ceo';

  // Modals
  const [sendOpen, setSendOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Send form
  const [sendTo, setSendTo] = useState('');
  const [sendSubject, setSendSubject] = useState('');
  const [sendMessage, setSendMessage] = useState('');

  // Payment form
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [payMethod, setPayMethod] = useState('bank_transfer');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const [viewingPdf, setViewingPdf] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice-detail', id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(id, name, contact_name, contact_email, country)')
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const { data: company } = useQuery({
    queryKey: ['company-invoice', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: lineItems } = useQuery({
    queryKey: ['invoice-line-items', id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('invoice_id', id!)
        .eq('company_id', companyId!)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const { data: payments } = useQuery({
    queryKey: ['invoice-payments', id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoice_payments')
        .select('*')
        .eq('invoice_id', id!)
        .eq('company_id', companyId!)
        .order('payment_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const client = invoice?.clients as any;

  // View PDF — generate if needed, then open
  const handleViewPdf = async () => {
    if (invoice?.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
      return;
    }
    setViewingPdf(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoice_id: id },
      });
      if (error) throw error;
      const url = data?.pdf_url;
      if (url) {
        window.open(url, '_blank');
        qc.invalidateQueries({ queryKey: ['invoice-detail'] });
      } else {
        toast.error('No PDF URL returned');
      }
    } catch (err: any) {
      toast.error(err.message || 'PDF generation failed');
    } finally {
      setViewingPdf(false);
    }
  };

  // Send invoice
  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoice_id: id,
          to_email: sendTo,
          subject: sendSubject,
          message: sendMessage,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Invoice sent');
      setSendOpen(false);
      qc.invalidateQueries({ queryKey: ['invoice-detail'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to send'),
  });

  // Record payment
  const paymentMutation = useMutation({
    mutationFn: async () => {
      const amount = Number(payAmount);
      if (!amount || amount <= 0) throw new Error('Invalid amount');

      const { error: insertError } = await supabase
        .from('invoice_payments')
        .insert({
          company_id: companyId!,
          invoice_id: id!,
          amount,
          payment_date: payDate,
          payment_method: payMethod,
          reference_number: payRef.trim() || null,
          notes: payNotes.trim() || null,
          recorded_by: employee?.employee_id || null,
        } as any);
      if (insertError) throw insertError;

      const newPaid = Number(invoice!.amount_paid) + amount;
      const newDue = Math.max(0, Number(invoice!.total_amount) - newPaid);
      let newStatus = invoice!.status;
      if (newDue === 0) newStatus = 'paid';
      else if (newPaid > 0) newStatus = 'partially_paid';

      const { error: updateError } = await supabase
        .from('invoices')
        .update({ amount_paid: newPaid, amount_due: newDue, status: newStatus } as any)
        .eq('id', id!)
        .eq('company_id', companyId!);
      if (updateError) throw updateError;
    },
    onSuccess: async () => {
      // Send invoice_payment_received notification
      if (companyId && invoice) {
        const mgrs = await getEmployeeIdsByRole(companyId, ['finance_manager', 'ceo']);
        if (mgrs.length > 0) {
          sendNotification({
            companyId,
            recipientIds: mgrs,
            type: 'invoice_payment_received',
            title: 'Payment Received',
            message: `A payment of ${invoice.currency} ${Number(payAmount).toLocaleString()} has been recorded for invoice ${invoice.invoice_number}.`,
            referenceType: 'invoice',
            referenceId: id,
          });
        }
      }
      toast.success('Payment recorded');
      setPaymentOpen(false);
      setPayAmount('');
      setPayRef('');
      setPayNotes('');
      qc.invalidateQueries({ queryKey: ['invoice-detail'] });
      qc.invalidateQueries({ queryKey: ['invoice-payments'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to record payment'),
  });

  // Cancel invoice
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'cancelled' } as any)
        .eq('id', id!)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Invoice cancelled');
      setCancelOpen(false);
      qc.invalidateQueries({ queryKey: ['invoice-detail'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to cancel'),
  });

  // Delete invoice
  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Delete line items first
      const { error: liError } = await supabase
        .from('invoice_line_items')
        .delete()
        .eq('invoice_id', id!)
        .eq('company_id', companyId!);
      if (liError) throw liError;

      // Delete payments
      const { error: payError } = await supabase
        .from('invoice_payments')
        .delete()
        .eq('invoice_id', id!)
        .eq('company_id', companyId!);
      if (payError) throw payError;

      // Delete invoice
      const { error: invError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id!)
        .eq('company_id', companyId!);
      if (invError) throw invError;
    },
    onSuccess: () => {
      toast.success('Invoice deleted');
      qc.invalidateQueries({ queryKey: ['invoices'] });
      navigate('/invoices');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete invoice'),
  });

  const openSendModal = () => {
    setSendTo(client?.contact_email || '');
    setSendSubject(invoice?.title || '');
    setSendMessage(
      `Dear ${client?.contact_name || client?.name || 'Client'},\n\nPlease find attached invoice ${invoice?.invoice_number} for ${invoice?.currency} ${Number(invoice?.total_amount).toLocaleString()}.\n\nThank you for your business.\n\nBest regards,\n${company?.name || ''}`
    );
    setSendOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground whitespace-nowrap" style={{ fontFamily: 'var(--ff-display)' }}>
                {invoice.invoice_number}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${statusStyles[invoice.status] || ''}`}>
                {statusLabel[invoice.status] || invoice.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 truncate" style={{ fontFamily: 'var(--ff-body)' }}>
              {client?.name} · {invoice.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {invoice.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/${id}/edit`)}>
              <Pencil className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewPdf}
            disabled={viewingPdf}
          >
            {viewingPdf ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <FileText className="h-4 w-4 mr-1.5" />}
            View PDF
          </Button>
          {invoice.status !== 'cancelled' && (
            <Button variant="outline" size="sm" onClick={openSendModal}>
              <Send className="h-4 w-4 mr-1.5" /> Send
            </Button>
          )}
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <Button size="sm" onClick={() => setPaymentOpen(true)}>
              <CreditCard className="h-4 w-4 mr-1.5" /> Record Payment
            </Button>
          )}
          {isCeo && invoice.status !== 'cancelled' && (
            <Button variant="destructive" size="sm" onClick={() => setCancelOpen(true)}>
              <Ban className="h-4 w-4 mr-1.5" /> Cancel
            </Button>
          )}
          {isCeo && (
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Company + Client info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-[14px] border p-5 bg-card" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">From</h3>
          {company?.logo_url && (
            <img src={company.logo_url} alt={company.name} className="max-h-[60px] w-auto mb-3" />
          )}
          <p className="font-semibold text-foreground">{company?.name}</p>
          {company?.address && <p className="text-sm text-muted-foreground">{company.address}</p>}
          {(company?.city || company?.country) && (
            <p className="text-sm text-muted-foreground">{[company?.city, company?.country].filter(Boolean).join(', ')}</p>
          )}
        </div>
        <div className="rounded-[14px] border p-5 bg-card" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Bill To</h3>
          <p className="font-semibold text-foreground">{client?.name}</p>
          {client?.contact_name && <p className="text-sm text-muted-foreground">{client.contact_name}</p>}
          {client?.contact_email && <p className="text-sm text-muted-foreground">{client.contact_email}</p>}
          {client?.country && <p className="text-sm text-muted-foreground">{client.country}</p>}
        </div>
      </div>

      {/* Invoice details row */}
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground text-xs uppercase tracking-wider">Invoice Date</span>
          <p className="font-medium mt-1">{format(new Date(invoice.created_at!), 'dd MMM yyyy')}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs uppercase tracking-wider">Due Date</span>
          <p className="font-medium mt-1">{invoice.due_date ? format(new Date(invoice.due_date), 'dd MMM yyyy') : '—'}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs uppercase tracking-wider">Currency</span>
          <p className="font-medium mt-1">{invoice.currency}</p>
        </div>
        {invoice.sent_at && (
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Sent</span>
            <p className="font-medium mt-1">{format(new Date(invoice.sent_at), 'dd MMM yyyy')}</p>
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
              <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
              <th className="text-center p-4 font-medium text-muted-foreground w-20">Qty</th>
              <th className="text-right p-4 font-medium text-muted-foreground w-32">Unit Price</th>
              <th className="text-right p-4 font-medium text-muted-foreground w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems?.map(item => (
              <tr key={item.id} className="border-b last:border-0" style={{ borderColor: 'hsl(var(--border))' }}>
                <td className="p-4">{item.description}</td>
                <td className="p-4 text-center">{Number(item.quantity)}</td>
                <td className="p-4 text-right font-mono-bx">{Number(item.unit_price).toLocaleString()}</td>
                <td className="p-4 text-right font-mono-bx">{Number(item.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t p-4 space-y-1 max-w-xs ml-auto" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono-bx">{invoice.currency} {Number(invoice.subtotal).toLocaleString()}</span>
          </div>
          {Number(invoice.discount_amount) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-mono-bx text-destructive">-{invoice.currency} {Number(invoice.discount_amount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <span>Total</span>
            <span className="font-mono-bx">{invoice.currency} {Number(invoice.total_amount).toLocaleString()}</span>
          </div>
          {Number(invoice.amount_paid) > 0 && (
            <>
              <div className="flex justify-between text-sm text-[hsl(var(--bx-success))]">
                <span>Paid</span>
                <span className="font-mono-bx">{invoice.currency} {Number(invoice.amount_paid).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Amount Due</span>
                <span className="font-mono-bx">{invoice.currency} {Number(invoice.amount_due).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bank Details */}
      {company && (company.bank_name || company.bank_iban) && (
        <div className="rounded-[14px] border p-5 bg-card" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Bank Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {company.bank_name && (
              <div>
                <span className="text-muted-foreground">Bank</span>
                <p className="font-medium">{company.bank_name}</p>
              </div>
            )}
            {company.bank_account_title && (
              <div>
                <span className="text-muted-foreground">Account Title</span>
                <p className="font-medium">{company.bank_account_title}</p>
              </div>
            )}
            {company.bank_account_number && (
              <div>
                <span className="text-muted-foreground">Account Number</span>
                <p className="font-medium font-mono-bx">{company.bank_account_number}</p>
              </div>
            )}
            {company.bank_iban && (
              <div>
                <span className="text-muted-foreground">IBAN</span>
                <p className="font-medium font-mono-bx">{company.bank_iban}</p>
              </div>
            )}
            {company.bank_swift && (
              <div>
                <span className="text-muted-foreground">SWIFT</span>
                <p className="font-medium font-mono-bx">{company.bank_swift}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments && payments.length > 0 && (
        <div className="rounded-[14px] border p-5 bg-card" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Payment History</h3>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'hsl(var(--border))' }}>
                <div>
                  <p className="text-sm font-medium">{format(new Date(p.payment_date), 'dd MMM yyyy')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{p.payment_method.replace('_', ' ')}</p>
                  {p.reference_number && <p className="text-xs text-muted-foreground">Ref: {p.reference_number}</p>}
                </div>
                <p className="font-mono-bx font-medium text-[hsl(var(--bx-success))]">
                  +{invoice.currency} {Number(p.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
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
            <Button onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending || !sendTo}>
              {sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Outstanding: {invoice.currency} {Number(invoice.amount_due).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="font-mono-bx"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Payment Date *</Label>
              <Input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reference Number</Label>
              <Input value={payRef} onChange={e => setPayRef(e.target.value)} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button onClick={() => paymentMutation.mutate()} disabled={paymentMutation.isPending || !payAmount || !payDate}>
              {paymentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel invoice {invoice.invoice_number}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep Invoice</Button>
            <Button variant="destructive" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Delete invoice {invoice.invoice_number}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceDetail;
