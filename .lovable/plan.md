## Add "Resend Invite" to Employee Profile

In `src/pages/EmployeeProfile.tsx`, add a "Resend Invite" action in the Danger Zone tab (above Deactivate), visible only when `canManage` is true and the employee has an email.

- Add `resending` state and `handleResendInvite` that calls the existing `invite-employee` edge function with the employee's `email`, `id`, and `full_name`.
- Show a toast on success ("Invite email sent to {email}") and on failure (show error message).
- The function already resets the temporary password to `Forte@123` and re-sends the welcome email — no edge function changes needed.