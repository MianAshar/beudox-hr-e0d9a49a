## Add "Short Time Relaxation" setting

### 1. Database migration
Add column to `company_settings`:
```sql
ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS short_time_relaxation_hours NUMERIC DEFAULT 0;
```

### 2. Settings UI — `src/components/settings/AttendanceTab.tsx`
- Add `short_time_relaxation_hours` to the local form state (default `0`) and hydrate it from the loaded `settings` row.
- Include it in the upsert payload in `handleSave`.
- Render a new field directly below "Lunch Break Duration", inside the same conditional block gated by the "Overtime & Short Time Adjustment" toggle (`enable_ot_adjustment`):
  - Label: **Short Time Relaxation**
  - Helper text: *Monthly grace hours forgiven before short time affects overtime calculation. e.g. set to 3 means up to 3 hours of short time per month is ignored.*
  - Number input, suffix "hours", `min=0`, `step=0.5`, default `0`.
- No other settings UI changes.

### 3. Edge function — `supabase/functions/generate-payroll/index.ts`
After `short_time` is calculated and before `regular_ot_total`:
```ts
const relaxation = companySettings.short_time_relaxation_hours || 0
const adjustedShortTime = short_time + relaxation
const effectiveShortTime = adjustedShortTime >= 0 ? 0 : adjustedShortTime
const regular_ot_total = effectiveShortTime + overtime
```
Replace all subsequent uses of `short_time` in downstream payroll calculations with `effectiveShortTime`. The raw `short_time` value remains available for record-keeping/storage as-is (no schema change to `payroll_records`).

### 4. Verification
- Confirm the field appears/hides with the OT toggle.
- Save and reload — value persists.
- Re-generate a payroll for an employee with short_time ≤ relaxation hours → OT should not be reduced.
