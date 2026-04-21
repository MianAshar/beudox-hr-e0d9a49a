import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'employee' | 'team_lead' | 'hr_manager' | 'finance_manager' | 'ceo';

interface NotificationType {
  key: string;
  label: string;
  description: string;
  roles: Role[];
}

interface Category {
  emoji: string;
  title: string;
  types: NotificationType[];
}

const CATEGORIES: Category[] = [
  {
    emoji: '💰',
    title: 'Payroll Notifications',
    types: [
      { key: 'payroll_approved', label: 'Payroll Approved', description: 'When your monthly payroll is approved', roles: ['employee', 'finance_manager', 'ceo'] },
      { key: 'payroll_paid', label: 'Payroll Paid', description: 'When your salary payment is processed', roles: ['employee', 'finance_manager', 'ceo'] },
    ],
  },
  {
    emoji: '🏦',
    title: 'Loan Notifications',
    types: [
      { key: 'loan_granted', label: 'Loan Granted', description: 'When a loan is granted to you', roles: ['employee', 'finance_manager', 'ceo'] },
      { key: 'loan_settled', label: 'Loan Settled', description: 'When your loan is fully repaid', roles: ['employee', 'finance_manager', 'ceo'] },
    ],
  },
  {
    emoji: '🏖',
    title: 'Leave Notifications',
    types: [
      { key: 'leave_submitted', label: 'Leave Request Submitted', description: 'When an employee submits a leave request', roles: ['hr_manager', 'ceo'] },
      { key: 'leave_actioned', label: 'Leave Update', description: 'When your leave request is approved or rejected', roles: ['employee', 'team_lead', 'finance_manager', 'ceo'] },
    ],
  },
  {
    emoji: '📊',
    title: 'Evaluation Notifications',
    types: [
      { key: 'evaluation_submitted', label: 'Evaluation Submitted', description: 'When a new evaluation is submitted for you', roles: ['employee', 'team_lead', 'hr_manager', 'ceo'] },
    ],
  },
  {
    emoji: '👥',
    title: 'Employee Notifications',
    types: [
      { key: 'employee_onboarded', label: 'New Employee Added', description: 'When a new employee is added to the system', roles: ['hr_manager', 'ceo'] },
    ],
  },
  {
    emoji: '💼',
    title: 'Invoice Notifications',
    types: [
      { key: 'invoice_payment_received', label: 'Invoice Payment Received', description: 'When a payment is received on an invoice', roles: ['finance_manager', 'ceo'] },
    ],
  },
  {
    emoji: '📈',
    title: 'Salary Review Notifications',
    types: [
      { key: 'increment_due', label: 'Salary Review Due', description: 'When an employee is due for a salary review', roles: ['hr_manager', 'ceo'] },
      { key: 'increment_approved', label: 'Increment Approved', description: 'When a salary increment is approved', roles: ['employee', 'ceo'] },
    ],
  },
];

interface PrefRow {
  notification_type: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
}

const NotificationPreferencesTab = () => {
  const { employee } = useAuth();
  const role = (employee?.role_name || 'employee') as Role;

  const [loading, setLoading] = useState(true);
  const [globalInApp, setGlobalInApp] = useState(true);
  const [globalEmail, setGlobalEmail] = useState(true);
  const [prefs, setPrefs] = useState<Record<string, { in_app: boolean; email: boolean }>>({});

  const visibleCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        types: cat.types.filter((t) => t.roles.some(r => roles.includes(r))),
      })).filter((cat) => cat.types.length > 0),
    [role],
  );

  useEffect(() => {
    if (!employee?.employee_id) return;
    (async () => {
      const [empRes, prefRes] = await Promise.all([
        supabase
          .from('employees')
          .select('in_app_notifications_enabled, notifications_enabled')
          .eq('id', employee.employee_id)
          .single(),
        supabase
          .from('notification_preferences')
          .select('notification_type, in_app_enabled, email_enabled')
          .eq('employee_id', employee.employee_id),
      ]);

      if (empRes.data) {
        setGlobalInApp((empRes.data as any).in_app_notifications_enabled ?? true);
        setGlobalEmail((empRes.data as any).notifications_enabled ?? true);
      }

      const map: Record<string, { in_app: boolean; email: boolean }> = {};
      (prefRes.data as PrefRow[] | null)?.forEach((row) => {
        map[row.notification_type] = {
          in_app: row.in_app_enabled ?? true,
          email: row.email_enabled ?? true,
        };
      });
      setPrefs(map);
      setLoading(false);
    })();
  }, [employee?.employee_id]);

  const updateGlobal = async (channel: 'in_app' | 'email', value: boolean) => {
    const prev = channel === 'in_app' ? globalInApp : globalEmail;
    if (channel === 'in_app') setGlobalInApp(value);
    else setGlobalEmail(value);

    const update =
      channel === 'in_app'
        ? { in_app_notifications_enabled: value }
        : { notifications_enabled: value };

    const { error } = await supabase
      .from('employees')
      .update(update as any)
      .eq('id', employee!.employee_id);

    if (error) {
      if (channel === 'in_app') setGlobalInApp(prev);
      else setGlobalEmail(prev);
      toast.error('Failed to update preference');
    } else {
      toast.success('Preference updated');
    }
  };

  const updateTypePref = async (type: string, channel: 'in_app' | 'email', value: boolean) => {
    const current = prefs[type] || { in_app: true, email: true };
    const next = { ...current, [channel]: value };
    setPrefs((p) => ({ ...p, [type]: next }));

    const { error } = await supabase
      .from('notification_preferences')
      .upsert(
        {
          employee_id: employee!.employee_id,
          company_id: employee!.company_id,
          notification_type: type,
          in_app_enabled: next.in_app,
          email_enabled: next.email,
        } as any,
        { onConflict: 'employee_id,notification_type' },
      );

    if (error) {
      setPrefs((p) => ({ ...p, [type]: current }));
      toast.error('Failed to save preference');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      {/* Section 1 — Global channel toggles */}
      <div className="bg-card rounded-[14px] border p-6">
        <h3
          className="font-display font-semibold text-[15px] text-foreground mb-4"
          style={{ fontFamily: 'var(--ff-display)' }}
        >
          Notification Channels
        </h3>
        <p className="text-[12px] text-muted-foreground mb-4">
          Turn off to stop receiving all notifications of that type
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label className="text-[13px] font-medium">In-App Notifications</Label>
                <p className="text-[11px] text-muted-foreground">Show alerts in the notification bell</p>
              </div>
            </div>
            <Switch checked={globalInApp} onCheckedChange={(v) => updateGlobal('in_app', v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label className="text-[13px] font-medium">Email Notifications</Label>
                <p className="text-[11px] text-muted-foreground">Receive notifications by email</p>
              </div>
            </div>
            <Switch checked={globalEmail} onCheckedChange={(v) => updateGlobal('email', v)} />
          </div>
        </div>
      </div>

      {/* Section 2 — Per-type preferences */}
      {visibleCategories.map((cat) => (
        <div key={cat.title} className="bg-card rounded-[14px] border p-6">
          <h3
            className="font-display font-semibold text-[15px] text-foreground mb-4 flex items-center gap-2"
            style={{ fontFamily: 'var(--ff-display)' }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.title}</span>
          </h3>

          {/* Header row */}
          <div className="flex items-center gap-3 px-3 pb-2 border-b">
            <div className="flex-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Notification
            </div>
            <div className="w-20 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              In-App
            </div>
            <div className="w-20 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </div>
          </div>

          <div className="divide-y">
            {cat.types.map((t) => {
              const p = prefs[t.key] || { in_app: true, email: true };
              return (
                <div key={t.key} className="flex items-center gap-3 px-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{t.label}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{t.description}</p>
                  </div>
                  <div className="w-20 flex justify-center">
                    <Switch
                      checked={p.in_app}
                      disabled={!globalInApp}
                      onCheckedChange={(v) => updateTypePref(t.key, 'in_app', v)}
                    />
                  </div>
                  <div className="w-20 flex justify-center">
                    <Switch
                      checked={p.email}
                      disabled={!globalEmail}
                      onCheckedChange={(v) => updateTypePref(t.key, 'email', v)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPreferencesTab;
