// Centralised role → route access map
// Roles: 'employee' | 'hr_manager' | 'finance_manager' | 'team_lead' | 'ceo'

export type AppRole = 'employee' | 'hr_manager' | 'finance_manager' | 'team_lead' | 'ceo';

/** Routes each role may access. CEO gets everything so is handled separately. */
const roleRoutes: Record<Exclude<AppRole, 'ceo'>, string[]> = {
  employee: [
    '/dashboard',
    '/attendance',
    '/projects',
    '/evaluations',
    '/evaluations/daily',
    '/hr-policies',
    '/holidays',
    '/loans',
    '/leave',
    '/my-payslip',
    '/notifications',
  ],
  hr_manager: [
    '/dashboard',
    '/employees',
    '/attendance',
    '/holidays',
    '/leave',
    '/projects',
    '/clients',
    '/evaluations',
    '/evaluations/daily',
    '/hr-policies',
    '/loans',
    '/my-payslip',
    '/notifications',
    '/settings',
  ],
  finance_manager: [
    '/dashboard',
    '/employees',
    '/attendance',
    '/payroll',
    '/invoices',
    '/finance',
    '/loans',
    '/leave',
    '/expenses',
    '/outsourcing',
    '/hr-policies',
    '/my-payslip',
    '/notifications',
    '/settings',
  ],
  team_lead: [
    '/dashboard',
    '/attendance',
    '/projects',
    '/evaluations',
    '/evaluations/daily',
    '/hr-policies',
    '/loans',
    '/leave',
    '/my-payslip',
    '/notifications',
  ],
};

/** Check whether a role can access a given path (exact or starts-with for sub-routes like /employees/:id). */
export function canAccess(role: string | null | undefined, path: string): boolean {
  if (!role) return false;
  if (role === 'ceo') return true;

  const allowed = roleRoutes[role as Exclude<AppRole, 'ceo'>];
  if (!allowed) return false;

  return allowed.some(r => path === r || path.startsWith(r + '/'));
}
