import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CompanyDetailsSection = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;

  const { data: company } = useQuery({
    queryKey: ['company-settings', companyId],
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

  const [form, setForm] = useState({
    address: '',
    city: '',
    country: '',
    invoice_prefix: '',
    bank_name: '',
    bank_account_title: '',
    bank_account_number: '',
    bank_iban: '',
    bank_swift: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setForm({
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        invoice_prefix: company.invoice_prefix || '',
        bank_name: company.bank_name || '',
        bank_account_title: company.bank_account_title || '',
        bank_account_number: company.bank_account_number || '',
        bank_iban: company.bank_iban || '',
        bank_swift: company.bank_swift || '',
      });
    }
  }, [company]);

  const handleSave = useCallback(async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          country: form.country.trim() || null,
          invoice_prefix: form.invoice_prefix.trim() || null,
          bank_name: form.bank_name.trim() || null,
          bank_account_title: form.bank_account_title.trim() || null,
          bank_account_number: form.bank_account_number.trim() || null,
          bank_iban: form.bank_iban.trim() || null,
          bank_swift: form.bank_swift.trim() || null,
        } as any)
        .eq('id', companyId);
      if (error) throw error;
      toast.success('Company details updated');
      qc.invalidateQueries({ queryKey: ['company-settings'] });
      qc.invalidateQueries({ queryKey: ['company-detail'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [companyId, form, qc]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div
      className="rounded-[14px] border p-6"
      style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}
    >
      <h2
        className="text-[18px] font-semibold text-foreground mb-1"
        style={{ fontFamily: 'var(--ff-display)' }}
      >
        Company Details
      </h2>
      <p
        className="text-[13px] text-muted-foreground mb-6"
        style={{ fontFamily: 'var(--ff-body)' }}
      >
        These details appear on invoices and official documents.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Company Address</Label>
            <Input value={form.address} onChange={set('address')} />
          </div>
          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={set('city')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Country</Label>
            <Input value={form.country} onChange={set('country')} />
          </div>
          <div>
            <Label>Invoice Prefix</Label>
            <Input value={form.invoice_prefix} onChange={set('invoice_prefix')} placeholder="e.g. FORTE" className="font-mono-bx" />
          </div>
        </div>

        <div className="border-t pt-4 mt-4" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-sm font-medium text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
            Bank Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input value={form.bank_name} onChange={set('bank_name')} />
              </div>
              <div>
                <Label>Account Title</Label>
                <Input value={form.bank_account_title} onChange={set('bank_account_title')} />
              </div>
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value={form.bank_account_number} onChange={set('bank_account_number')} className="font-mono-bx" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IBAN</Label>
                <Input value={form.bank_iban} onChange={set('bank_iban')} className="font-mono-bx" />
              </div>
              <div>
                <Label>SWIFT Code</Label>
                <Input value={form.bank_swift} onChange={set('bank_swift')} className="font-mono-bx" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsSection;
