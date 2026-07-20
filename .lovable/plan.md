## Employees module updates

### 1. Employees list (`src/pages/Employees.tsx`)
- Remove `'resigned'` from the `STATUS_OPTIONS` array so it no longer appears in the Status filter dropdown.
- Change the default value of `statusFilter` from `'all'` to `'active'` so the list opens showing only active employees. Keep "All Status" as a selectable option so managers can still view inactive/resigned records on demand.

### 2. Add/Edit Employee form (`src/pages/EmployeeForm.tsx`)
- Move the **Employee Code** field out of the Personal Information section and place it inside the **Employment Information** section, directly below the **Joining Date** field. Keep its Zod validation, auto-hyphen formatting, and existing behavior unchanged.
- Remove the **Employment Type** dropdown from the UI. Keep the field in the Zod schema/state defaulted to `'full_time'` and continue writing `'full_time'` on insert/update so existing DB column and downstream logic (e.g. director checks) stay intact.

### 3. Rename "Fuel Allowance" → "Allowance" (label only, no DB change)
The underlying column is already named `allowance`; only display strings need updating in:
- `src/pages/EmployeeForm.tsx` (field label)
- `src/pages/EmployeeProfile.tsx`
- `src/pages/Payroll.tsx` (table header)
- `src/pages/FinanceSheet.tsx` (Excel export header + table header)
- `src/components/payroll/PayslipCard.tsx` (3 occurrences)
- `src/components/payroll/PayrollSummary.tsx` (sortable header)
- `src/components/payroll/PayrollDetailSheet.tsx` (Row label)

### Out of scope
- No database migration (columns `employment_type` and `allowance` stay as-is).
- No changes to payroll calculation logic.
