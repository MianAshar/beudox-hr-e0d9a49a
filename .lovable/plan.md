## Fix 1 — Remove reason from deactivation/reactivation emails

**`supabase/functions/deactivate-employee/index.ts`**
- Remove the "Reason" block (the `<p>Reason</p>` label and `${reasonLabel}` value, lines ~129–132) from the HTML email body.
- Keep storing `deactivation_reason` / `deactivation_notes` in the DB — only the email content changes.

**`supabase/functions/reactivate-employee/index.ts`**
- Remove the "Reason for reactivation" block (lines ~115–118) from the HTML email body.
- Reactivation reason continues to be required by the API and recorded server-side; it just isn't shown to the employee.

Redeploy both edge functions.

## Fix 2 — Show "account deactivated" instead of "invalid email or password"

The login page already has a fallback that queries `employees.status` when Supabase doesn't return a `user_banned` code. The query fails silently because an unauthenticated client cannot read the `employees` table under RLS, so `empData` comes back null and the user sees the generic "Invalid email or password" message.

**`src/pages/LoginV1.tsx`** (around lines 72–82)
- Replace the direct `from('employees').select('status')` call with the existing security-definer RPC `get_employee_status_by_email(_email)`, which already returns the status of the most recently relevant employee record by email and is safe to call anonymously.
- If the RPC returns `'inactive'`, show "Your account has been deactivated…"; otherwise show "Invalid email or password".

This handles two cases that currently fall through:
1. The Supabase Auth user was banned but the SDK didn't surface `user_banned` (e.g. older session error shape).
2. An employee record exists with `status='inactive'` but no auth user is linked yet.

No DB migration needed — `get_employee_status_by_email` already exists and is `SECURITY DEFINER`.

## Files changed
- `supabase/functions/deactivate-employee/index.ts`
- `supabase/functions/reactivate-employee/index.ts`
- `src/pages/LoginV1.tsx`

Then redeploy `deactivate-employee` and `reactivate-employee`.