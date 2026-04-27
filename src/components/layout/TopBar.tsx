import { useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';

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

  return (
    <header
      className="h-16 bg-card border-b flex items-center px-6"
      style={{ borderColor: '#D5D2EB' }}
    >
      <div className="flex-1">
        <h1
          className="text-[26px] font-bold text-foreground leading-tight"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
