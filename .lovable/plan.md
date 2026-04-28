## Goal

Add a full **deactivate / reactivate** lifecycle to Employee Profile alongside the existing Delete action. Deactivated users are blocked from logging in (existing `user_banned` interception already handles the message). Both transitions send Forte-branded emails.

## Backend

### New edge function: `deactivate-employee`

Path: `supabase/functions/deactivate-employee/index.ts`

- Auth: same pattern as `delete-employee` (Bearer token → `getClaims` → role check `hr_manager` or `ceo`).
- Body: `{ employee_id: string, reason: 'resigned' | 'fired' | 'other', custom_reason?: string }`
- Validates `reason` and that `custom_reason` is non-empty when reason is `other`.
- Loads the employee (`full_name`, `email`, `auth_user_id`, current `status`). Rejects if already `inactive`.
- Updates `employees`:
  - `status = 'inactive'`
  - `deactivation_reason` = human-readable label (e.g. "Employee Resigned", "Employee Fired", or custom text)
  - `deactivation_notes` = raw custom reason when "Other" is chosen, else null
- Bans the auth user via `admin.updateUserById(auth_user_id, { ban_duration: '876000h' })` (~100 years). This is what triggers `user_banned` on next login attempt — already handled by `LoginV1.tsx`.
- Sends a Forte-branded "Your account has been deactivated" email via Resend (`from: 'Forte HR <noreply@beudox.com>'`), reusing the inline-HTML pattern from `invite-employee`. Email includes the human-readable reason and an HR-contact line. Failure to send email is logged but does not roll back the deactivation.
- Returns `{ success: true }`.

### New edge function: `reactivate-employee`

Path: `supabase/functions/reactivate-employee/index.ts`

- Same auth/role gate.
- Body: `{ employee_id: string, reason: string }` (free-text reason, required, max 500 chars).
- Loads employee; rejects if not currently `inactive`.
- Updates `employees`:
  - `status = 'active'`
  - `deactivation_reason = null`, `deactivation_notes = null`
- Unbans the auth user via `admin.updateUserById(auth_user_id, { ban_duration: 'none' })`.
- Sends a Forte-branded "Your account has been reactivated" email with the reactivation reason and a "Sign in to the portal" CTA pointing to `/login`. Same Resend From line.
- Returns `{ success: true }`.

Both functions deploy automatically.

### No DB migration

`employees.status`, `deactivation_reason`, and `deactivation_notes` already exist. RLS already allows `hr_manager`/`ceo` to update employee rows in their company. The edge functions use the service role anyway.

## Frontend

### `src/pages/EmployeeProfile.tsx` — Danger Zone

Add a **Deactivate Account** / **Reactivate Account** button next to the existing Delete button.

- Visible to `hr_manager` and `ceo` (Delete remains CEO-only).
- Button label and dialog flip based on `emp.status`:
  - `active` → "Deactivate Account" (warning style — `variant="outline"` with destructive text/border, not full destructive red)
  - `inactive` → "Reactivate Account" (primary style)

**Deactivate dialog** (single-step modal):
1. Title: "Deactivate {full_name}?"
2. Description: "This employee will no longer be able to sign in. All their data is retained and the account can be reactivated later."
3. Reason **RadioGroup**: "Employee Resigned" / "Employee Fired" / "Other"
4. When "Other" is selected, show a required Textarea (max 500 chars) for the custom reason with inline validation.
5. Footer: Cancel / "Deactivate Account" (destructive). Submit calls `supabase.functions.invoke('deactivate-employee', ...)`. On success: toast, invalidate the employee query, close dialog.

**Reactivate dialog** (single-step modal):
1. Title: "Reactivate {full_name}?"
2. Description: "The employee will regain access to the portal and receive an email notification."
3. Required Textarea: "Reason for reactivation" (max 500 chars, inline validation).
4. Footer: Cancel / "Reactivate Account" (primary). Submit calls `supabase.functions.invoke('reactivate-employee', ...)`. On success: toast, invalidate query, close dialog.

State additions: `deactivateOpen`, `reactivateOpen`, `deactReason` ('resigned'|'fired'|'other'), `deactCustom`, `reactReason`, `submitting` flags.

### Login behavior

Already implemented in `src/pages/LoginV1.tsx` (lines 64–79): both the `user_banned` Supabase signal and the post-login `status === 'inactive'` check already produce the message "Your account has been deactivated. Please contact your HR Manager or system administrator." **No login changes needed.**

## Email templates (inline HTML, Forte-branded)

### Deactivation email
- Subject: "Your Forte HR Portal account has been deactivated"
- Greeting with employee name, statement that access has been revoked, the human-readable reason in a styled callout box, and "If you believe this is a mistake, please contact your HR administrator." Brand colors `#5B3FF8` / `#120E36` to match `invite-employee`.

### Reactivation email
- Subject: "Your Forte HR Portal account has been reactivated"
- Greeting, "Your access has been restored." Reactivation reason in callout box. CTA button "Sign in to the portal" → `https://beudox-hr.lovable.app/login`. Same Forte branding palette.

## Out of scope

- Email-domain rebrand (sender still `noreply@beudox.com`)
- Schema changes (columns already exist)
- Login page changes (already handles deactivated users)
- Bulk deactivation / scheduled deactivation
- Self-service reactivation requests by the employee
