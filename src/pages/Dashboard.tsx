import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Users, CalendarCheck, DollarSign, FolderKanban } from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const currentMonthYear = format(new Date(), 'yyyy-MM');
const currentMonthName = format(new Date(), 'MMMM');

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'accent';
  loading?: boolean;
}

const StatCard = ({ icon, value, label, variant = 'default', loading }: StatCardProps) => {
  if (loading) {
    return (
      <div
        className="animate-pulse rounded-[14px] p-[18px_20px]"
        style={{ background: '#ECEAF8', minHeight: 120 }}
      />
    );
  }

  const styles: Record<string, { bg: string; text: string; muted: string; iconColor: string; border?: string }> = {
    default: {
      bg: 'hsl(var(--card))',
      text: 'hsl(var(--card-foreground))',
      muted: 'hsl(var(--muted-foreground))',
      iconColor: 'hsl(var(--primary))',
      border: '1px solid hsla(254,93%,61%,0.15)',
    },
    success: {
      bg: '#ECFDF5',
      text: '#065F46',
      muted: '#047857',
      iconColor: '#059669',
      border: '1px solid rgba(5,150,105,0.2)',
    },
    warning: {
      bg: '#FFFBEB',
      text: '#92400E',
      muted: '#B45309',
      iconColor: '#D97706',
      border: '1px solid rgba(217,119,6,0.2)',
    },
    accent: {
      bg: '#5B3FF8',
      text: '#FFFFFF',
      muted: 'rgba(255,255,255,0.7)',
      iconColor: 'rgba(255,255,255,0.8)',
    },
  };

  const s = styles[variant];

  return (
    <div
      className="rounded-[14px] p-[18px_20px] flex flex-col gap-3"
      style={{ background: s.bg, border: s.border }}
    >
      <div style={{ color: s.iconColor }}>{icon}</div>
      <div>
        <p
          className="font-bold leading-none"
          style={{ fontFamily: 'var(--ff-display)', fontSize: 32, color: s.text }}
        >
          {value}
        </p>
        <p
          className="mt-1"
          style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: s.muted }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { employee, loading: authLoading } = useAuth();
  const companyId = employee?.company_id;
  const role = employee?.role_name;

  const isHrOrCeo = role === 'HR Manager' || role === 'CEO';
  const isFinanceOrCeo = role === 'Finance Manager' || role === 'CEO';

  const today = format(new Date(), 'EEEE, d MMMM yyyy');
  const firstName = employee?.full_name?.split(' ')[0] || 'there';

  // Active employees count
  const { data: empCount, isLoading: empLoading } = useQuery({
    queryKey: ['dashboard-employees', companyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId!)
        .eq('status', 'active');
      if (error) { console.error('Employee count error:', error); return null; }
      return count;
    },
    enabled: !!companyId && isHrOrCeo,
  });

  // Attendance uploaded this month
  const { data: attendanceUploaded, isLoading: attLoading } = useQuery({
    queryKey: ['dashboard-attendance', companyId, currentMonthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_imports')
        .select('id')
        .eq('company_id', companyId!)
        .eq('month_year', currentMonthYear)
        .eq('status', 'completed')
        .limit(1);
      if (error) { console.error('Attendance check error:', error); return null; }
      return data && data.length > 0;
    },
    enabled: !!companyId && isHrOrCeo,
  });

  // Payroll status
  const { data: payrollStatus, isLoading: payLoading } = useQuery({
    queryKey: ['dashboard-payroll', companyId, currentMonthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('status')
        .eq('company_id', companyId!)
        .eq('month_year', currentMonthYear)
        .eq('superseded', false);
      if (error) { console.error('Payroll status error:', error); return null; }
      if (!data || data.length === 0) return 'Not generated';
      const statuses = data.map((r) => r.status);
      if (statuses.every((s) => s === 'paid')) return 'Paid';
      if (statuses.every((s) => s === 'approved' || s === 'paid')) return 'Approved';
      if (statuses.some((s) => s === 'draft')) return 'Draft';
      return statuses[0] ?? 'Not generated';
    },
    enabled: !!companyId && isFinanceOrCeo,
  });

  // Active projects count
  const { data: projectCount, isLoading: projLoading } = useQuery({
    queryKey: ['dashboard-projects', companyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId!)
        .eq('status', 'in_progress');
      if (error) { console.error('Project count error:', error); return null; }
      return count;
    },
    enabled: !!companyId,
  });

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse rounded-md h-10 w-80" style={{ background: '#ECEAF8' }} />
        <div className="animate-pulse rounded-md h-5 w-64" style={{ background: '#ECEAF8' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-[14px]" style={{ background: '#ECEAF8', height: 120 }} />
          ))}
        </div>
      </div>
    );
  }

  const payrollVariant: StatCardProps['variant'] =
    payrollStatus === 'Paid' ? 'success' : payrollStatus === 'Draft' ? 'warning' : 'default';

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-[26px] font-bold text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {today} · {employee?.company_name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isHrOrCeo && (
          <StatCard
            icon={<Users size={24} />}
            value={empCount ?? '—'}
            label="Active employees"
            loading={empLoading}
          />
        )}
        {isHrOrCeo && (
          <StatCard
            icon={<CalendarCheck size={24} />}
            value={attendanceUploaded === null ? '—' : attendanceUploaded ? 'Uploaded' : 'Not uploaded'}
            label="This month's attendance"
            variant={attendanceUploaded === null ? 'default' : attendanceUploaded ? 'success' : 'warning'}
            loading={attLoading}
          />
        )}
        {isFinanceOrCeo && (
          <StatCard
            icon={<DollarSign size={24} />}
            value={payrollStatus ?? '—'}
            label={`Payroll · ${currentMonthName}`}
            variant={payrollVariant}
            loading={payLoading}
          />
        )}
        <StatCard
          icon={<FolderKanban size={24} />}
          value={projectCount ?? '—'}
          label="Active projects"
          variant="accent"
          loading={projLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
