## Forgo OT Deduction toggle

### 1. Migration
```sql
ALTER TABLE public.payroll_records
ADD COLUMN IF NOT EXISTS forgo_ot BOOLEAN NOT NULL DEFAULT false;
```

### 2. Payroll list — `src/pages/Payroll.tsx`
- Compute viewer permission: `canForgo = isCeoViewer || viewerRoles.includes('finance_manager')`.
- Add a new "Forgo" column header in `renderDeptTable` (after OT Amount, hidden on small screens), only when `canForgo`.
- Per-row, when `canForgo && rec.status === 'draft' && Number(rec.regular_ot_amount) < 0`, render a `Switch` labeled "Forgo deduction" bound to `rec.forgo_ot`. For all other rows in that column render `—`.
- Wrap the cell in `onClick={e => e.stopPropagation()}` so the row click (which opens detail) doesn't fire.
- When `rec.forgo_ot === true`, apply a subtle green row tint via `style={{ backgroundColor: 'rgba(29, 201, 122, 0.06)' }}`.
- New handler `handleToggleForgo(rec, next)`:
  - Recompute amounts using `effectiveRegularOt = next ? 0 : Number(rec.regular_ot_amount)`.
  - `totalSalary = max(0, basic + allowance + effectiveRegularOt + holiday_ot_amount + bonus + dinner_expense - loan_deduction)`.
  - `finalPayment = ceil(totalSalary / 50) * 50`.
  - Update local state optimistically, then `supabase.from('payroll_records').update({ forgo_ot: next, total_salary, final_payment }).eq('id', rec.id)`; on error revert + toast.
- Final Payment / OT Amount columns continue to show `rec.regular_ot_amount` and the stored `rec.final_payment` (which now reflects the forgo recalculation).

### 3. Detail sheet — `src/components/payroll/PayrollDetailSheet.tsx`
- When `record.forgo_ot === true`, render `Regular OT Amount` as `fmtPKR(0)` and add a muted line below: "OT deduction forgone".

### 4. Payslip — `src/components/payroll/PayslipCard.tsx`
- In the `record` branch of `breakdown` (lines 302–316), if `record.forgo_ot`, override:
  - `regularOtAmount: 0`
  - `totalOt: 0 + holidayOtAmount`
  - keep `totalSalary` / `finalPayment` from the stored record (already recalculated).
  - add `forgone: true` flag.
- In `otTable` rows, when `forgone`, append a small muted-note row (label `"OT deduction forgone"`, no value styling) directly under "Regular Overtime". Use existing `TableSpec` shape with an italic muted-color row (extend the rendering minimally — or include a "note" string in the row label like `"Regular Overtime"` and a separate row with empty value and muted color via an optional `note: true` flag added to the `TableSpec.rows` type).

### 5. Other surfaces (left as-is)
- `generate-payroll` edge function: does not need changes; regeneration of a draft will reset `forgo_ot` to `false` because the upsert payload doesn't set it, which is the desired behaviour (regenerating clears any manual forgo on drafts).
- PDF payslip: same `breakdown` powers it, so the "OT deduction forgone" note appears in the PDF as well via the shared OT table.

### Verification
- For a draft record with `regular_ot_amount < 0`: toggle visible (CEO/finance), default OFF; turning ON updates DB, green tint applied, Final Payment increases by the absolute deduction (rounded), payslip shows `Regular OT 0.00` with note.
- Toggle hidden for records where `regular_ot_amount >= 0` or status !== 'draft' or viewer role is not CEO/Finance Manager.
