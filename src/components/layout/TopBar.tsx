import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
  '/holidays': 'Public Holidays',
  '/leave': 'Leave Management',
  '/payroll': 'Payroll',
  '/finance': 'Finance Sheet',
  '/loans': 'Loans',
  '/expenses': 'Office Expenses',
  '/outsourcing': 'Outsourcing',
  '/projects': 'Projects',
  '/evaluations': 'Evaluations',
  '/hr-policies': 'HR Policies',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header
      className="h-16 bg-card border-b flex items-center px-6"
      style={{ borderColor: '#D5D2EB' }}
    >
      <div>
        <h1
          className="text-[26px] font-bold text-foreground leading-tight"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          {title}
        </h1>
      </div>
    </header>
  );
};

export default TopBar;
