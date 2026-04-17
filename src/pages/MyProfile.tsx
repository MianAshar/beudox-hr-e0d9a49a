import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatRole } from '@/lib/format-role';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, Upload, Eye, EyeOff } from 'lucide-react';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const InfoField = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <p className="text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: 'var(--ff-body)' }}>{label}</p>
    <p className="text-[13px] text-foreground font-medium">{value || '—'}</p>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-[14px] border p-6">
    <h3 className="font-display font-semibold text-[15px] text-foreground mb-4" style={{ fontFamily: 'var(--ff-display)' }}>
      {title}
    </h3>
    {children}
  </div>
);

const MyProfile = () => {
  const { employee, user, refreshEmployee } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile', employee?.employee_id],
    enabled: !!employee?.employee_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`*, employee_roles ( roles ( name ) )`)
        .eq('id', employee!.employee_id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employee) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const filePath = `${employee.company_id}/${employee.employee_id}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from('employee-avatars')
        .upload(filePath, file, { contentType: file.type, upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from('employee-avatars')
        .getPublicUrl(filePath);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updErr } = await supabase
        .from('employees')
        .update({ avatar_url: avatarUrl })
        .eq('id', employee.employee_id);
      if (updErr) throw updErr;

      toast.success('Profile photo updated');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      refreshEmployee();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('All password fields are required');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (!user?.email) {
      setPwError('Unable to verify account email');
      return;
    }

    setSavingPw(true);
    try {
      // Verify current password
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInErr) {
        setPwError('Current password is incorrect');
        return;
      }

      const { error: updErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updErr) {
        setPwError(updErr.message);
        return;
      }

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password');
    } finally {
      setSavingPw(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const roles = (profile.employee_roles || [])
    .map((er: any) => er.roles?.name)
    .filter(Boolean)
    .map((r: string) => formatRole(r))
    .join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Personal Details */}
      <SectionCard title="Personal Details">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Avatar className="h-24 w-24">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? (
                <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Uploading…</>
              ) : (
                <><Upload className="mr-2 h-3 w-3" /> Change Photo</>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
            <InfoField label="Full Name" value={profile.full_name} />
            <InfoField label="Email" value={profile.email} />
            <InfoField label="Designation" value={profile.designation} />
            <InfoField label="Department" value={profile.department} />
            <InfoField
              label="Joining Date"
              value={profile.joining_date ? format(new Date(profile.joining_date), 'MMM d, yyyy') : null}
            />
            <InfoField label="Employee Code" value={profile.employee_code} />
            <InfoField label="Role(s)" value={roles || null} />
          </div>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password">
        <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="current-password" className="text-[12px]">Current Password</Label>
            <div className="relative mt-1">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password" className="text-[12px]">New Password</Label>
            <div className="relative mt-1">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-[12px]">Confirm New Password</Label>
            <div className="relative mt-1">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {pwError && (
            <p className="text-[12px] text-destructive">{pwError}</p>
          )}

          <Button type="submit" disabled={savingPw}>
            {savingPw ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              'Save Password'
            )}
          </Button>
        </form>
      </SectionCard>
    </div>
  );
};

export default MyProfile;
