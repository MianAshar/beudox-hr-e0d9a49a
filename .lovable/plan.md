## Remove Short-Time Relaxation from Payroll OT Calculation

### Problem
The `generate-payroll` Edge Function silently applies `short_time_relaxation_hours` to reduce an employee's short-time deficit before calculating `regular_ot_total`, `regular_ot_amount`, and ultimately `total_salary`. This setting must remain purely informational and never modify the actual payroll math.

### Files to Change

#### 1. `supabase/functions/generate-payroll/index.ts`
- **Lines 241-244** — Replace the relaxation-adjusted OT calculation:
  ```
  const relaxation = shortTimeRelaxation || 0;
  const adjustedShortTime = shortTime + relaxation;
  const effectiveShortTime = adjustedShortTime >= 0 ? 0 : adjustedShortTime;
  const regularOtTotal = effectiveShortTime + overtime;
  ```
  with:
  ```
  const regularOtTotal = shortTime + overtime;
  ```
- **Lines 78-85** — Remove the `DEBUG_EMP_CODE` resolution block.
- **Lines 151-153** — Remove the `console.log` inside the attendance summation loop.
- **Lines 162-166** — Remove the `FINAL` `console.log` after the summation loop.
- Keep `shortTimeRelaxation` and its fetch from `company_settings` unchanged — it may still be passed along for informational display elsewhere.

#### 2. No frontend changes
The `short_time_relaxation_hours` setting stays editable in Attendance Settings. If the payroll breakdown sidebar already shows it, that display is allowed to remain as a reference value. The fix is strictly backend.

### Verification Steps
1. Deploy the updated Edge Function.
2. Trigger payroll generation for April 2026.
3. Pull Edge Function logs and confirm for `employee_code` `511122`:
   - `shortTime` = -7.13 (raw, unmodified)
   - `overtime` = 4.01
   - `regularOtTotal` = -3.12
4. Confirm the Forgo toggle appears on the employee's payroll row because `regularOtTotal` is now negative.
5. Confirm `total_salary` and `final_payment` reflect the unrelaxed values.

### What is NOT Changing
- Attendance summation loop logic
- Leave exclusion logic
- Forgo toggle UI/logic
- Any other module