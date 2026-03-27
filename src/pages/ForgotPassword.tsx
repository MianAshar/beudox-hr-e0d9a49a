import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-10">
        <div className="flex justify-center mb-8">
          <BeudoxLogo variant="default" />
        </div>

        {sent ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-[hsl(var(--bx-success))] mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--ff-display)' }}>Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="text-[13px] text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center text-[26px] font-bold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
              Reset password
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Enter your email to receive a reset link
            </p>

            {error && (
              <div className="mb-4 rounded-[var(--radius-md)] border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-border px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
                  placeholder="you@company.com"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[13px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link to="/login" className="text-[13px] text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
