import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      {/* Main content offset by sidebar width — uses ml-16 as base (collapsed) and sidebar manages its own width */}
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
