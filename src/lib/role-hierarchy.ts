/**
 * Role hierarchy helpers.
 *
 * HR Manager cannot manage CEO or Director-level employees:
 *   - Cannot edit, deactivate or delete them
 *   - Cannot change their role
 *   - Cannot view their salary fields
 *
 * CEO has no such restrictions.
 */

type EmployeeLike = {
  employment_type?: string | null;
  employee_roles?: Array<{ roles?: { name?: string | null } | null }> | null;
};

/** Returns true if the target employee holds the CEO role. */
export const isCeoEmployee = (target: EmployeeLike | null | undefined): boolean => {
  if (!target?.employee_roles) return false;
  return target.employee_roles.some(er => er?.roles?.name === 'ceo');
};

/** Returns true if the target employee is a director (employment_type). */
export const isDirectorEmployee = (target: EmployeeLike | null | undefined): boolean => {
  return target?.employment_type === 'director';
};

/** Returns true if the target is protected from HR Manager (CEO or Director). */
export const isProtectedFromHr = (target: EmployeeLike | null | undefined): boolean => {
  return isCeoEmployee(target) || isDirectorEmployee(target);
};

/**
 * Returns true if the viewer is allowed to manage (edit/deactivate/delete/change role of)
 * the target employee. CEOs can manage anyone. HR Managers cannot manage CEOs/Directors.
 * Other roles default to false here — call sites still gate on their own permission rules.
 */
export const canManageEmployee = (
  viewerRoles: string[] | null | undefined,
  target: EmployeeLike | null | undefined,
): boolean => {
  const roles = viewerRoles ?? [];
  if (roles.includes('ceo')) return true;
  if (roles.includes('hr_manager')) return !isProtectedFromHr(target);
  return false;
};

/**
 * Returns true if the viewer can see salary/compensation of the target.
 * CEO sees all. HR Manager sees all except CEOs and Directors.
 */
export const canViewCompensation = (
  viewerRoles: string[] | null | undefined,
  target: EmployeeLike | null | undefined,
): boolean => {
  const roles = viewerRoles ?? [];
  if (roles.includes('ceo')) return true;
  if (roles.includes('hr_manager')) return !isProtectedFromHr(target);
  return false;
};
