import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

interface SetPasswordProps {
  mode: 'invite' | 'recovery';
  onComplete: () => void;
}

// Parse Supabase auth hash params (e.g. #access_token=...&type=invite)
const parseAuthHash = () => {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    type: params.get('type'),
    error: params.get('error'),
    error_description: params.get('error_description'),
  };
};

const getStrength = (pw: string): { label: string; percent: number; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: 'Weak', percent: 20, color: '#EF4444' };
  if (score === 2) return { label: 'Fair', percent: 40, color: '#F59E0B' };
  if (score === 3) return { label: 'Good', percent: 60, color: '#F59E0B' };
  if (score === 4) return { label: 'Strong', percent: 80, color: '#22C55E' };
  return { label: 'Very strong', percent: 100, color: '#16A34A' };
};

const SetPassword = ({ mode, onComplete }: SetPasswordProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isInvite = mode === 'invite';
  const title = isInvite ? 'Set your password' : 'Reset your password';
  const buttonText = isInvite ? 'Set password' : 'Reset password';
  const strength = password.length > 0 ? getStrength(password) : null;

  const validate = () => {
    const errs: typeof errors = {};
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Must be at least 8 characters';
    if (!confirmPassword) errs.confirm = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrors({ general: error.message });
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      if (isInvite) {
        onComplete();
        navigate('/dashboard', { replace: true });
      } else {
        // Sign out after password reset so user logs in with new password
        supabase.auth.signOut().then(() => {
          onComplete();
          navigate('/login', { replace: true });
        });
      }
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #F6F5FF 0%, #EBE6FF 50%, #E0DBFF 100%)' }}>
      {/* Decorative shapes — desktop only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 520, height: 520, top: -120, left: -140, background: 'radial-gradient(circle, rgba(91,63,248,0.08) 0%, rgba(91,63,248,0.02) 70%, transparent 100%)' }} />
        <div className="absolute" style={{ width: 280, height: 280, top: '45%', left: '8%', borderRadius: '32px', transform: 'rotate(25deg)', background: 'rgba(91,63,248,0.05)', border: '1px solid rgba(91,63,248,0.08)' }} />
        <div className="absolute" style={{ width: 80, height: 80, top: '28%', left: '22%', borderRadius: '14px', transform: 'rotate(-15deg)', background: 'rgba(91,63,248,0.10)' }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, bottom: -100, right: -80, background: 'radial-gradient(circle, rgba(91,63,248,0.06) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full" style={{ width: 12, height: 12, top: '18%', left: '35%', background: 'rgba(91,63,248,0.20)' }} />
        <div className="absolute rounded-full" style={{ width: 8, height: 8, top: '72%', left: '15%', background: 'rgba(91,63,248,0.15)' }} />
        <div className="absolute rounded-full" style={{ width: 10, height: 10, top: '85%', right: '35%', background: 'rgba(91,63,248,0.12)' }} />
        <div className="absolute rounded-full" style={{ width: 6, height: 6, top: '12%', right: '25%', background: 'rgba(91,63,248,0.18)' }} />
      </div>

      {/* Left brand area — desktop only */}
      <div
        className="hidden lg:flex lg:w-[45%] items-center justify-center relative z-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(91,63,248,0.12) 3px, transparent 3px), radial-gradient(circle, rgba(91,63,248,0.05) 3px, transparent 3px)`,
          backgroundSize: '16px 16px, 16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        }}
      >
        <div className="flex flex-col items-start px-16 max-w-md">
          <BeudoxLogo variant="default" size={56} />
          <h2 className="mt-10 text-[44px] font-bold leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--ff-display)', color: '#120E36' }}>
            Manage your<br />workforce<br />
            <span style={{ color: '#5B3FF8' }}>with clarity.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed" style={{ color: '#4B4468', fontFamily: 'var(--ff-body)', maxWidth: 340 }}>
            Attendance, payroll, evaluations, and projects — all in one place. Built for teams that move fast.
          </p>
          <div className="mt-10">
            <span className="inline-block text-[13px] font-medium" style={{ background: '#EBE6FF', color: '#5B3FF8', fontFamily: 'var(--ff-body)', padding: '8px 20px', borderRadius: '999px' }}>
              Used by teams across Pakistan
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — set password form */}
      <div className="flex flex-1 items-center justify-center relative z-10 px-6 lg:w-[55%]">
        <div
          className="w-full max-w-[440px] rounded-[18px] border bg-white p-10 md:p-12"
          style={{ borderColor: 'rgba(91,63,248,0.12)', boxShadow: '0 8px 40px -12px rgba(91,63,248,0.10), 0 0 0 1px rgba(91,63,248,0.04)' }}
        >
          <div className="flex justify-center mb-8 lg:hidden">
            <BeudoxLogo variant="default" size={48} />
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 mb-4" style={{ color: '#22C55E' }} />
              <h1 className="text-[28px] font-bold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                Password {isInvite ? 'set' : 'reset'} successfully
              </h1>
              <p className="text-[14px] text-muted-foreground mt-2" style={{ fontFamily: 'var(--ff-body)' }}>
                {isInvite ? 'Redirecting to your dashboard…' : 'Redirecting to sign in…'}
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-center text-[28px] font-bold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                {title}
              </h1>
              <p className="text-center text-[14px] text-muted-foreground mt-2 mb-8" style={{ fontFamily: 'var(--ff-body)' }}>
                {isInvite ? 'Create a password to access your workspace' : 'Enter your new password below'}
              </p>

              {errors.general && (
                <div className="mb-5 rounded-[var(--radius-md)] border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-2" style={{ fontFamily: 'var(--ff-body)', letterSpacing: '0.02em' }}>
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                      className={`w-full rounded-[var(--radius-md)] border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-[3px] ${
                        errors.password ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-primary focus:ring-primary/10'
                      }`}
                      style={{ fontFamily: 'var(--ff-body)' }}
                      placeholder="Min. 8 characters"
                      disabled={loading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>}

                  {/* Strength indicator */}
                  {strength && (
                    <div className="mt-2.5">
                      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength.percent}%`, background: strength.color }} />
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: strength.color, fontFamily: 'var(--ff-body)' }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-2" style={{ fontFamily: 'var(--ff-body)', letterSpacing: '0.02em' }}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: undefined })); }}
                      className={`w-full rounded-[var(--radius-md)] border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-[3px] ${
                        errors.confirm ? 'border-destructive focus:ring-destructive/10' : 'border-border focus:border-primary focus:ring-primary/10'
                      }`}
                      style={{ fontFamily: 'var(--ff-body)' }}
                      placeholder="Re-enter password"
                      disabled={loading}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm && <p className="mt-1.5 text-xs text-destructive">{errors.confirm}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[14px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors disabled:opacity-50 flex items-center justify-center mt-2"
                  style={{ fontFamily: 'var(--ff-body)' }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(91,63,248,0.08)' }}>
                <p className="text-center text-[12px]" style={{ color: '#9490B4', fontFamily: 'var(--ff-body)' }}>
                  Secure login powered by Beudox
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
