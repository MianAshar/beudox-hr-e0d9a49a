
## Goal
Remove the "BD Expenses" category from the Expenses tab of Finance Sheet and expose it as a separate top-level tab visible only to CEO / Director. Only those roles can add/edit line items and one-time entries in BD Expenses.

## Scope
Frontend-only changes in `src/pages/FinanceSheet.tsx`. Data model is unchanged — BD Expenses remains a row in `expense_categories` (identified by `name = 'BD Expenses'`); we simply route it to its own tab and gate visibility/edit by role.

## Changes

1. **Detect the BD category and current user role**
   - In `FinanceSheet.tsx`, derive `bdCategory` from the loaded `expense_categories` (match by `name ILIKE 'BD Expenses'`).
   - Use the existing auth/role context (same source `Settings.tsx`/`Loans.tsx` uses — `roles` array from `useAuth`) to compute `isCeo = roles.includes('ceo')`. (Per project memory, Director = CEO role.)

2. **Tab list**
   - Current tabs: Summary, Payroll, Expenses.
   - New tabs: Summary, Payroll, Expenses, **BD Expenses** (only pushed into the tab array when `isCeo`).

3. **Expenses tab**
   - Filter out `bdCategory.id` from the categories rendered in the Expenses tab table so BD Expenses no longer appears there for any role.
   - Exclude BD amounts from the Expenses grand total shown at the bottom of that tab.

4. **BD Expenses tab (CEO only)**
   - Reuse the same category table/row layout used by the Expenses tab, but render only the BD category (its recurring line items + one-time entries for the selected month).
   - Reuse existing `openEditModal`, save/delete handlers, and the edit modal unchanged — they already operate per `category_id`. Since the tab is only mounted for CEO, only CEO can open the modal and add line items.
   - Show a BD-only total row.

5. **Summary tab**
   - Keep BD figures visible in Summary for CEO. For non-CEO users, exclude BD from the Summary numbers so BD spend isn't leaked.
   - Implementation: pass `includeBdCategoryId`/`excludeBdCategoryId` (or just `isCeo` + `bdCategoryId`) into `FinanceSummary` and have it filter `monthly_expenses` accordingly. If `FinanceSummary` currently aggregates all categories, add a simple `.filter(e => isCeo || e.category_id !== bdCategoryId)` before summing.

6. **Print/Export (PDF + Excel)**
   - CEO: include BD as its own section in the printed sheet and Excel export.
   - Non-CEO: exclude BD rows from both exports (consistent with what they see on screen).

## Non-goals
- No schema changes, no RLS changes. BD remains a normal category row; access is enforced in the UI. (Existing `monthly_expenses` / `expense_line_items` RLS already restricts write access to finance-capable roles; CEO retains full access.)
- No changes to the Settings → Expense Categories management screen.

## Files touched
- `src/pages/FinanceSheet.tsx` — tab list, category filtering, new BD tab content, role gate.
- `src/components/finance/FinanceSummary.tsx` — accept `bdCategoryId` + `isCeo` and exclude BD from totals for non-CEO viewers.
