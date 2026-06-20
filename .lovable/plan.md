## Fix: include every valid attendance day in short-time/overtime sum

### Root cause
`supabase/functions/generate-payroll/index.ts` only selects `employee_id, date, regular_ot_hours, holiday_ot_hours` from `attendance_records` and only skips leave days. It never explicitly checks `is_weekend`, `is_holiday`, `check_in`, or `check_out`. Days that should be summed are being silently filtered because the query/loop relies on indirect signals rather than the explicit rules from the spec, and the current `else if (reg > 0)` branch also drops any record whose `regular_ot_hours` is exactly stored as `0` from being part of the contract — and ambiguously handles edge cases where stored deviations come back as `null`/odd values.

### Change
Update the attendance fetch + summation loop in `supabase/functions/generate-payroll/index.ts`:

1. Expand the `select` to include `is_weekend, is_holiday, check_in, check_out, regular_ot_hours, holiday_ot_hours, date, employee_id`.
2. Replace the current loop with the canonical version from the spec:

```ts
for (const rec of attendance || []) {
  const empId = rec.employee_id;
  const recDate = rec.date;

  if (rec.is_weekend || rec.is_holiday) continue;
  if (leaveDatesByEmp[empId]?.has(recDate)) continue;
  if (!rec.check_in || !rec.check_out) continue; // single punch

  if (!attendanceMap[empId]) {
    attendanceMap[empId] = { shortTime: 0, overtime: 0, holidayOt: 0 };
  }

  const deviation = Number(rec.regular_ot_hours || 0);
  if (deviation < 0) attendanceMap[empId].shortTime += deviation;
  else attendanceMap[empId].overtime += deviation;
}
```

3. Keep `holiday_ot_hours` accumulated in a separate pass that DOES allow weekend/holiday rows (since that's where holiday OT lives) but still excludes leave days and single-punch days. This preserves existing holiday-OT behavior.

### Out of scope
- Leave exclusion logic (unchanged).
- Weekend/holiday detection upstream (unchanged — relies on stored flags).
- Forgo toggle UI/logic.
- Any other module or downstream calculation (per-hour rate, rounding, arrears, loans).

### Verification
After deploy, regenerate April 2026 payroll and confirm Sadaqat Ali shows Short Time -7.13, Overtime +4.00, Net -3.13 with the Forgo toggle visible.
