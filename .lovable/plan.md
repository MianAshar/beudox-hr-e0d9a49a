## Changes to Leave Management for CEO role

**`src/pages/LeaveManagement.tsx`**
- Add `isCeo` flag from roles.
- Hide `<MyLeaveBalances />` widget when `isCeo`.
- Remove the "My Requests" tab from the tab list when `isCeo`, and skip rendering its `TabsContent`.
- Update the default active tab logic so CEO lands on `all-requests` (already does since `isHrOrCeo` covers it) — ensure CEO never defaults to `my-requests`.

**`src/components/leave/ApplyLeaveModal.tsx`**
- When the submitting user is CEO, insert the leave request with `status: 'approved'` instead of `'pending'`, and set `approved_by` = current employee id and `approved_at` = now (matching existing approval fields on `leave_requests`).
- Skip sending the "leave submitted" notification to HR/CEO when auto-approved (or send an "approved" notification instead — will keep it simple and just skip since CEO approves their own).
- Also deduct from balance immediately for CEO auto-approved leaves, mirroring how the existing approval flow updates `used_days` on `leave_balances` (will reuse the same helper/logic used in `AllRequestsTab` approval path).

**Notes**
- Data-model already supports approval fields; no migration needed.
- Non-CEO behavior is unchanged.