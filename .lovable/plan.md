## Problem

In `src/pages/Settings.tsx`, the Expense Categories tab is gated with `!isHr` — meaning it *hides* whenever the user has the HR role, even if they also have Finance. For a user with both HR + Finance, Finance-only tabs disappear.

Additionally, the current tab list only includes: Expense Categories (finance), Leave Types (HR/CEO), Login Logs (HR/CEO), Leave Overwrite Log (HR/CEO). There is no explicit "finance-only" tab beyond Expense Categories, so Finance Managers currently only get that one tab.

## Fix

Update `src/pages/Settings.tsx` gating so tabs are shown additively based on each role the user holds (not exclusively):

1. Change Expense Categories gate from `!isHr` to `isCeo || isFinance`.
2. Keep Leave Types / Login Logs / Leave Overwrite Log as `isCeo || isHr` (unchanged).
3. Update `defaultTab` logic so a Finance-only user lands on `expense-categories`, HR-only lands on `leave-types`, CEO on `company`. For dual-role HR+Finance, default to `leave-types` (or first available) — pick first tab in list to keep it deterministic.

No database or business-logic changes; presentation-only fix.

## Files

- `src/pages/Settings.tsx` — fix tab visibility gates and default tab selection.
