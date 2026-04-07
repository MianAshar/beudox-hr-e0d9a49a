import { useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

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
  '/clients': 'Clients',
  '/evaluations': 'Evaluations',
  '/evaluations/daily': 'Daily Evaluations',
  '/invoices': 'Invoices',
  '/hr-policies': 'HR Policies',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
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
      <NotificationBell />
    </header>
  );
};

export default TopBar;
