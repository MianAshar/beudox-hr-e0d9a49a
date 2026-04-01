import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface CustomLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  project_id: string | null;
}

const InvoiceForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  // Form state
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [projectFees, setProjectFees] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<CustomLineItem[]>([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch company for invoice prefix
  const { data: company } = useQuery({
    queryKey: ['company-detail', companyId],
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

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients-active', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, contact_name, contact_email, country, billing_currency')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  // Fetch projects for selected client
  const { data: clientProjects } = useQuery({
    queryKey: ['client-projects', companyId, clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_code, project_name, fee, status')
        .eq('company_id', companyId!)
        .eq('client_id', clientId)
        .neq('status', 'cancelled')
        .eq('is_active', true)
        .order('project_code');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && !!clientId,
  });

  // Fetch existing invoice count for auto-numbering
  const { data: invoiceCount } = useQuery({
    queryKey: ['invoice-count', companyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId!);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!companyId && !isEdit,
  });

  // Load existing invoice for edit
  const { data: existingInvoice, isLoading: loadingInvoice } = useQuery({
    queryKey: ['invoice-edit', id, companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const { data: existingLineItems } = useQuery({
    queryKey: ['invoice-line-items-edit', id, companyId],
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

  // Auto-generate invoice number
  useEffect(() => {
    if (!isEdit && company && invoiceCount !== undefined) {
      const prefix = company.invoice_prefix || 'INV';
      const year = new Date().getFullYear();
      const seq = String(invoiceCount + 1).padStart(3, '0');
      setInvoiceNumber(`${prefix}-INV-${year}-${seq}`);
    }
  }, [company, invoiceCount, isEdit]);

  // Auto-fill title when client changes
  useEffect(() => {
    if (!isEdit && clientId) {
      const now = new Date();
      const monthYear = format(now, 'MMMM yyyy');
      setTitle(`Invoice — ${monthYear} Estimation Services`);
    }
  }, [clientId, isEdit]);

  // Load existing data for edit
  useEffect(() => {
    if (existingInvoice) {
      setClientId(existingInvoice.client_id);
      setInvoiceNumber(existingInvoice.invoice_number);
      setTitle(existingInvoice.title);
      setDueDate(existingInvoice.due_date || '');
      setNotes(existingInvoice.notes || '');
      setDiscount(Number(existingInvoice.discount_amount) || 0);
    }
  }, [existingInvoice]);

  useEffect(() => {
    if (existingLineItems) {
      const projectItems: string[] = [];
      const fees: Record<string, number> = {};
      const custom: CustomLineItem[] = [];

      existingLineItems.forEach(item => {
        if (item.project_id) {
          projectItems.push(item.project_id);
          fees[item.project_id] = Number(item.amount);
        } else {
          custom.push({
            id: item.id,
            description: item.description,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            project_id: null,
          });
        }
      });

      setSelectedProjectIds(projectItems);
      setProjectFees(fees);
      setCustomItems(custom);
    }
  }, [existingLineItems]);

  const selectedClient = clients?.find(c => c.id === clientId);
  const currency = selectedClient?.billing_currency || 'USD';

  const subtotal = useMemo(() => {
    const projectTotal = selectedProjectIds.reduce((sum, pid) => {
      return sum + (projectFees[pid] ?? clientProjects?.find(p => p.id === pid)?.fee ?? 0);
    }, 0);
    const customTotal = customItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    return projectTotal + customTotal;
  }, [selectedProjectIds, projectFees, clientProjects, customItems]);

  const total = Math.max(0, subtotal - discount);

  const toggleProject = (projectId: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const addCustomItem = () => {
    setCustomItems(prev => [...prev, {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unit_price: 0,
      project_id: null,
    }]);
  };

  const updateCustomItem = (itemId: string, field: string, value: string | number) => {
    setCustomItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeCustomItem = (itemId: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== itemId));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!clientId) errs.clientId = 'Client is required';
    if (!invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number is required';
    if (!title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    if (selectedProjectIds.length === 0 && customItems.length === 0) {
      toast.error('Add at least one line item');
      return false;
    }
    for (const item of customItems) {
      if (!item.description.trim()) {
        toast.error('All custom items need a description');
        return false;
      }
    }
    return true;
  };

  const handleSave = async (generatePdf = false) => {
    setSaving(true);
    try {
      const invoicePayload = {
        company_id: companyId!,
        client_id: clientId,
        invoice_number: invoiceNumber.trim(),
        title: title.trim(),
        currency,
        subtotal,
        discount_amount: discount,
        total_amount: total,
        amount_due: isEdit ? total - Number(existingInvoice?.amount_paid || 0) : total,
        amount_paid: isEdit ? Number(existingInvoice?.amount_paid || 0) : 0,
        due_date: dueDate || null,
        notes: notes.trim() || null,
        status: 'draft' as const,
        generated_by: employee?.employee_id || null,
      };

      let invoiceId: string;

      if (isEdit) {
        const { error } = await supabase
          .from('invoices')
          .update(invoicePayload as any)
          .eq('id', id!)
          .eq('company_id', companyId!);
        if (error) throw error;
        invoiceId = id!;

        // Delete old line items
        await supabase
          .from('invoice_line_items')
          .delete()
          .eq('invoice_id', id!)
          .eq('company_id', companyId!);
      } else {
        const { data, error } = await supabase
          .from('invoices')
          .insert(invoicePayload as any)
          .select('id')
          .single();
        if (error) throw error;
        invoiceId = data.id;
      }

      // Insert line items
      const lineItems: any[] = [];
      let order = 0;

      for (const pid of selectedProjectIds) {
        const project = clientProjects?.find(p => p.id === pid);
        if (!project) continue;
        const fee = projectFees[pid] ?? Number(project.fee) ?? 0;
        lineItems.push({
          company_id: companyId!,
          invoice_id: invoiceId,
          project_id: pid,
          description: `${project.project_code} — ${project.project_name}`,
          quantity: 1,
          unit_price: fee,
          amount: fee,
          display_order: order++,
        });
      }

      for (const item of customItems) {
        lineItems.push({
          company_id: companyId!,
          invoice_id: invoiceId,
          project_id: null,
          description: item.description.trim(),
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.quantity * item.unit_price,
          display_order: order++,
        });
      }

      if (lineItems.length > 0) {
        const { error: liError } = await supabase
          .from('invoice_line_items')
          .insert(lineItems);
        if (liError) throw liError;
      }

      if (generatePdf) {
        try {
          const { error: pdfError } = await supabase.functions.invoke('generate-invoice-pdf', {
            body: { invoice_id: invoiceId },
          });
          if (pdfError) console.error('PDF generation failed:', pdfError);
        } catch {
          console.error('PDF generation failed');
        }
      }

      toast.success(isEdit ? 'Invoice updated' : 'Invoice created');
      navigate(`/invoices/${invoiceId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loadingInvoice) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(isEdit ? `/invoices/${id}` : '/invoices')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
            {isEdit ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            Step {step} of 3
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      {/* Step 1: Invoice Details */}
      {step === 1 && (
        <div className="rounded-[14px] border p-6 bg-card space-y-5" style={{ borderColor: 'hsl(var(--border))' }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>Invoice Details</h2>

          <div>
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-destructive mt-1">{errors.clientId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number *</Label>
              <Input
                value={invoiceNumber}
                onChange={e => { setInvoiceNumber(e.target.value); setErrors({}); }}
                className="font-mono-bx"
              />
              {errors.invoiceNumber && <p className="text-sm text-destructive mt-1">{errors.invoiceNumber}</p>}
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors({}); }}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label>Notes (internal only)</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes — not shown on PDF"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
            >
              Next: Line Items
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Line Items */}
      {step === 2 && (
        <div className="rounded-[14px] border p-6 bg-card space-y-5" style={{ borderColor: 'hsl(var(--border))' }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>
            Line Items
          </h2>

          {/* Projects checklist */}
          {clientProjects && clientProjects.length > 0 && (
            <div>
              <Label className="mb-3 block">Projects for {selectedClient?.name}</Label>
              <div className="space-y-2">
                {clientProjects.map(project => {
                  const checked = selectedProjectIds.includes(project.id);
                  const fee = projectFees[project.id] ?? Number(project.fee) ?? 0;
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleProject(project.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {project.project_code} — {project.project_name}
                        </p>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          value={fee}
                          onChange={e => setProjectFees(prev => ({ ...prev, [project.id]: Number(e.target.value) }))}
                          className="h-8 text-right font-mono-bx text-sm"
                          disabled={!checked}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom line items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Custom Line Items</Label>
              <Button variant="outline" size="sm" onClick={addCustomItem}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
              </Button>
            </div>
            {customItems.length > 0 && (
              <div className="space-y-2">
                {customItems.map(item => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_80px_100px_100px_32px] gap-2 items-center"
                  >
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={e => updateCustomItem(item.id, 'description', e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => updateCustomItem(item.id, 'quantity', Number(e.target.value))}
                      className="h-9 text-sm text-center"
                    />
                    <Input
                      type="number"
                      placeholder="Unit price"
                      value={item.unit_price}
                      onChange={e => updateCustomItem(item.id, 'unit_price', Number(e.target.value))}
                      className="h-9 text-sm text-right font-mono-bx"
                    />
                    <div className="text-sm text-right font-mono-bx text-muted-foreground">
                      {(item.quantity * item.unit_price).toLocaleString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeCustomItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono-bx">{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Discount</span>
              <Input
                type="number"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-32 h-8 text-right font-mono-bx text-sm"
              />
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
              <span>Total</span>
              <span className="font-mono-bx">{currency} {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button
              onClick={() => {
                if (validateStep2()) setStep(3);
              }}
            >
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Save */}
      {step === 3 && (
        <div className="rounded-[14px] border p-6 bg-card space-y-5" style={{ borderColor: 'hsl(var(--border))' }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>Review Invoice</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Client</span>
              <p className="font-medium">{selectedClient?.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Invoice Number</span>
              <p className="font-medium font-mono-bx">{invoiceNumber}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Title</span>
              <p className="font-medium">{title}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date</span>
              <p className="font-medium">{dueDate ? format(new Date(dueDate), 'dd MMM yyyy') : '—'}</p>
            </div>
          </div>

          {/* Line items summary */}
          <div>
            <Label className="mb-2 block">Line Items</Label>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-center p-3 font-medium text-muted-foreground w-16">Qty</th>
                    <th className="text-right p-3 font-medium text-muted-foreground w-28">Unit Price</th>
                    <th className="text-right p-3 font-medium text-muted-foreground w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProjectIds.map(pid => {
                    const project = clientProjects?.find(p => p.id === pid);
                    if (!project) return null;
                    const fee = projectFees[pid] ?? Number(project.fee) ?? 0;
                    return (
                      <tr key={pid} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                        <td className="p-3">{project.project_code} — {project.project_name}</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3 text-right font-mono-bx">{fee.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono-bx">{fee.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {customItems.map(item => (
                    <tr key={item.id} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right font-mono-bx">{item.unit_price.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono-bx">{(item.quantity * item.unit_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1 text-sm max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono-bx">{currency} {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono-bx text-destructive">-{currency} {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
              <span>Total</span>
              <span className="font-mono-bx">{currency} {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={saving}
                onClick={() => handleSave(false)}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save as Draft
              </Button>
              <Button
                disabled={saving}
                onClick={() => handleSave(true)}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save & Generate PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
