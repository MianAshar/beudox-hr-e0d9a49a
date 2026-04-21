import { ReactNode, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';
import { useAuth } from '@/hooks/useAuth';
import { checkReviewAlerts } from '@/lib/review-alerts';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { employee } = useAuth();
  const roles = employee?.roles ?? [];
  const isHrOrCeo = ['hr_manager', 'ceo'].some(r => roles.includes(r));

  useEffect(() => {
    if (employee?.company_id && isHrOrCeo) {
      checkReviewAlerts(employee.company_id);
    }
  }, [employee?.company_id, isHrOrCeo]);

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
