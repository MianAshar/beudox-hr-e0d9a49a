import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import CompanyTab from '@/components/settings/CompanyTab';
import AttendanceTab from '@/components/settings/AttendanceTab';
import DepartmentsTab from '@/components/settings/DepartmentsTab';
import EvaluationParametersTab from '@/components/settings/EvaluationParametersTab';
import RolesTab from '@/components/settings/RolesTab';
import DangerZoneTab from '@/components/settings/DangerZoneTab';
import ExpenseCategoriesTab from '@/components/settings/ExpenseCategoriesTab';
import LeaveTypesTab from '@/components/settings/LeaveTypesTab';

import LoginLogsTab from '@/components/settings/LoginLogsTab';
import LeaveOverwriteLogTab from '@/components/settings/LeaveOverwriteLogTab';
import ManualAttendanceLogTab from '@/components/settings/ManualAttendanceLogTab';

const Settings = () => {
  const { employee } = useAuth();
  const roles = employee?.roles ?? [];
  const isCeo = roles.includes('ceo');
  const isFinance = roles.includes('finance_manager');
  const isHr = roles.includes('hr_manager');

  // Only CEO, Finance Manager, and HR Manager can access Settings
  if (!isCeo && !isFinance && !isHr) {
    return (
      <div className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--ff-body)' }}>
        Settings are only accessible to the CEO, HR Manager, and Finance Manager.
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState(
    isCeo ? 'company' : isHr ? 'attendance' : 'expense-categories'
  );

  const navGroups = [
    ...(isCeo || isHr ? [{
      label: 'General',
      items: [
        ...(isCeo ? [{ value: 'company', label: 'Company' }] : []),
        ...(isCeo ? [{ value: 'departments', label: 'Departments' }] : []),
        ...(isCeo ? [{ value: 'roles', label: 'Roles' }] : []),
      ],
    }] : []),
    {
      label: 'HR',
      items: [
        ...(isCeo || isHr ? [{ value: 'attendance', label: 'Attendance & Payroll' }] : []),
        ...(isCeo || isHr ? [{ value: 'leave-types', label: 'Leave Types' }] : []),
        ...(isCeo || isHr ? [{ value: 'eval-params', label: 'Employee Review Parameters' }] : []),
      ],
    },
    ...(isCeo || isFinance ? [{
      label: 'Finance',
      items: [
        { value: 'expense-categories', label: 'Expense Categories' },
      ],
    }] : []),
    ...(isCeo || isHr ? [{
      label: 'Logs',
      items: [
        { value: 'login-logs', label: 'Login Logs' },
        { value: 'leave-overwrites', label: 'Leave Overwrite Log' },
        { value: 'manual-attendance-logs', label: 'Manual Attendance Log' },
      ],
    }] : []),
    ...(isCeo ? [{
      label: 'System',
      items: [
        { value: 'danger', label: 'Danger Zone' },
      ],
    }] : []),
  ].filter(g => g.items.length > 0);

  return (
    <div className="flex gap-8 min-h-screen">
      {/* Left nav panel */}
      <div className="w-52 shrink-0">
        <nav className="sticky top-6 space-y-1">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
              {group.items.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    activeTab === item.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  style={{ fontFamily: 'var(--ff-body)' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="w-px bg-border shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isCeo && activeTab === 'company' && <CompanyTab />}
        {(isCeo || isHr) && activeTab === 'attendance' && <AttendanceTab />}
        {isCeo && activeTab === 'departments' && <DepartmentsTab />}
        {(isCeo || isHr) && activeTab === 'eval-params' && <EvaluationParametersTab />}
        {isCeo && activeTab === 'roles' && <RolesTab />}
        {(isCeo || isFinance) && activeTab === 'expense-categories' && <ExpenseCategoriesTab />}
        {(isCeo || isHr) && activeTab === 'leave-types' && <LeaveTypesTab />}
        {(isCeo || isHr) && activeTab === 'login-logs' && <LoginLogsTab />}
        {(isCeo || isHr) && activeTab === 'leave-overwrites' && <LeaveOverwriteLogTab />}
        {(isCeo || isHr) && activeTab === 'manual-attendance-logs' && <ManualAttendanceLogTab />}
        {isCeo && activeTab === 'danger' && <DangerZoneTab />}
      </div>
    </div>
  );
};

export default Settings;
