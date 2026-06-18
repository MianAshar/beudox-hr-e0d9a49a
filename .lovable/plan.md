## Allow negative leave balances + warning UI

### 1. Remove blocking validation
- **`src/components/leave/ApplyLeaveModal.tsx`** (around line 151–153): Remove the `Insufficient balance` error/early-return. Replace with a warning shown below the leave type selector when `daysRequested > remaining` and `lt.annual_entitlement > 0`:
  > "Warning: This request will overdraw your [Leave Type] balance by X days. Your request will still be submitted."
  Submission proceeds normally.
- Confirm `AllRequestsTab.tsx` approve mutation has no balance gate (it doesn't — it just increments `used_days`). Leave as-is.
- No edge function / payroll changes (overdrawn never blocks payroll, which is already the case).

### 2. `MyLeaveBalances.tsx` — overdrawn card visuals
When `remaining < 0`:
- Remaining number → color `#E84545`.
- Progress bar fill → `#E84545` (cap visual at 100% width).
- Label "X days remaining" → "X days overdrawn" (show absolute value).
- Add small red "Overdrawn" badge in the card header.

### 3. `src/components/employee-profile/LeaveTab.tsx` — orange banner
Compute overdrawn types from `balances` (where `total_available - used_days < 0`). If any exist, render an orange banner at the top of the tab:
- Background `#FEF3C7`, `border-left: 3px solid #F5A623`, text `#92400E`, `AlertTriangle` icon.
- Header: "This employee has overdrawn leave balances:"
- List each: "{Leave Type name}: -{X} days"

### 4. `src/components/leave/AllRequestsTab.tsx` — HR list "Overdrawn" badge
- Extend the request query (or add a sibling `leave_balances` query keyed by company+year) to fetch current balances for `(employee_id, leave_type_id)` pairs present in the list.
- For each row where status is `approved` and the matching balance has `total_available - used_days < 0`, render a small orange "Overdrawn" badge next to the employee name.
- Wrap badge with `Tooltip` (existing shadcn `tooltip` component): "Employee's {Leave Type} balance is overdrawn by {X} days".

### Tokens
Use the literal hex values from the spec inline (consistent with existing files that use raw hex for status colors). No theme token changes.

### Verification
- Submit a leave request larger than balance → warning text appears, request saves, toast success.
- Approve such a request as HR → succeeds, balance card flips to red overdrawn state, profile shows orange banner, HR list shows orange "Overdrawn" badge with tooltip.
- Generate payroll → unaffected.
