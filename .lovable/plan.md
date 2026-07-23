Fix the broken password reset flow and update email domains to the new production domain.

## Problem
- The Forgot Password screen currently uses the built-in Supabase password reset, which is not sending emails in this project.
- The reset experience must match the initial invite flow: reset the password to a temporary default, then force the employee to set a new password on the next login.
- The email domain is still pointing to the old Lovable URL (`https://forte-hr.lovable.app`) and must be updated to the production custom domain (`https://portal.forteestimating.com`).

## Plan

### 1. Create a new `reset-employee-password` Edge Function
- Accept the employee's email address.
- Use the service role to look up the employee and their `auth_user_id`.
- If the user exists and is active, update their Supabase Auth password to the temporary password `Forte@123`.
- Set `must_change_password = true` on the employee record so the next login forces a password change.
- Use the existing Resend integration to send a password-reset notification email. The email will tell the user to log in with the temporary password and then set a new one.
- Include the correct `portalUrl` of `https://portal.forteestimating.com/` in the email body/link.

### 2. Update the Forgot Password screen
- Replace the current `supabase.auth.resetPasswordForEmail()` call with an invocation of the new `reset-employee-password` Edge Function.
- Show clear loading, success, and error states.
- On success, tell the user to check their email and to log in with the temporary password.

### 3. Ensure the mandatory password-change flow is enforced
- The existing `MandatoryPasswordChange` component already intercepts logins when `must_change_password = true`.
- Verify that after the Edge Function resets the password, the employee record's `must_change_password` flag is correctly set, so the employee is forced to choose a new password on the next login.

### 4. Update the invite email domain
- In `supabase/functions/invite-employee/index.ts`, change the `portalUrl` from `https://forte-hr.lovable.app` to `https://portal.forteestimating.com/`.
- Confirm the email body and any login links use the new domain.

### 5. Verify the login flow end-to-end
- After the changes, confirm that the Forgot Password form calls the new function, the email sends to the user's inbox, the temporary password works at the new domain, and the mandatory password-change screen appears after login.

## Outcome
Forgot Password will reset the employee's password to a temporary default, send a branded email using the new domain, and force the employee to set a new password on their next login. The invite email will also use the new domain.