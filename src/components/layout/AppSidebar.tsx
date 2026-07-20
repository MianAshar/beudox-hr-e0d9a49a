import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccess } from '@/lib/role-access';
import { formatRole } from '@/lib/format-role';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BeudoxLogo from '@/components/BeudoxLogo';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsBelowLg } from '@/hooks/use-breakpoint';
import { useMobileSidebar } from './MobileSidebarContext';

import {
  LayoutDashboard, Users, CalendarCheck, Calendar, CalendarOff,
  DollarSign, BarChart2, CreditCard, Receipt, Building2,
  FolderKanban, ClipboardCheck, ClipboardList, FileText, Settings, FileSpreadsheet,
  ChevronLeft, ChevronRight, Briefcase, Wallet, ListChecks,
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
      { title: 'My Tasks', icon: ListChecks, path: '/my-tasks' },
      { title: 'Clients', icon: Briefcase, path: '/clients' },
      { title: 'Evaluations', icon: ClipboardCheck, path: '/evaluations' },
      { title: 'Daily Evaluations', icon: ClipboardList, path: '/evaluations/daily' },
      { title: 'HR Policies', icon: FileText, path: '/hr-policies' },
      { title: 'Job Descriptions', icon: FileText, path: '/job-descriptions' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { title: 'My Payslip', icon: Wallet, path: '/my-payslip' },
      { title: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

interface SidebarBodyProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  showCollapseToggle: boolean;
}

const SidebarBody = ({ collapsed, onToggleCollapse, onNavigate, showCollapseToggle }: SidebarBodyProps) => {
  const location = useLocation();
  const { employee } = useAuth();

  const isActive = (path: string) => {
    if (path === '/evaluations') return location.pathname === '/evaluations' || (location.pathname.startsWith('/evaluations/') && !location.pathname.startsWith('/evaluations/daily'));
    if (path === '/evaluations/daily') return location.pathname.startsWith('/evaluations/daily');
    if (path === '/projects') return location.pathname === '/projects' || location.pathname.startsWith('/projects/');
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  const companyLogo = employee?.company_logo_url || null;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#1A1240' }}>
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
        {showCollapseToggle && (
          <button
            onClick={onToggleCollapse}
            className="text-white/40 hover:text-white/70 transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
            ) : (
              <ChevronLeft className="h-5 w-5" style={{ strokeWidth: 1.5 }} />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item => canAccess(employee?.roles, item.path));
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
                      onClick={onNavigate}
                      className={`group flex items-center h-11 transition-all duration-[var(--transition-fast)] ${
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

      {/* User zone footer */}
      {employee && (
        <div
          className="border-t shrink-0"
          style={{
            borderColor: 'rgba(255,255,255,0.10)',
            padding: collapsed ? '12px 0' : '12px 16px',
          }}
        >
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <Avatar className="h-8 w-8 shrink-0">
              {employee.avatar_url && <AvatarImage src={employee.avatar_url} alt={employee.full_name} />}
              <AvatarFallback
                className="text-[11px] font-semibold"
                style={{ background: 'rgba(91,63,248,0.35)', color: '#FFFFFF', fontFamily: 'var(--ff-display)' }}
              >
                {employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p
                  className="text-[12px] font-medium truncate"
                  style={{ color: '#FFFFFF', fontFamily: 'var(--ff-body)' }}
                >
                  {employee.full_name}
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--ff-body)' }}
                  title={(employee.roles ?? []).map(formatRole).join(' · ')}
                >
                  {employee.roles && employee.roles.length > 0
                    ? employee.roles.map(formatRole).join(' · ')
                    : employee.designation || 'Employee'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsBelowLg();
  const { open, setOpen } = useMobileSidebar();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[280px] sm:max-w-[280px] border-0"
          style={{ backgroundColor: '#1A1240' }}
        >
          <SidebarBody
            collapsed={false}
            onToggleCollapse={() => {}}
            onNavigate={() => setOpen(false)}
            showCollapseToggle={false}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-[250ms] ease-in-out"
      style={{ width: collapsed ? 64 : 240 }}
    >
      <SidebarBody
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        showCollapseToggle
      />
    </aside>
  );
};

export default AppSidebar;
