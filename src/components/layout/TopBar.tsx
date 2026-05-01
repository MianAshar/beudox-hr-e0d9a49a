import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import { useMobileSidebar } from './MobileSidebarContext';

const getPageTitle = (pathname: string): string => {
  if (pathname === '/employees/new') return 'Add Employee';
  if (pathname.match(/^\/employees\/[^/]+\/edit$/)) return 'Edit Employee';
  if (pathname.match(/^\/employees\/[^/]+$/)) return 'Employee Profile';
  return pageTitles[pathname] || 'Dashboard';
};

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
  '/holidays': 'Public Holidays',
  '/leave': 'Leave Management',
  '/payroll': 'Payroll',
  '/my-payslip': 'My Payslip',
  '/finance': 'Finance Sheet',
  '/loans': 'Loans',
  '/expenses': 'Office Expenses',
  '/outsourcing': 'Outsourcing',
  '/projects': 'Projects',
  '/projects-v2': 'Projects V2',
  '/clients': 'Clients',
  '/evaluations': 'Evaluations',
  '/evaluations/daily': 'Daily Evaluations',
  '/invoices': 'Invoices',
  '/hr-policies': 'HR Policies',
  '/job-descriptions': 'Job Descriptions',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/my-profile': 'My Profile',
  '/my-tasks': 'My Tasks',
};

const TopBar = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const { setOpen } = useMobileSidebar();

  return (
    <header
      className="h-14 lg:h-16 bg-card border-b flex items-center px-4 lg:px-6 gap-2"
      style={{ borderColor: '#D5D2EB' }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center h-11 w-11 -ml-2 rounded-md text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" strokeWidth={1.75} />
      </button>
      <div className="flex-1 min-w-0">
        <h1
          className="text-[20px] lg:text-[26px] font-bold text-foreground leading-tight truncate"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1.5 lg:gap-3 shrink-0">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
