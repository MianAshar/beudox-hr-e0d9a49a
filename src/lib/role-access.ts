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
    '/job-descriptions',
    '/holidays',
    '/loans',
    '/leave',
    '/my-payslip',
    '/my-tasks',
  ],
  hr_manager: [
    '/dashboard',
    '/employees',
    '/attendance',
    '/holidays',
    '/leave',
    '/evaluations',
    '/evaluations/daily',
    '/hr-policies',
    '/job-descriptions',
    '/loans',
    '/my-payslip',
    '/settings',
  ],
  finance_manager: [
    '/dashboard',
    '/employees',
    '/attendance',
    '/holidays',
    '/payroll',
    '/finance',
    '/loans',
    '/leave',
    '/expenses',
    '/outsourcing',
    '/hr-policies',
    '/job-descriptions',
    '/my-payslip',
    '/my-tasks',
    '/settings',
  ],
  team_lead: [
    '/dashboard',
    '/attendance',
    '/holidays',
    '/projects',
    '/evaluations',
    '/evaluations/daily',
    '/hr-policies',
    '/job-descriptions',
    '/loans',
    '/leave',
    '/my-payslip',
    '/my-tasks',
  ],
};

/** Normalise input into a roles array. Accepts a single role string, array, null/undefined. */
function toRoles(roles: string | string[] | null | undefined): string[] {
  if (!roles) return [];
  return Array.isArray(roles) ? roles : [roles];
}

/**
 * Check whether the user (with one or more roles) can access a given path.
 * Access is granted if ANY of the user's roles allows the path.
 * Supports exact match or starts-with for sub-routes like /employees/:id.
 */
export function canAccess(roles: string | string[] | null | undefined, path: string): boolean {
  const list = toRoles(roles);
  if (list.length === 0) return false;
  if (list.includes('ceo')) return true;

  return list.some(role => {
    const allowed = roleRoutes[role as Exclude<AppRole, 'ceo'>];
    if (!allowed) return false;
    return allowed.some(r => path === r || path.startsWith(r + '/'));
  });
}

/** Returns true if the user holds the given role. */
export function hasRole(roles: string | string[] | null | undefined, role: string): boolean {
  return toRoles(roles).includes(role);
}

/** Returns true if the user has any of the listed roles. */
export function hasAnyRole(roles: string | string[] | null | undefined, rolesToCheck: string[]): boolean {
  return toRoles(roles).some(r => rolesToCheck.includes(r));
}
