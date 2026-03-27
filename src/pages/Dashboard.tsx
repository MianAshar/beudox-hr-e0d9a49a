import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { employee, loading } = useAuth();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bx-skeleton h-10 w-80" />
        <div className="bx-skeleton h-5 w-48" />
        <div className="bx-skeleton h-40 w-full" />
      </div>
    );
  }

  const firstName = employee?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-[26px] font-bold text-foreground"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Welcome back, {firstName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Empty state */}
      <div className="rounded-[14px] border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
        <h3
          className="text-base font-semibold text-foreground mb-1"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Your dashboard is being built
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Stats, charts, and quick actions will appear here soon. For now, explore the sidebar navigation.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
