# Fix remaining loan balances

## What I found

The Remaining Balance column simply shows the value stored on each loan. That value is only ever reduced at one moment: when a salary record is marked as **Paid**. Right now every salary record in the system is still a draft (May to August), so no loan balance has ever been reduced — every loan still shows its full original amount even though monthly deductions have been calculated.

Two further problems:

1. When a salary is marked paid and an employee has more than one active loan, the deduction is split equally between the loans instead of applying each loan's own monthly deduction.
2. Editing a loan's total amount does not adjust the remaining balance. Muhammad Asad's loan shows a total of 100,000 but a remaining balance of 75,000 — a leftover from an earlier edit.

So the numbers aren't a display bug; the balance is only maintained through the "mark as paid" step and that step has gaps.

## Proposed fix

1. **Show a true remaining balance in the loans list.** Calculate it as: original amount minus everything actually deducted through salaries that have been paid. This is computed from the salary records, so the column is always correct regardless of past gaps.
2. **Also show what's been deducted so far** and keep the progress bar consistent with the new figure.
3. **Correct the deduction applied when a salary is marked paid:** apply each loan's own monthly deduction, capped at that loan's remaining amount, instead of splitting the total evenly.
4. **Keep the stored balance in step when a loan is edited:** if the total amount changes, adjust the remaining amount by the same difference (never below zero).
5. Loans whose balance reaches zero continue to be marked settled automatically.

## Technical notes

- `src/pages/Loans.tsx`: extend the loans query to also fetch paid `payroll_records` (`employee_id`, `loan_deduction`, `month_year`, `status='paid'`, `superseded=false`) for the company and derive `effectiveRemaining = max(0, total_amount - allocatedPaid)`. Allocation per loan: only payroll months on or after the loan's `granted_date`, applying `min(monthly_deduction, outstanding)` per month in granted-date order when an employee has multiple loans. Drive the progress bar and sort key from this derived value.
- `src/pages/Payroll.tsx` `handleMarkPaid`: replace the even-split calculation (line ~373) with per-loan `min(monthly_deduction, remaining_balance)`, ordered by `granted_date`, bounded by the total `loan_deduction` on the record.
- `src/pages/Loans.tsx` `handleSave` (edit branch): when `total_amount` changes, write `remaining_balance = max(0, old_remaining + (newTotal - oldTotal))`.
- No schema changes; no migration needed.
