# Rename "Allowance" → "Fuel Allowance" (Display Only)

Update user-facing label text only. Database column `allowance`, API calls, and variable names remain unchanged.

## Scope

Find every visible occurrence of the word "Allowance" (and "ALLOWANCE") tied to the salary `allowance` field and replace the display text with "Fuel Allowance" / "FUEL ALLOWANCE". Leave code identifiers, JSON keys, DB columns, and Supabase queries untouched.

## Files to Update

1. **Employee Form** — `src/pages/EmployeeForm.tsx`
   - `<Label>` for the allowance input → "Fuel Allowance"

2. **Employee Profile overview** — `src/pages/EmployeeProfile.tsx`
   - Salary section label → "Fuel Allowance"

3. **Payroll table** — `src/pages/Payroll.tsx`
   - Column header → "Fuel Allowance"

4. **Payroll breakdown sidebar** — `src/components/payroll/PayrollDetailSheet.tsx`
   - Row label → "Fuel Allowance"

5. **Payslip card** (used by `src/pages/MyPayslip.tsx` and `src/components/employee-profile/PayrollTab.tsx`) — `src/components/payroll/PayslipCard.tsx`
   - Salary Breakdown row: "Fuel Allowance"
   - Key figures grid: "FUEL ALLOWANCE"

6. **PDF payslip generator** — `supabase/functions/generate-payroll/index.ts` (and any helper) 
   - All label strings rendered into the PDF → "Fuel Allowance"

7. **Finance sheet/summary** — `src/pages/FinanceSheet.tsx` and `src/components/finance/FinanceSummary.tsx`
   - Any "Allowance" label → "Fuel Allowance"

## Approach

- Search for `Allowance` / `ALLOWANCE` across `src/` and `supabase/functions/` to confirm all occurrences before editing.
- Only change strings inside JSX text, `<Label>`, table headers, and PDF text literals. Skip property keys, variable names, comments referencing the DB column, and translation keys that map to data fields.
- No DB migration. No type changes. No query changes.

## Verification

- Visually confirm the new label appears on: Add/Edit Employee, Employee Profile, Payroll list, Payroll detail sheet, My Payslip, Employee Profile → Payroll tab, generated PDF, Finance Sheet.
- Confirm payroll calculations and saved values are unchanged.
