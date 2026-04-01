import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Loader2, ImageIcon } from 'lucide-react';
import CompanyDetailsSection from '@/components/settings/CompanyDetailsSection';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIM = 400;

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width;
      let h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        0.8,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

const Settings = () => {
  const { employee, refreshEmployee } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const currentLogo = preview || employee?.company_logo_url || null;
  const isCeo = employee?.role_name === 'ceo';

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('Unsupported format. Use PNG, JPG, SVG, or WebP.');
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error('File too large. Maximum 2MB.');
        return;
      }

      // Show instant preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

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
        setPreview(null);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [employee, refreshEmployee],
  );

  const handleRemove = useCallback(async () => {
    if (!employee) return;
    setRemoving(true);
    try {
      // Try to remove both possible extensions
      await supabase.storage.from('company-logos').remove([
        `${employee.company_id}/logo.jpg`,
        `${employee.company_id}/logo.svg`,
      ]);

      const { error } = await supabase
        .from('companies')
        .update({ logo_url: null } as any)
        .eq('id', employee.company_id);

      if (error) throw error;

      setPreview(null);
      toast.success('Logo removed');
      refreshEmployee();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove logo');
    } finally {
      setRemoving(false);
    }
  }, [employee, refreshEmployee]);

  if (!isCeo) {
    return (
      <div className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--ff-body)' }}>
        Settings are only accessible to the CEO.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Company Branding */}
      <div
        className="rounded-[14px] border p-6"
        style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}
      >
        <h2
          className="text-[18px] font-semibold text-foreground mb-1"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Company Branding
        </h2>
        <p
          className="text-[13px] text-muted-foreground mb-6"
          style={{ fontFamily: 'var(--ff-body)' }}
        >
          Upload your company logo. It will replace the default Beudox logo in the sidebar and across the platform.
        </p>

        <div className="flex items-center gap-6">
          {/* Logo preview */}
          <div
            className="w-20 h-20 rounded-[12px] border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0"
            style={{ borderColor: currentLogo ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))' }}
          >
            {currentLogo ? (
              <img
                src={currentLogo}
                alt="Company logo"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[13px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? 'Uploading…' : 'Upload Logo'}
            </button>

            {currentLogo && (
              <button
                onClick={handleRemove}
                disabled={removing}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] border text-[13px] font-medium text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--ff-body)', borderColor: 'hsl(var(--destructive) / 0.3)' }}
              >
                {removing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Remove Logo
              </button>
            )}

            <p
              className="text-[11px] text-muted-foreground mt-1"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              PNG, JPG, SVG, or WebP · Max 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <CompanyDetailsSection />
    </div>
  );
};

export default Settings;
