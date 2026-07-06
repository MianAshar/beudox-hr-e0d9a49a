## Plan: Allow one user to fully use multiple roles

### Goal
A user with both `hr_manager` and `finance_manager` should receive the combined permissions of both roles, instead of being limited to whichever role is ranked first.

### What I found
- The frontend already loads all roles into `employee.roles` and most route/UI checks use that array.
- The remaining core problem is database RLS policies still using `get_employee_role_for_auth(auth.uid())`, which returns only one highest-priority role.
- This can block access whenever a user has multiple roles and the required role is not the highest-priority one.

### Implementation steps
1. **Update database policies to use multi-role helpers**
   - Replace role checks like:
     - `get_employee_role_for_auth(auth.uid()) IN (...)`
     - `get_employee_role_for_auth(auth.uid()) = '...'`
   - With:
     - `auth_has_any_role(auth.uid(), ARRAY[...])` for multi-role access
     - `auth_has_role(auth.uid(), '...')` for single-role access
   - Preserve all existing company/employee ownership restrictions.

2. **Cover all affected modules, not only Expenses**
   - Finance: invoices, invoice payments, invoice line items, payroll records, loans, expenses.
   - HR: employees, employee roles, attendance, leave, evaluations, HR documents, settings-related tables.
   - Projects/clients/tasks where HR, finance, team lead, and CEO checks appear.
   - CEO-only policies remain CEO-only, but will check whether the user has the CEO role instead of whether CEO is the single returned role.

3. **Frontend audit for single-role usage**
   - Keep using `employee.roles` for route access and sidebar visibility.
   - Replace any remaining permission logic that depends on `employee.role_name` with `employee.roles` where it controls access.
   - Keep `role_name` only for display/backward compatibility if needed.

4. **Verify**
   - Run the Supabase linter after the migration.
   - Confirm no active RLS policies still depend on `get_employee_role_for_auth(auth.uid())` for permission checks.
   - Confirm finance + HR users can access and manage both finance and HR modules.