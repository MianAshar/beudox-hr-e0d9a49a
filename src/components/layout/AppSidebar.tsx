import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccess } from '@/lib/role-access';
import BeudoxLogo from '@/components/BeudoxLogo';

import {
  LayoutDashboard, Users, CalendarCheck, Calendar, CalendarOff,
  DollarSign, BarChart2, CreditCard, Receipt, Building2,
  FolderKanban, ClipboardCheck, ClipboardList, FileText, Settings, Bell, FileSpreadsheet,
  ChevronLeft, ChevronRight, Briefcase, Wallet,
} from 'lucide-react';

const navSections = [
  {
    label: 'MAIN',
    items: [
      { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ],
  },
  {
    label: 'PEOPLE',
    items: [
      { title: 'Employees', icon: Users, path: '/employees' },
      // { title: 'Attendance', icon: CalendarCheck, path: '/attendance' },
      { title: 'Public Holidays', icon: Calendar, path: '/holidays' },
      { title: 'Leave Management', icon: CalendarOff, path: '/leave' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { title: 'Payroll', icon: DollarSign, path: '/payroll' },
      { title: 'Invoices', icon: FileSpreadsheet, path: '/invoices' },
      { title: 'Finance Sheet', icon: BarChart2, path: '/finance' },
      { title: 'Loans', icon: CreditCard, path: '/loans' },
      // { title: 'Office Expenses', icon: Receipt, path: '/expenses' },
      // { title: 'Outsourcing', icon: Building2, path: '/outsourcing' },
    ],
  },
  {
    label: 'WORK',
    items: [
      { title: 'Projects', icon: FolderKanban, path: '/projects' },
      { title: 'Clients', icon: Briefcase, path: '/clients' },
      { title: 'Evaluations', icon: ClipboardCheck, path: '/evaluations' },
      { title: 'Daily Evaluations', icon: ClipboardList, path: '/evaluations/daily' },
      { title: 'HR Policies', icon: FileText, path: '/hr-policies' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { title: 'My Payslip', icon: Wallet, path: '/my-payslip' },
      { title: 'Notifications', icon: Bell, path: '/notifications' },
      { title: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { employee } = useAuth();

  const isActive = (path: string) => {
    // Exact match for paths that have sub-paths sharing prefixes
    if (path === '/evaluations') return location.pathname === '/evaluations' || (location.pathname.startsWith('/evaluations/') && !location.pathname.startsWith('/evaluations/daily'));
    if (path === '/evaluations/daily') return location.pathname.startsWith('/evaluations/daily');
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  const width = collapsed ? 64 : 240;
  const companyLogo = employee?.company_logo_url || null;

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-[250ms] ease-in-out"
      style={{ width, backgroundColor: '#1A1240' }}
    >
      {/* Logo + collapse toggle */}
      <div
        className={`flex items-center border-b ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          height: 56,
          paddingLeft: collapsed ? 0 : 16,
          paddingRight: collapsed ? 0 : 16,
        }}
      >
        {!collapsed && (
          <div className="flex items-center" style={{ height: 56, flex: 1, minWidth: 0 }}>
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={employee?.company_name || 'Company'}
                style={{
                  maxHeight: 36,
                  maxWidth: 150,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'left center',
                }}
              />
            ) : employee?.company_name ? (
              <span
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit, var(--ff-display), sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {employee.company_name}
              </span>
            ) : (
              <BeudoxLogo variant="sidebar" size={36} />
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/40 hover:text-white/70 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
          ) : (
            <ChevronLeft className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item => canAccess(employee?.role_name, item.path));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              {!collapsed && (
                <div
                  className="px-5 mb-2 text-[10px] font-medium uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(255,255,255,0.50)', fontFamily: 'var(--ff-body)' }}
                >
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center h-10 transition-all duration-[var(--transition-fast)] ${
                        collapsed ? 'justify-center px-0' : 'px-5'
                      } ${
                        active
                          ? 'text-white border-l-[3px] rounded-r-lg'
                          : 'text-white/75 hover:text-white hover:bg-white/[0.08] border-l-[3px] border-transparent'
                      }`}
                      style={{
                        backgroundColor: active ? 'rgba(91,63,248,0.25)' : undefined,
                        borderLeftColor: active ? '#5B3FF8' : 'transparent',
                      }}
                    >
                      <item.icon className="h-5 w-5 shrink-0" style={{ strokeWidth: 1.5 }} />
                      {!collapsed && (
                        <span className="ml-3 text-[13px] font-normal" style={{ fontFamily: 'var(--ff-body)' }}>
                          {item.title}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
