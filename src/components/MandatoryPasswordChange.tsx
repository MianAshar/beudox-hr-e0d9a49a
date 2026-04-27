import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const TEMP_PASSWORD = 'Forte@123';

const getStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Very weak', color: '#E5484D' },
    { label: 'Weak', color: '#F76808' },
    { label: 'Fair', color: '#F5A524' },
    { label: 'Good', color: '#46A758' },
    { label: 'Strong', color: '#30A46C' },
    { label: 'Very strong', color: '#1A7F4F' },
  ];
  return { score, ...map[Math.min(score, 5)] };
};

const MandatoryPasswordChange = () => {
  const navigate = useNavigate();
  const { refreshEmployee, employee } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ new?: string; confirm?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(true);

  // Block escape key & body scroll while modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!newPassword) next.new = 'New password is required';
    else if (newPassword.length < 8) next.new = 'Password must be at least 8 characters';
    else if (newPassword === TEMP_PASSWORD)
      next.new = 'Please choose a different password than your temporary one';
    if (!confirmPassword) next.confirm = 'Please confirm your password';
    else if (newPassword && confirmPassword !== newPassword)
      next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      if (pwError) {
        setErrors({ general: pwError.message || 'Failed to update password' });
        setSubmitting(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrors({ general: 'Failed to complete setup. Please try again.' });
        setSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('employees')
        .update({ must_change_password: false })
        .eq('auth_user_id', user.id);

      if (updateError) {
        setErrors({ general: 'Failed to complete setup. Please try again.' });
        setSubmitting(false);
        return;
      }

      // Dismiss modal first, then refresh auth state and navigate
      setSubmitting(false);
      setVisible(false);
      refreshEmployee();
      toast.success('Password updated. Welcome to Forte HR Portal!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to update password' });
      setSubmitting(false);
    }
  };

  const strength = getStrength(newPassword);
  const companyName = employee?.company_name || 'Forte';
  const companyLogo = employee?.company_logo_url;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: 'rgba(18, 14, 54, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full bg-white"
        style={{
          maxWidth: 440,
          borderRadius: 14,
          padding: 36,
          boxShadow: '0 12px 48px rgba(18,14,54,0.24)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 56, height: 56, background: '#F0EDFF' }}
            >
              <Building2 className="h-7 w-7" style={{ color: '#5B3FF8' }} />
            </div>
          )}
        </div>

        <h2
          className="text-center"
          style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 20, color: '#120E36' }}
        >
          Set your new password
        </h2>
        <p
          className="text-center mt-2"
          style={{ fontFamily: 'var(--ff-body)', fontSize: 14, color: '#4B4468', lineHeight: 1.5 }}
        >
          You're logged in with a temporary password. Please set a permanent password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label
              className="block mb-2"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 12, fontWeight: 500, color: '#9490B4', letterSpacing: '0.02em' }}
            >
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full rounded-[10px] border px-4 py-3 pr-11 text-[14px] outline-none transition-all ${
                  errors.new
                    ? 'border-destructive focus:ring-destructive/10'
                    : 'border-border focus:border-[#5B3FF8] focus:ring-[#5B3FF8]/10'
                } focus:ring-[3px]`}
                style={{ fontFamily: 'var(--ff-body)' }}
                disabled={submitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ background: '#EFEDF7' }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px]" style={{ color: strength.color, fontFamily: 'var(--ff-body)' }}>
                  {strength.label}
                </p>
              </div>
            )}
            {errors.new && <p className="mt-1.5 text-xs text-destructive">{errors.new}</p>}
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 12, fontWeight: 500, color: '#9490B4', letterSpacing: '0.02em' }}
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-[10px] border px-4 py-3 pr-11 text-[14px] outline-none transition-all ${
                  errors.confirm
                    ? 'border-destructive focus:ring-destructive/10'
                    : 'border-border focus:border-[#5B3FF8] focus:ring-[#5B3FF8]/10'
                } focus:ring-[3px]`}
                style={{ fontFamily: 'var(--ff-body)' }}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm && <p className="mt-1.5 text-xs text-destructive">{errors.confirm}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-[14px] font-medium text-white disabled:opacity-50 flex items-center justify-center mt-2"
            style={{ background: '#5B3FF8', borderRadius: 10, fontFamily: 'var(--ff-body)' }}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Password'}
          </button>

          {errors.general && (
            <p className="mt-2 text-xs text-destructive text-center">{errors.general}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default MandatoryPasswordChange;
