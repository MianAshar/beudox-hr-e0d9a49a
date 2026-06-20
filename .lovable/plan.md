## Goal
Add a temporary diagnostic log to `generate-payroll` to trace what happens for employee_code `511122` on each April 2026 attendance record, then capture the logs for `2026-04-23`.

## Changes

### 1. `supabase/functions/generate-payroll/index.ts`
Resolve employee_code → employee_id once at function start (cheap, scoped to the target code only), then log inside the attendance loop for that employee.

- After `employees` are fetched, compute:
  ```ts
  const DEBUG_EMP_CODE = '511122';
  const { data: debugEmpRow } = await supabase
    .from('employees')
    .select('id')
    .eq('company_id', company_id)
    .eq('employee_code', DEBUG_EMP_CODE)
    .maybeSingle();
  const debugEmpId = debugEmpRow?.id ?? null;
  ```
- In the attendance loop, in the **regular working day** branch, immediately before the `if (leaveDatesByEmp[empId]?.has(recDate)) continue;` line, insert:
  ```ts
  const deviation = Number(rec.regular_ot_hours || 0);
  if (debugEmpId && empId === debugEmpId) {
    console.log(`Processing ${recDate} for emp ${empId}: deviation=${deviation}, inLeaveSet=${leaveDatesByEmp[empId]?.has(recDate)}, hasCheckIn=${!!(rec as any).check_in}, hasCheckOut=${!!(rec as any).check_out}`);
  }
  ```
  Move the existing `const deviation = ...` further down so it isn't redeclared (or reuse this one).

No calculation logic changes. No other files touched.

## Verification
1. After deploy, ask the user to regenerate April 2026 payroll from the UI.
2. Fetch `generate-payroll` Edge Function logs filtered to `2026-04-23` via `supabase--edge_function_logs` and surface them.
3. Once root cause is identified in a follow-up turn, remove the temporary log.

## Notes
- Log is gated on `debugEmpId` so it produces zero output for other companies/employees.
- Will be removed in a follow-up once debugging is complete.
