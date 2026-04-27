import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { trackLogin } from '@/lib/login-tracking';
import { Eye, EyeOff, Loader2, Building2, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [deactivatedMessage, setDeactivatedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [company, setCompany] = useState<{ name: string; logo_url: string | null } | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // Persists across the re-render triggered by supabase.auth.signOut() so the
  // message survives the auth state change that would otherwise wipe local state.
  const deactivationErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data } = await supabase
        .from('companies')
        .select('name, logo_url')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();
      setCompany(data);
      setCompanyLoading(false);
    };
    fetchCompany();
  }, []);

  // After signOut() clears the session, the component re-renders with no
  // session. Promote the persisted deactivation message into state so the
  // banner can render.
  useEffect(() => {
    if (!session && deactivationErrorRef.current) {
      setDeactivatedMessage(deactivationErrorRef.current);
      deactivationErrorRef.current = null;
    }
  }, [session]);

  if (authLoading || companyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F6F5FF' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#5B3FF8' }} />
      </div>
    );
  }

  // Don't navigate to the dashboard if we're in the middle of handling a
  // deactivated-account sign-out — the session may briefly still exist.
  if (session && !deactivationErrorRef.current && !deactivatedMessage) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email';
    return undefined;
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setTouched({ email: true, password: true });
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }
    setErrors({});
    setDeactivatedMessage(null);
    setLoading(true);

    const DEACTIVATED_MSG = 'Your account has been deactivated. Please contact your HR manager.';

    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && signInData.user) {
      // Verify the employee is still active before letting the app boot.
      // Deactivated employees may still successfully authenticate (e.g. before
      // ban propagation, or via leftover sessions), which would otherwise
      // leave the app stuck on a loading screen because the employee lookup
      // returns nothing.
      const { data: empStatus } = await supabase
        .from('employees')
        .select('status')
        .eq('email', email)
        .maybeSingle();

      if (empStatus?.status === 'inactive') {
        // Persist the message in a ref BEFORE signOut() — the auth state
        // change re-renders the component and would otherwise wipe local state.
        deactivationErrorRef.current = DEACTIVATED_MSG;
        setPassword('');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Fire-and-forget login tracking — never blocks the login flow
      void trackLogin(signInData.user.id);
    }
    if (error) {
      const isBannedUser = error.code === 'user_banned' || error.message.toLowerCase().includes('banned');
      if (isBannedUser) {
        setDeactivatedMessage(DEACTIVATED_MSG);
        setPassword('');
        setLoading(false);
        return;
      }
      const { data: empData } = await supabase
        .from('employees')
        .select('status')
        .eq('email', email)
        .maybeSingle();
      if (empData?.status === 'inactive') {
        setDeactivatedMessage(DEACTIVATED_MSG);
        setPassword('');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: '#F6F5FF' }}>
      <div
        className="w-full"
        style={{
          maxWidth: 420,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(91,63,248,0.08)',
          padding: 40,
        }}
      >
        {/* Company logo */}
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

        {/* Company name */}
        <h1
          className="text-center"
          style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 22, color: '#120E36' }}
        >
          {company?.name || 'Welcome'}
        </h1>

        {/* Tagline */}
        <p
          className="text-center mt-1"
          style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 14, color: '#9490B4' }}
        >
          HR &amp; Workforce Portal
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(91,63,248,0.10)', margin: '24px 0' }} />

        {errors.general && (
          <div className="mb-5 rounded-lg border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block mb-2"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 12, fontWeight: 500, color: '#9490B4', letterSpacing: '0.02em' }}
            >
              Email address
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full rounded-[10px] border px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                touched.email && errors.email
                  ? 'border-destructive focus:ring-destructive/10'
                  : 'border-border focus:border-[#5B3FF8] focus:ring-[#5B3FF8]/10'
              } focus:ring-[3px]`}
              style={{ fontFamily: 'var(--ff-body)' }}
              placeholder="you@company.com"
              disabled={loading}
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="block mb-2"
              style={{ fontFamily: 'var(--ff-body)', fontSize: 12, fontWeight: 500, color: '#9490B4', letterSpacing: '0.02em' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full rounded-[10px] border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                  touched.password && errors.password
                    ? 'border-destructive focus:ring-destructive/10'
                    : 'border-border focus:border-[#5B3FF8] focus:ring-[#5B3FF8]/10'
                } focus:ring-[3px]`}
                style={{ fontFamily: 'var(--ff-body)' }}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-[14px] font-medium text-white disabled:opacity-50 flex items-center justify-center"
            style={{
              background: '#5B3FF8',
              borderRadius: 10,
              fontFamily: 'var(--ff-body)',
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/forgot-password"
            className="hover:underline"
            style={{ fontFamily: 'var(--ff-body)', fontSize: 13, color: '#5B3FF8' }}
          >
            Forgot password?
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Login;
