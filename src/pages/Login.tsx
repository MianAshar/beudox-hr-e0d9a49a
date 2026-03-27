import { useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) return <Navigate to="/dashboard" replace />;

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
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrors({ general: 'Invalid email or password' });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Decorative Panel — desktop only */}
      <div
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden items-center justify-center"
        style={{ backgroundColor: '#F0EEFF', borderRight: '1px solid rgba(91,63,248,0.12)' }}
      >
        {/* Dot grid texture */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dotGhost" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="3" fill="rgba(91,63,248,0.06)" />
              </pattern>
              <pattern id="dotActive" x="8" y="8" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="3" fill="rgba(91,63,248,0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGhost)" />
            <rect width="100%" height="100%" fill="url(#dotActive)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <BeudoxLogo variant="default" size={52} />
          <p className="mt-3 text-[15px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            HR &amp; Workforce Platform
          </p>
          <div className="my-7 w-10 h-px" style={{ backgroundColor: '#D5D2EB' }} />
          <div className="space-y-1" style={{ lineHeight: '2.0' }}>
            <p className="text-[14px]" style={{ color: '#4B4468', fontFamily: 'var(--ff-body)' }}>Attendance tracked automatically.</p>
            <p className="text-[14px]" style={{ color: '#4B4468', fontFamily: 'var(--ff-body)' }}>Payroll calculated precisely.</p>
            <p className="text-[14px]" style={{ color: '#4B4468', fontFamily: 'var(--ff-body)' }}>Your team, in one place.</p>
          </div>
          <div
            className="mt-10 rounded-full text-[12px] font-medium"
            style={{
              backgroundColor: '#EBE6FF',
              color: '#5B3FF8',
              padding: '6px 16px',
              fontFamily: 'var(--ff-body)',
            }}
          >
            Used by teams across Pakistan
          </div>
        </div>
      </div>

      {/* Right Panel — login form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 lg:w-[60%]">
        <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-10 md:p-12">
          <div className="flex justify-center mb-8">
            <BeudoxLogo variant="default" />
          </div>
          <h1 className="text-center text-[26px] font-bold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
            Welcome back
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1 mb-7">
            Sign in to your workspace
          </p>

          {errors.general && (
            <div className="mb-4 rounded-[var(--radius-md)] border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-[var(--radius-md)] border px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none transition-all duration-[var(--transition-fast)] ${
                  touched.email && errors.email
                    ? 'border-destructive focus:ring-destructive/10'
                    : 'border-border focus:border-primary focus:ring-primary/10'
                } focus:ring-[3px]`}
                placeholder="you@company.com"
                disabled={loading}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full rounded-[var(--radius-md)] border px-3.5 py-2.5 pr-10 text-[13px] text-foreground placeholder:text-muted-foreground outline-none transition-all duration-[var(--transition-fast)] ${
                    touched.password && errors.password
                      ? 'border-destructive focus:ring-destructive/10'
                      : 'border-border focus:border-primary focus:ring-primary/10'
                  } focus:ring-[3px]`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[14px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors duration-[var(--transition-fast)] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-[13px] text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
