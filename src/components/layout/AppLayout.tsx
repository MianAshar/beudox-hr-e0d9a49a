import { ReactNode, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';
import { useAuth } from '@/hooks/useAuth';
import { checkReviewAlerts } from '@/lib/review-alerts';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { employee } = useAuth();

  useEffect(() => {
    if (!employee?.company_id) return;
    // Run async, non-blocking. Defer to after paint so it never delays render.
    const id = window.setTimeout(() => {
      checkReviewAlerts(employee.company_id).catch((err) => {
        console.error('Review alert check failed (non-blocking):', err);
      });
    }, 0);
    return () => window.clearTimeout(id);
  }, [employee?.company_id]);

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-16 lg:ml-[240px]">
        <TopBar />
        <main className="flex-1 bg-background p-6">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
