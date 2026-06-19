import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { SubSeriesTagInput } from './SubSeriesTagInput';

const CURRENCIES = ['USD', 'PKR', 'AED', 'GBP', 'EUR', 'AUD', 'CAD'];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyId: string;
  onCreated: (clientId: string) => void;
}

export const NewClientModal = ({ open, onOpenChange, companyId, onCreated }: Props) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '', contact_name: '', contact_email: '', contact_phone: '',
    country: '', billing_currency: 'USD', notes: '',
  });
  const [subSeries, setSubSeries] = useState<string[]>([]);
  const [err, setErr] = useState('');

  const reset = () => {
    setForm({ name: '', contact_name: '', contact_email: '', contact_phone: '', country: '', billing_currency: 'USD', notes: '' });
    setSubSeries([]);
    setErr('');
  };

  const save = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from('clients').insert({
        name: form.name.trim(),
        contact_name: form.contact_name.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        country: form.country.trim() || null,
        billing_currency: form.billing_currency,
        notes: form.notes.trim() || null,
        sub_series: subSeries,
        company_id: companyId,
      }).select('id').single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['clients-lookup'] });
      toast({ title: 'Client added' });
      onCreated(id);
      reset();
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleSave = () => {
    if (!form.name.trim()) { setErr('Company name is required'); return; }
    save.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Company Name *</Label>
            <Input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErr(''); }} />
            {err && <p className="text-sm text-destructive mt-1">{err}</p>}
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
            <Label>Sub-Series</Label>
            <p className="text-xs text-muted-foreground mb-2">Add sub-series or divisions under this client (e.g. different property types, regions, or project lines)</p>
            <SubSeriesTagInput value={subSeries} onChange={setSubSeries} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
