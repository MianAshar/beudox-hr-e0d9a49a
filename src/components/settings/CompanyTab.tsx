import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, ImageIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;
const MAX_DIM = 400;

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') { resolve(file); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('Compression failed')), 'image/jpeg', 0.8);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

const CompanyTab = () => {
  const { employee, refreshEmployee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const { data: company, isLoading } = useQuery({
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
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    website: '',
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
        name: company.name || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        phone: (company as any).phone || '',
        website: (company as any).website || '',
        invoice_prefix: company.invoice_prefix || '',
        bank_name: company.bank_name || '',
        bank_account_title: company.bank_account_title || '',
        bank_account_number: company.bank_account_number || '',
        bank_iban: company.bank_iban || '',
        bank_swift: company.bank_swift || '',
      });
    }
  }, [company]);

  const currentLogo = logoPreview || employee?.company_logo_url || null;

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) { toast.error('Unsupported format. Use PNG, JPG, SVG, or WebP.'); return; }
    if (file.size > MAX_SIZE) { toast.error('File too large. Maximum 2MB.'); return; }
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const ext = file.type === 'image/svg+xml' ? 'svg' : 'jpg';
      const path = `${employee!.company_id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(path, compressed, { upsert: true, contentType: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/jpeg' });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl } as any)
        .eq('id', employee!.company_id);
      if (updateError) throw updateError;
      toast.success('Company logo updated');
      refreshEmployee();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setLogoPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [employee, refreshEmployee]);

  const handleRemoveLogo = useCallback(async () => {
    if (!employee) return;
    setRemoving(true);
    try {
      await supabase.storage.from('company-logos').remove([
        `${employee.company_id}/logo.jpg`,
        `${employee.company_id}/logo.svg`,
      ]);
      const { error } = await supabase
        .from('companies')
        .update({ logo_url: null } as any)
        .eq('id', employee.company_id);
      if (error) throw error;
      setLogoPreview(null);
      toast.success('Logo removed');
      refreshEmployee();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove logo');
    } finally {
      setRemoving(false);
    }
  }, [employee, refreshEmployee]);

  const handleSave = useCallback(async () => {
    if (!companyId) return;
    if (!form.name.trim()) { toast.error('Company name is required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: form.name.trim(),
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          country: form.country.trim() || null,
          phone: form.phone.trim() || null,
          website: form.website.trim() || null,
          invoice_prefix: form.invoice_prefix.trim() || null,
          bank_name: form.bank_name.trim() || null,
          bank_account_title: form.bank_account_title.trim() || null,
          bank_account_number: form.bank_account_number.trim() || null,
          bank_iban: form.bank_iban.trim() || null,
          bank_swift: form.bank_swift.trim() || null,
        } as any)
        .eq('id', companyId);
      if (error) throw error;
      toast.success('Company details saved');
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-[200px] rounded-[14px]" />
        <Skeleton className="h-[300px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Company Details */}
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Company Details
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          These details appear on invoices and official documents.
        </p>
        <div className="space-y-4">
          <div>
            <Label>Company Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={set('name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Address</Label><Input value={form.address} onChange={set('address')} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={set('city')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Country</Label><Input value={form.country} onChange={set('country')} /></div>
            <div><Label>Phone Number</Label><Input value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Website</Label><Input value={form.website} onChange={set('website')} placeholder="https://" /></div>
            <div>
              <Label>Invoice Prefix</Label>
              <Input value={form.invoice_prefix} onChange={set('invoice_prefix')} placeholder="e.g. FORTE" className="font-mono-bx" />
              <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                Used for auto-generating invoice numbers e.g. FORTE-INV-2026-001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Bank Details
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          Bank information used on invoices.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Bank Name</Label><Input value={form.bank_name} onChange={set('bank_name')} /></div>
            <div><Label>Account Title</Label><Input value={form.bank_account_title} onChange={set('bank_account_title')} /></div>
          </div>
          <div><Label>Account Number</Label><Input value={form.bank_account_number} onChange={set('bank_account_number')} className="font-mono-bx" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>IBAN</Label><Input value={form.bank_iban} onChange={set('bank_iban')} className="font-mono-bx" /></div>
            <div><Label>SWIFT Code</Label><Input value={form.bank_swift} onChange={set('bank_swift')} className="font-mono-bx" /></div>
          </div>
        </div>
      </div>

      {/* Company Branding */}
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Company Branding
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          Upload your company logo. It will replace the default Beudox logo in the sidebar and across the platform.
        </p>
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-[12px] border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0"
            style={{ borderColor: currentLogo ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))' }}
          >
            {currentLogo ? (
              <img src={currentLogo} alt="Company logo" className="w-full h-full object-contain p-1" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" className="hidden" onChange={handleFileSelect} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[13px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading…' : 'Upload Logo'}
            </button>
            {currentLogo && (
              <button
                onClick={handleRemoveLogo}
                disabled={removing}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] border text-[13px] font-medium text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--ff-body)', borderColor: 'hsl(var(--destructive) / 0.3)' }}
              >
                {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Remove Logo
              </button>
            )}
            <p className="text-[11px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
              PNG, JPG, SVG, or WebP · Max 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Company Details
        </Button>
      </div>
    </div>
  );
};

export default CompanyTab;
