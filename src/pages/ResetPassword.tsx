import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Invalid or expired reset link.</p>
          <Link to="/forgot-password" className="text-[13px] text-primary hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-10">
        <div className="flex justify-center mb-8">
          <BeudoxLogo variant="default" />
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-[hsl(var(--bx-success))] mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--ff-display)' }}>
              Password updated
            </h1>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <h1 className="text-center text-[26px] font-bold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
              Set new password
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-8">Enter your new password below</p>

            {error && (
              <div className="mb-4 rounded-[var(--radius-md)] border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-border px-3.5 py-2.5 pr-10 text-[13px] text-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-border px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[13px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
