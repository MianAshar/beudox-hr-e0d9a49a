## Changes

### 1. Hide Projects module from HR Manager (and confirm Finance Manager)
In `src/lib/role-access.ts`:
- Remove `'/projects'` and `'/projects-v2'` from the `hr_manager` routes list.
- `finance_manager` already does not include projects — no change.
- This automatically hides Projects + Projects V2 from the sidebar (filtered via `canAccess`) and blocks direct URL access for those roles. CEO, Team Lead, and Employee remain unchanged.

### 2. Update role labels to Pascal/short form
In `src/lib/format-role.ts`, update `ROLE_LABELS`:
- `ceo` → `CEO`
- `finance_manager` → `Finance` (was "Finance Manager")
- `hr_manager` → `HR` (was "HR Manager")
- `team_lead` → `Team Lead`
- `employee` → `Employee`

This label change propagates everywhere `formatRole()` is used (profile, tables, badges, etc.).

### 3. Roles dropdown in Employees form — fixed order + proper labels
In `src/pages/EmployeeForm.tsx` (around line 778):
- Replace `{r.name.replace('_', ' ')}` with `formatRole(r.name)` so the dropdown uses the new Pascal labels.
- Sort the `roles` list by the canonical order: `ceo`, `finance_manager`, `hr_manager`, `team_lead`, `employee` → displayed as **CEO, Finance, HR, Team Lead, Employee**.
- Import `formatRole` from `@/lib/format-role`.

## Out of scope
- No DB changes (the underlying role keys stay `ceo`, `hr_manager`, etc.).
- No changes to payroll, sidebar groups, or routing beyond removing projects from hr_manager.
