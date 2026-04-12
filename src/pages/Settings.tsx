import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CompanyTab from '@/components/settings/CompanyTab';
import AttendanceTab from '@/components/settings/AttendanceTab';
import DepartmentsTab from '@/components/settings/DepartmentsTab';
import EvaluationParametersTab from '@/components/settings/EvaluationParametersTab';
import RolesTab from '@/components/settings/RolesTab';
import DangerZoneTab from '@/components/settings/DangerZoneTab';
import ExpenseCategoriesTab from '@/components/settings/ExpenseCategoriesTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import LeaveTypesTab from '@/components/settings/LeaveTypesTab';

const Settings = () => {
  const { employee } = useAuth();
  const role = employee?.role_name;
  const isCeo = role === 'ceo';
  const isFinance = role === 'finance_manager';
  const isHr = role === 'hr_manager';

  // Only CEO, Finance Manager, and HR Manager can access Settings
  if (!isCeo && !isFinance && !isHr) {
    return (
      <div className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--ff-body)' }}>
        Settings are only accessible to the CEO, HR Manager, and Finance Manager.
      </div>
    );
  }

  const tabs = [
    ...(isCeo
      ? [
          { value: 'company', label: 'Company' },
          { value: 'attendance', label: 'Attendance' },
          { value: 'departments', label: 'Departments' },
          { value: 'eval-params', label: 'Evaluation Parameters' },
          { value: 'roles', label: 'Roles' },
        ]
      : []),
    ...(!isHr ? [{ value: 'expense-categories', label: 'Expense Categories' }] : []),
    ...(isCeo || isHr ? [{ value: 'leave-types', label: 'Leave Types' }] : []),
    ...(isCeo ? [{ value: 'notifications', label: 'Notifications' }] : []),
    ...(isCeo ? [{ value: 'danger', label: 'Danger Zone' }] : []),
  ];

  const defaultTab = isCeo ? 'company' : isHr ? 'leave-types' : 'expense-categories';

  return (
    <div className="space-y-6">

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start" style={{ borderColor: 'hsl(var(--border))' }}>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {isCeo && (
          <>
            <TabsContent value="company" className="mt-6"><CompanyTab /></TabsContent>
            <TabsContent value="attendance" className="mt-6"><AttendanceTab /></TabsContent>
            <TabsContent value="departments" className="mt-6"><DepartmentsTab /></TabsContent>
            <TabsContent value="eval-params" className="mt-6"><EvaluationParametersTab /></TabsContent>
            <TabsContent value="roles" className="mt-6"><RolesTab /></TabsContent>
          </>
        )}
        <TabsContent value="expense-categories" className="mt-6">
          <ExpenseCategoriesTab />
        </TabsContent>
        {(isCeo || role === 'hr_manager') && (
          <TabsContent value="leave-types" className="mt-6"><LeaveTypesTab /></TabsContent>
        )}
        {isCeo && (
          <TabsContent value="notifications" className="mt-6"><NotificationsTab /></TabsContent>
        )}
        {isCeo && (
          <TabsContent value="danger" className="mt-6"><DangerZoneTab /></TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
