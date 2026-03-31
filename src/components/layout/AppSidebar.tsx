import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccess } from '@/lib/role-access';
import BeudoxLogo from '@/components/BeudoxLogo';
import {
  LayoutDashboard, Users, CalendarCheck, Calendar, CalendarOff,
  DollarSign, BarChart2, CreditCard, Receipt, Briefcase,
  FolderKanban, ClipboardCheck, FileText, Settings, Bell,
  LogOut, ChevronLeft, ChevronRight,
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
      { title: 'Attendance', icon: CalendarCheck, path: '/attendance' },
      { title: 'Public Holidays', icon: Calendar, path: '/holidays' },
      { title: 'Leave Management', icon: CalendarOff, path: '/leave' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { title: 'Payroll', icon: DollarSign, path: '/payroll' },
      { title: 'Finance Sheet', icon: BarChart2, path: '/finance' },
      { title: 'Loans', icon: CreditCard, path: '/loans' },
      { title: 'Office Expenses', icon: Receipt, path: '/expenses' },
      { title: 'Outsourcing', icon: Briefcase, path: '/outsourcing' },
    ],
  },
  {
    label: 'WORK',
    items: [
      { title: 'Projects', icon: FolderKanban, path: '/projects' },
      { title: 'Evaluations', icon: ClipboardCheck, path: '/evaluations' },
      { title: 'HR Policies', icon: FileText, path: '/hr-policies' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { title: 'Notifications', icon: Bell, path: '/notifications' },
      { title: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { employee, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const width = collapsed ? 64 : 240;
  const companyLogo = employee?.company_logo_url || null;

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-[250ms] ease-in-out"
      style={{ width, backgroundColor: '#1A1240' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={employee?.company_name || 'Company'}
            style={{
              height: 32,
              width: 'auto',
              maxWidth: collapsed ? 32 : 140,
              objectFit: 'contain',
            }}
          />
        ) : collapsed ? (
          <BeudoxLogo variant="sidebar" showWordmark={false} size={32} />
        ) : (
          <BeudoxLogo variant="sidebar" size={36} />
        )}
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
                  className="px-5 mb-2 text-[9px] font-medium uppercase tracking-[0.12em]"
                  style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--ff-body)' }}
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
                      className={`flex items-center h-10 transition-all duration-[var(--transition-fast)] ${
                        collapsed ? 'justify-center px-0' : 'px-5'
                      } ${
                        active
                          ? 'text-white border-l-[3px]'
                          : 'text-white/40 hover:text-white/70 border-l-[3px] border-transparent'
                      }`}
                      style={{
                        backgroundColor: active ? 'rgba(91,63,248,0.20)' : 'transparent',
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

      {/* User zone */}
      <div className="border-t px-5 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {!collapsed && employee && (
          <div className="mb-3">
            <div className="text-xs font-medium text-white truncate" style={{ fontFamily: 'var(--ff-body)' }}>
              {employee.full_name}
            </div>
            <div className="text-[10px] text-white/40 truncate" style={{ fontFamily: 'var(--ff-body)' }}>
              {employee.role_name || employee.designation || 'Employee'}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={signOut}
            className="text-white/40 hover:text-white/70 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white/70 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
            ) : (
              <ChevronLeft className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
