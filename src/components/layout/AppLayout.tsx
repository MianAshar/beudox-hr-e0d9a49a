import { ReactNode, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';
import { useAuth } from '@/hooks/useAuth';
import { checkReviewAlerts } from '@/lib/review-alerts';
import { MobileSidebarProvider } from './MobileSidebarContext';
import { SidebarProvider, useSidebarCollapsed } from '@/contexts/SidebarContext';

const AppLayoutInner = ({ children }: { children: ReactNode }) => {
  const { employee } = useAuth();
  const { collapsed } = useSidebarCollapsed();

  useEffect(() => {
    if (!employee?.company_id) return;
    const id = window.setTimeout(() => {
      checkReviewAlerts(employee.company_id).catch((err) => {
        console.error('Review alert check failed (non-blocking):', err);
      });
    }, 0);
    return () => window.clearTimeout(id);
  }, [employee?.company_id]);

  return (
    <MobileSidebarProvider>
      <div className="min-h-screen flex">
        <AppSidebar />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-[250ms] ${collapsed ? 'lg:ml-[64px]' : 'lg:ml-[240px]'}`}>
          <TopBar />
          <main className="flex-1 bg-background p-4 lg:p-6">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SidebarProvider>
  );
};

export default AppLayout;
