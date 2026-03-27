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
      {/* Left Panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 lg:w-[60%]">
        <div className="w-full max-w-[420px] rounded-[14px] border border-border bg-card p-10 md:p-12">
          <div className="flex justify-center mb-8">
            <BeudoxLogo variant="default" />
          </div>
          <h1 className="text-center text-[26px] font-bold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
            Welcome back
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1 mb-8">
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
              className="w-full h-10 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[13px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors duration-[var(--transition-fast)] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="text-[13px] text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - desktop only */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden items-center justify-center" style={{ backgroundColor: '#1A1240' }}>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-60">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="3" fill="#D8D4FF" opacity="0.3" />
              </pattern>
              <pattern id="dotGridActive" x="7" y="7" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="3" fill="#5B3FF8" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            <rect width="100%" height="100%" fill="url(#dotGridActive)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
          <BeudoxLogo variant="sidebar" size={52} />
          <p className="text-sm text-white/60">HR & Workforce Platform</p>
          <div className="space-y-2 mt-4">
            <p className="text-[13px] text-white/50">Attendance tracked automatically.</p>
            <p className="text-[13px] text-white/50">Payroll calculated precisely.</p>
            <p className="text-[13px] text-white/50">Your team, in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
