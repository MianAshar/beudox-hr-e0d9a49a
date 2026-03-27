import { useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginV2 = () => {
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
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #F6F5FF 0%, #EBE6FF 50%, #E0DBFF 100%)' }}>

      {/* Decorative shapes — desktop only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large circle top-left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 520,
            height: 520,
            top: -120,
            left: -140,
            background: 'radial-gradient(circle, rgba(91,63,248,0.08) 0%, rgba(91,63,248,0.02) 70%, transparent 100%)',
          }}
        />
        {/* Medium shape mid-left */}
        <div
          className="absolute"
          style={{
            width: 280,
            height: 280,
            top: '45%',
            left: '8%',
            borderRadius: '32px',
            transform: 'rotate(25deg)',
            background: 'rgba(91,63,248,0.05)',
            border: '1px solid rgba(91,63,248,0.08)',
          }}
        />
        {/* Small accent square */}
        <div
          className="absolute"
          style={{
            width: 80,
            height: 80,
            top: '28%',
            left: '22%',
            borderRadius: '14px',
            transform: 'rotate(-15deg)',
            background: 'rgba(91,63,248,0.10)',
          }}
        />
        {/* Bottom-right large circle */}
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: -100,
            right: -80,
            background: 'radial-gradient(circle, rgba(91,63,248,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Tiny floating dots */}
        <div className="absolute rounded-full" style={{ width: 12, height: 12, top: '18%', left: '35%', background: 'rgba(91,63,248,0.20)' }} />
        <div className="absolute rounded-full" style={{ width: 8, height: 8, top: '72%', left: '15%', background: 'rgba(91,63,248,0.15)' }} />
        <div className="absolute rounded-full" style={{ width: 10, height: 10, top: '85%', right: '35%', background: 'rgba(91,63,248,0.12)' }} />
        <div className="absolute rounded-full" style={{ width: 6, height: 6, top: '12%', right: '25%', background: 'rgba(91,63,248,0.18)' }} />
      </div>

      {/* Left brand area — desktop only */}
      <div className="hidden lg:flex lg:w-[45%] items-center justify-center relative z-10">
        <div className="flex flex-col items-start px-16 max-w-md">
          <BeudoxLogo variant="default" size={56} />

          <h2
            className="mt-10 text-[44px] font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--ff-display)', color: '#120E36' }}
          >
            Manage your<br />
            workforce<br />
            <span style={{ color: '#5B3FF8' }}>with clarity.</span>
          </h2>

          <p
            className="mt-6 text-[16px] leading-relaxed"
            style={{ color: '#4B4468', fontFamily: 'var(--ff-body)', maxWidth: 340 }}
          >
            Attendance, payroll, evaluations, and projects — all in one place. Built for teams that move fast.
          </p>

          <div className="mt-10 flex items-center gap-3">
            {/* Stacked avatars placeholder */}
            <div className="flex -space-x-2">
              {['#5B3FF8', '#7B62FA', '#9490B4', '#4429E0'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: c, fontFamily: 'var(--ff-display)' }}
                >
                  {['U', 'A', 'S', 'R'][i]}
                </div>
              ))}
            </div>
            <span
              className="text-[13px] font-medium"
              style={{ color: '#4B4468', fontFamily: 'var(--ff-body)' }}
            >
              Trusted by growing teams
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center relative z-10 px-6 lg:w-[55%]">
        <div
          className="w-full max-w-[440px] rounded-[18px] border bg-white p-10 md:p-12"
          style={{
            borderColor: 'rgba(91,63,248,0.12)',
            boxShadow: '0 8px 40px -12px rgba(91,63,248,0.10), 0 0 0 1px rgba(91,63,248,0.04)',
          }}
        >
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <BeudoxLogo variant="default" size={48} />
          </div>

          <h1
            className="text-center text-[28px] font-bold text-foreground"
            style={{ fontFamily: 'var(--ff-display)' }}
          >
            Welcome back
          </h1>
          <p
            className="text-center text-[14px] text-muted-foreground mt-2 mb-8"
            style={{ fontFamily: 'var(--ff-body)' }}
          >
            Sign in to continue to your workspace
          </p>

          {errors.general && (
            <div className="mb-5 rounded-[var(--radius-md)] border border-destructive/20 bg-[hsl(var(--bx-danger-bg))] px-4 py-3 text-sm text-[hsl(var(--bx-danger-text))]">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-[12px] font-medium text-muted-foreground mb-2"
                style={{ fontFamily: 'var(--ff-body)', letterSpacing: '0.02em' }}
              >
                Email address
              </label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-[var(--radius-md)] border px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all duration-[var(--transition-fast)] ${
                  touched.email && errors.email
                    ? 'border-destructive focus:ring-destructive/10'
                    : 'border-border focus:border-primary focus:ring-primary/10'
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
                className="block text-[12px] font-medium text-muted-foreground mb-2"
                style={{ fontFamily: 'var(--ff-body)', letterSpacing: '0.02em' }}
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
                  className={`w-full rounded-[var(--radius-md)] border px-4 py-3 pr-11 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all duration-[var(--transition-fast)] ${
                    touched.password && errors.password
                      ? 'border-destructive focus:ring-destructive/10'
                      : 'border-border focus:border-primary focus:ring-primary/10'
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
              className="w-full h-12 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-[14px] font-medium hover:bg-[hsl(var(--bx-violet-dark))] transition-colors duration-[var(--transition-fast)] disabled:opacity-50 flex items-center justify-center mt-2"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="text-[13px] text-primary hover:underline"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Subtle footer inside card */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(91,63,248,0.08)' }}>
            <p
              className="text-center text-[12px]"
              style={{ color: '#9490B4', fontFamily: 'var(--ff-body)' }}
            >
              Secure login powered by Beudox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginV2;
