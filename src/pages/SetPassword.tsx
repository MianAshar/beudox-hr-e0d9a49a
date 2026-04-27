import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

type View = 'verifying' | 'ready' | 'expired';

// Capture hash synchronously at module load — before React renders or clears it
const _initialHash = typeof window !== 'undefined' ? window.location.hash.substring(1) : '';
const _initialHashParams = new URLSearchParams(_initialHash);
const _initialSearchParams = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();
const CAPTURED_TOKENS = {
  accessToken: _initialHashParams.get('access_token'),
  refreshToken: _initialHashParams.get('refresh_token'),
  error: _initialHashParams.get('error'),
  errorCode: _initialHashParams.get('error_code'),
  tokenHash: _initialSearchParams.get('token_hash'),
  type: _initialSearchParams.get('type'),
};
// Clear the hash immediately so re-reads return nothing
if (typeof window !== 'undefined' && (_initialHash || window.location.search)) {
  window.history.replaceState(null, '', window.location.pathname);
}

const getStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too weak', color: '#E5484D' },
    { label: 'Weak', color: '#E5484D' },
    { label: 'Fair', color: '#F5A524' },
    { label: 'Good', color: '#5B3FF8' },
    { label: 'Strong', color: '#10B981' },
    { label: 'Very strong', color: '#10B981' },
  ];
  return { score, ...map[score] };
};

const SetPassword = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('verifying');
  const [company, setCompany] = useState<{ name: string; logo_url: string | null } | null>(null);

  const tokenRef = useRef(CAPTURED_TOKENS);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load company branding for the card
  useEffect(() => {
    supabase
      .from('companies')
      .select('name, logo_url')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setCompany(data));
  }, []);

  // Token exchange on mount — uses tokens captured synchronously at module load
  useEffect(() => {
    const run = async () => {
      const { accessToken, refreshToken, error: hashError, tokenHash, type } = tokenRef.current;

      // Error in hash (e.g. expired/invalid link)
      if (hashError) {
        setView('expired');
        return;
      }

      // Hash tokens path
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setView('expired');
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        setView(session ? 'ready' : 'expired');
        return;
      }

      // Fallback: query string token_hash
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });
        if (error) {
          setView('expired');
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        setView(session ? 'ready' : 'expired');
        return;
      }

      // Nothing found
      navigate('/login', { replace: true });
    };

    run();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!password || !confirm) {
      setFormError('Both fields are required');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setFormError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    toast.success('Password set! Welcome to Beudox.');
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate('/login', { replace: true });
    }, 2000);
  };

  const strength = getStrength(password);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: '#F6F5FF' }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: 460,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(91,63,248,0.08)',
          padding: 40,
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              style={{ width: 64, height: 64, objectFit: 'contain' }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 64, height: 64, background: '#F0EDFF' }}
            >
              <Building2 className="h-8 w-8" style={{ color: '#5B3FF8' }} />
            </div>
          )}
        </div>

        {view === 'verifying' && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mb-3" style={{ color: '#5B3FF8' }} />
            <p
              style={{
                fontFamily: 'var(--ff-body)',
                fontSize: 14,
                color: '#9490B4',
              }}
            >
              Verifying your invite link...
            </p>
          </div>
        )}

        {view === 'expired' && (
          <>
            <h1
              className="text-center"
              style={{
                fontFamily: 'var(--ff-display)',
                fontWeight: 700,
                fontSize: 22,
                color: '#120E36',
              }}
            >
              Invite link expired
            </h1>
            <p
              className="text-center mt-2"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 14, color: '#9490B4' }}
            >
              This link has already been used or has expired. Please ask your HR manager to send a new invite.
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full h-12 mt-6 text-[14px] font-medium text-white flex items-center justify-center"
              style={{ background: '#5B3FF8', borderRadius: 10, fontFamily: 'var(--ff-body)' }}
            >
              Go to Login
            </button>
          </>
        )}

        {view === 'ready' && (
          <>
            <h1
              className="text-center"
              style={{
                fontFamily: 'var(--ff-display)',
                fontWeight: 700,
                fontSize: 22,
                color: '#120E36',
              }}
            >
              Set your password
            </h1>
            <p
              className="text-center mt-1"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 14, color: '#9490B4' }}
            >
              Create a password to access your workspace
            </p>

            <div style={{ height: 1, background: 'rgba(91,63,248,0.10)', margin: '24px 0' }} />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block mb-2"
                  style={{ fontFamily: 'var(--ff-body)', fontSize: 12, fontWeight: 500, color: '#9490B4', letterSpacing: '0.02em' }}
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[10px] border border-border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-[#5B3FF8] focus:ring-[3px] focus:ring-[#5B3FF8]/10"
                    style={{ fontFamily: 'var(--ff-body)' }}
                    placeholder="••••••••"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div
                      className="w-full overflow-hidden rounded-full"
                      style={{ height: 4, background: '#EDEAFB' }}
                    >
                      <div
                        style={{
                          width: `${(strength.score / 5) * 100}%`,
                          height: '100%',
                          background: strength.color,
                          transition: 'width 0.2s ease',
                        }}
                      />
                    </div>
                    <p
                      className="mt-1.5"
                      style={{ fontFamily: 'var(--ff-body)', fontSize: 12, color: strength.color }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
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
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-[10px] border border-border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-[#5B3FF8] focus:ring-[3px] focus:ring-[#5B3FF8]/10"
                    style={{ fontFamily: 'var(--ff-body)' }}
                    placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 text-[14px] font-medium text-white disabled:opacity-50 flex items-center justify-center"
                style={{ background: '#5B3FF8', borderRadius: 10, fontFamily: 'var(--ff-body)' }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Password'}
              </button>

              {formError && (
                <p className="text-center text-sm text-destructive">{formError}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
