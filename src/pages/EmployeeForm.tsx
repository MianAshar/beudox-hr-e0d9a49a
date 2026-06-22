import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatRole, ROLE_ORDER } from '@/lib/format-role';
import { z } from 'zod';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const DEPARTMENTS_FALLBACK = ['GC Team', 'MEP Team', 'Admin', 'Director'];
const EMPLOYMENT_TYPES = ['full_time', 'outsourced', 'director'];
const REVIEW_FREQUENCIES = [
  { value: '3', label: 'Every 3 Months' },
  { value: '6', label: 'Every 6 Months' },
  { value: '12', label: 'Every 12 Months' },
];

const employeeSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required').max(255),
  employee_code: z.string().trim().regex(/^\d{2}-\d{2}-\d{4}$/, 'Employee code must be in 00-00-0000 format'),
  cnic: z.string().max(20).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Invalid email'),
  designation: z.string().max(100).optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  joining_date: z.string().min(1, 'Joining date is required'),
  employment_type: z.string().optional(),
  first_review_date: z.string().optional().or(z.literal('')),
  review_frequency_months: z.string().optional(),
  basic_salary: z.string().optional().or(z.literal('')),
  allowance: z.string().optional().or(z.literal('')),
  role_id: z.string().min(1, 'Role is required'),
});

type FormData = z.infer<typeof employeeSchema>;

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

function getCroppedBlob(
  image: HTMLImageElement,
  crop: Crop
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const cropX = (crop.x ?? 0) * scaleX;
    const cropY = (crop.y ?? 0) * scaleY;
    const cropW = (crop.width ?? 0) * scaleX;
    const cropH = (crop.height ?? 0) * scaleY;

    // Resize to max 400x400
    const maxSize = 400;
    let outW = cropW;
    let outH = cropH;
    if (outW > maxSize || outH > maxSize) {
      if (outW > outH) {
        outH = Math.round((outH * maxSize) / outW);
        outW = maxSize;
      } else {
        outW = Math.round((outW * maxSize) / outH);
        outH = maxSize;
      }
    }

    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Crop failed'));
      },
      'image/jpeg',
      0.8
    );
  });
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

const EmployeeForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { employee: authEmployee } = useAuth();
  const queryClient = useQueryClient();

  const companyId = authEmployee?.company_id;
  const userRoles = authEmployee?.roles ?? [];
  const canAccess = ['hr_manager', 'ceo'].some(r => userRoles.includes(r));

  const [form, setForm] = useState<FormData>({
    full_name: '',
    employee_code: '',
    cnic: '',
    phone: '',
    email: '',
    designation: '',
    department: '',
    date_of_birth: '',
    address: '',
    joining_date: '',
    employment_type: 'full_time',
    first_review_date: '',
    review_frequency_months: '6',
    basic_salary: '',
    allowance: '',
    role_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const cropImgRef = useRef<HTMLImageElement | null>(null);

  // Fetch departments from company settings
  const { data: companyData } = useQuery({
    queryKey: ['company-departments', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('departments')
        .eq('id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });
  const departmentsList: string[] = (companyData as any)?.departments || DEPARTMENTS_FALLBACK;

  // Fetch roles for this company
  const { data: roles } = useQuery({
    queryKey: ['company-roles', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .eq('company_id', companyId!)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  // Fetch employee data if editing
  const { data: existing } = useQuery({
    queryKey: ['employee-edit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          employee_roles ( role_id )
        `)
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existing) {
      // Block HR Manager from editing CEO or Director employees
      const isCeo = (existing as any).employee_roles?.some(
        (er: any) => roles?.find(r => r.id === er.role_id)?.name === 'ceo'
      );
      const isDirector = existing.employment_type === 'director';
      const isCeoViewer = userRoles.includes('ceo');
      if (isEdit && !isCeoViewer && userRoles.includes('hr_manager') && (isCeo || isDirector)) {
        toast.error('Only the CEO can edit this profile');
        navigate(`/employees/${id}`, { replace: true });
        return;
      }
      setForm({
        full_name: existing.full_name || '',
        employee_code: existing.employee_code || '',
        cnic: existing.cnic || '',
        phone: existing.phone || '',
        email: existing.email || '',
        designation: existing.designation || '',
        department: existing.department || '',
        date_of_birth: existing.date_of_birth || '',
        address: existing.address || '',
        joining_date: existing.joining_date || '',
        employment_type: existing.employment_type || 'full_time',
        first_review_date: existing.first_review_date || '',
        review_frequency_months: String(existing.review_frequency_months ?? 6),
        basic_salary: existing.basic_salary?.toString() || '',
        allowance: existing.allowance?.toString() || '',
        role_id: existing.employee_roles?.[0]?.role_id || '',
      });
      setExistingAvatarUrl(existing.avatar_url);
    }
  }, [existing, roles, isEdit, userRoles, id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed');
      return;
    }
    // Open crop modal with the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCrop(undefined); // reset crop; will be set onImageLoad
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    // Reset input so re-selecting the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCropImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    cropImgRef.current = img;
    setCrop(centerAspectCrop(img.width, img.height));
  }, []);

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
    setCrop(undefined);
  };

  const handleCropApply = async () => {
    if (!cropImgRef.current || !crop?.width || !crop?.height) return;
    try {
      const blob = await getCroppedBlob(cropImgRef.current, crop);
      setAvatarBlob(blob);
      setAvatarPreview(URL.createObjectURL(blob));
      setRemoveAvatar(false);
    } catch {
      toast.error('Failed to crop image');
    } finally {
      setCropModalOpen(false);
      setCropImageSrc(null);
      setCrop(undefined);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarBlob(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateField = (field: string, value: string) => {
    try {
      const partial = { ...form, [field]: value };
      employeeSchema.parse(partial);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.errors.find((e) => e.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validate all
    const result = employeeSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      toast.error('Please fix the highlighted errors');
      return;
    }

    setSaving(true);
    try {
      const employeeData: any = {
        full_name: form.full_name,
        employee_code: form.employee_code,
        cnic: form.cnic || null,
        phone: form.phone || null,
        email: form.email,
        designation: form.designation || null,
        department: form.department || null,
        date_of_birth: form.date_of_birth || null,
        address: form.address || null,
        joining_date: form.joining_date,
        employment_type: form.employment_type,
        first_review_date: form.first_review_date || null,
        review_frequency_months: form.review_frequency_months ? parseInt(form.review_frequency_months, 10) : 6,
        basic_salary: form.basic_salary ? parseFloat(form.basic_salary) : 0,
        allowance: form.allowance ? parseFloat(form.allowance) : 0,
        company_id: companyId,
      };

      let employeeId = id;

      if (isEdit) {
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', id!);
        if (error) throw error;

        if (existing?.employee_roles?.[0]?.role_id !== form.role_id) {
          await supabase.from('employee_roles').delete().eq('employee_id', id!);
          const { error: roleErr } = await supabase
            .from('employee_roles')
            .insert({ employee_id: id!, role_id: form.role_id });
          if (roleErr) throw roleErr;
        }
      } else {
        const { data: newEmp, error } = await supabase
          .from('employees')
          .insert(employeeData)
          .select('id')
          .single();
        if (error) throw error;
        employeeId = newEmp.id;

        const { error: roleErr } = await supabase
          .from('employee_roles')
          .insert({ employee_id: employeeId, role_id: form.role_id });
        if (roleErr) throw roleErr;
      }

      // Handle avatar upload
      if (avatarBlob && employeeId) {
        const filePath = `${companyId}/${employeeId}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from('employee-avatars')
          .upload(filePath, avatarBlob, {
            contentType: 'image/jpeg',
            upsert: true,
          });
        if (uploadErr) {
          console.error('Avatar upload error:', uploadErr);
        } else {
          const { data: urlData } = supabase.storage
            .from('employee-avatars')
            .getPublicUrl(filePath);
          const avatarUrlWithCacheBust = `${urlData.publicUrl}?t=${Date.now()}`;
          await supabase
            .from('employees')
            .update({ avatar_url: avatarUrlWithCacheBust })
            .eq('id', employeeId);
        }
      } else if (removeAvatar && employeeId) {
        const filePath = `${companyId}/${employeeId}.jpg`;
        await supabase.storage.from('employee-avatars').remove([filePath]);
        await supabase
          .from('employees')
          .update({ avatar_url: null })
          .eq('id', employeeId);
      }

      queryClient.invalidateQueries({ queryKey: ['employees-list'] });
      queryClient.invalidateQueries({ queryKey: ['employee-profile'] });
      queryClient.invalidateQueries({ queryKey: ['employee-edit'] });

      if (isEdit) {
        toast.success('Employee updated successfully');
        navigate(`/employees/${id}`);
      } else {
        // Create auth user + send welcome email via edge function
        try {
          const { data: inviteData, error: inviteErr } =
            await supabase.functions.invoke('invite-employee', {
              body: {
                email: form.email,
                full_name: form.full_name,
                employee_id: employeeId,
              },
            });
          const providerError =
            inviteErr?.message || (inviteData && (inviteData as any).error);
          const emailSent = !!(inviteData && (inviteData as any).email_sent);
          if (providerError || !emailSent) {
            console.error('Invite error:', providerError || 'email not sent');
            toast.warning(
              providerError
                ? `Employee saved, but the welcome email failed: ${providerError}`
                : 'Employee saved but the welcome email could not be sent.',
              { duration: 10000 }
            );
          } else {
            toast.success(
              `Employee added. A welcome email with login details has been sent to ${form.email}.`
            );
          }
        } catch (inviteCatch: any) {
          console.error('Invite invoke failed:', inviteCatch);
          toast.warning(
            `Employee saved but welcome email could not be sent: ${
              inviteCatch?.message || 'unknown error'
            }`,
            { duration: 10000 }
          );
        }
        navigate('/employees');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display font-semibold text-lg text-foreground">
          Access denied
        </h2>
        <p className="text-muted-foreground text-[13px] mt-1">
          You don't have permission to manage employees.
        </p>
      </div>
    );
  }

  const currentAvatarDisplay = avatarPreview || (!removeAvatar ? existingAvatarUrl : null);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => navigate(isEdit ? `/employees/${id}` : '/employees')}
      >
        <ArrowLeft className="h-4 w-4" style={{ strokeWidth: 1.5 }} />
        {isEdit ? 'Back to Profile' : 'Back to Employees'}
      </Button>

      <h2
        className="font-display font-bold text-[22px] text-foreground"
        style={{ fontFamily: 'var(--ff-display)' }}
      >
        {isEdit ? 'Edit Employee' : 'Add Employee'}
      </h2>

      {/* Avatar */}
      <div className="bg-card rounded-[14px] border p-6">
        <Label className="text-[13px] text-foreground font-medium mb-3 block">
          Profile Photo
        </Label>
        <div className="flex items-center gap-4">
          <div
            className="relative cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-20 w-20">
              {currentAvatarDisplay ? (
                <AvatarImage src={currentAvatarDisplay} />
              ) : null}
              <AvatarFallback
                className="text-xl font-semibold"
                style={{
                  background: 'hsl(var(--bx-violet-light))',
                  color: 'hsl(var(--primary))',
                  fontFamily: 'var(--ff-display)',
                }}
              >
                {form.full_name ? getInitials(form.full_name) : <Upload className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Photo
            </Button>
            {currentAvatarDisplay && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 text-destructive"
                onClick={handleRemoveAvatar}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            )}
            <p className="text-[11px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
              JPG, PNG, or WebP. Max 400×400px.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={(open) => { if (!open) handleCropCancel(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-2">
            {cropImageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
                className="max-h-[400px]"
              >
                <img
                  src={cropImageSrc}
                  alt="Crop preview"
                  onLoad={onCropImageLoad}
                  className="max-h-[400px] w-auto"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button onClick={handleCropApply}>
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form fields */}
      <div className="bg-card rounded-[14px] border p-6 space-y-5">
        <h3
          className="font-display font-semibold text-[15px] text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            required
            value={form.full_name}
            error={errors.full_name}
            onChange={(v) => updateField('full_name', v)}
            onBlur={() => validateField('full_name', form.full_name)}
          />
          <div>
            <Label className="text-[12px] text-muted-foreground mb-1.5 block">
              Employee Code <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.employee_code}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                let formatted = digits;
                if (digits.length > 4) {
                  formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
                } else if (digits.length > 2) {
                  formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
                }
                updateField('employee_code', formatted);
              }}
              onBlur={() => validateField('employee_code', form.employee_code)}
              placeholder="00-00-0000"
              inputMode="numeric"
              maxLength={10}
              className="font-mono-bx"
            />
            <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
              Must match the employee's ID in the ZKTeco attendance machine exactly
            </p>
            {errors.employee_code && (
              <p className="text-[11px] text-destructive mt-1">{errors.employee_code}</p>
            )}
          </div>
          <FormField
            label="CNIC"
            value={form.cnic || ''}
            error={errors.cnic}
            onChange={(v) => updateField('cnic', v)}
          />
          <FormField
            label="Phone"
            value={form.phone || ''}
            error={errors.phone}
            onChange={(v) => updateField('phone', v)}
          />
          <FormField
            label="Email"
            type="email"
            required
            value={form.email}
            error={errors.email}
            onChange={(v) => updateField('email', v)}
            onBlur={() => validateField('email', form.email)}
          />
          <FormField
            label="Date of Birth"
            type="date"
            value={form.date_of_birth || ''}
            onChange={(v) => updateField('date_of_birth', v)}
          />
        </div>
        <FormField
          label="Address"
          value={form.address || ''}
          onChange={(v) => updateField('address', v)}
        />
      </div>

      <div className="bg-card rounded-[14px] border p-6 space-y-5">
        <h3
          className="font-display font-semibold text-[15px] text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Employment Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Designation"
            value={form.designation || ''}
            onChange={(v) => updateField('designation', v)}
          />
          <div>
            <Label className="text-[12px] text-muted-foreground mb-1.5 block">Department</Label>
            <Select
              value={form.department || ''}
              onValueChange={(v) => updateField('department', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsList.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormField
            label="Joining Date"
            type="date"
            required
            value={form.joining_date}
            error={errors.joining_date}
            onChange={(v) => updateField('joining_date', v)}
            onBlur={() => validateField('joining_date', form.joining_date)}
          />
          <div>
            <Label className="text-[12px] text-muted-foreground mb-1.5 block">
              Employment Type
            </Label>
            <Select
              value={form.employment_type}
              onValueChange={(v) => updateField('employment_type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[14px] border p-6 space-y-5">
        <h3
          className="font-display font-semibold text-[15px] text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Compensation
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Basic Salary"
            type="number"
            value={form.basic_salary || ''}
            onChange={(v) => updateField('basic_salary', v)}
          />
          <FormField
            label="Fuel Allowance"
            type="number"
            value={form.allowance || ''}
            onChange={(v) => updateField('allowance', v)}
          />
        </div>
      </div>

      <div className="bg-card rounded-[14px] border p-6 space-y-5">
        <h3
          className="font-display font-semibold text-[15px] text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Portal Access
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[12px] text-muted-foreground mb-1.5 block">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select value={form.role_id} onValueChange={(v) => updateField('role_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {[...(roles || [])]
                  .sort((a, b) => {
                    const ai = ROLE_ORDER.indexOf(a.name);
                    const bi = ROLE_ORDER.indexOf(b.name);
                    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                  })
                  .map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {formatRole(r.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_id && (
              <p className="text-[11px] text-destructive mt-1">{errors.role_id}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
              The employee will sign in to Beudox using the email above.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button
          variant="outline"
          onClick={() => navigate(isEdit ? `/employees/${id}` : '/employees')}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? 'Save Changes' : 'Add Employee'}
        </Button>
      </div>
    </div>
  );
};

// Simple reusable form field
const FormField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <Label className="text-[12px] text-muted-foreground mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
    {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
  </div>
);

export default EmployeeForm;
