I found two important issues in the current invite flow:

1. The project has no Lovable email domain configured, so the app is relying on a custom/manual email path instead of the platform email system.
2. The checked-in `invite-employee` function and the currently deployed function do not match. The deployed logs say it is triggering a Supabase recovery email, while the code in the repo sends via Resend. This mismatch explains why the Edge Function can return 200 while no real invite email arrives: the function is treating email sending as successful even though delivery is not actually confirmed.

Plan to fix it:

1. Replace the current invite-email send step with a deterministic Resend send
   - Keep the existing temporary-password onboarding flow.
   - Create or reuse the auth user with `Forte@123`.
   - Link `auth_user_id` to the employee row.
   - Set `must_change_password = true`.
   - Send the welcome email through Resend using the configured `RESEND_API_KEY`.
   - Log the Resend response ID when the email is accepted by Resend.

2. Stop returning success when the email was not accepted
   - If Resend returns a non-2xx response, return an error from `invite-employee` instead of 200.
   - Include a safe error message in the function response so the Add Employee form can show the correct warning.
   - This prevents the UI from saying “invite email sent” when the email provider rejected it.

3. Improve Add Employee feedback
   - Keep the employee record creation intact.
   - If auth user creation/linking succeeds but email sending fails, show a clear warning: employee was added, but email delivery failed.
   - Do not show the current success message unless the function confirms the email was accepted.

4. Add delivery diagnostics to the function logs
   - Log each major step: auth user created/found, employee linked, email send attempted, email accepted or rejected.
   - Avoid logging secrets or sensitive tokens.
   - This will make future failures obvious from the logs instead of showing only `POST | 200`.

5. Optional but recommended next step after the emergency fix
   - Set up a proper sender domain for production email delivery. Right now no Lovable email domain is configured, and the code uses `onboarding@resend.dev`, which is not ideal for production delivery.
   - After the core bug is fixed, we can either configure Lovable Emails or connect a verified Resend sender domain. For this immediate fix, I will not change the email provider setup unless you ask.

Files to change:

- `supabase/functions/invite-employee/index.ts`
- `src/pages/EmployeeForm.tsx` only if needed to show the returned delivery error more clearly

Technical details:

- The function should await the Resend request and parse the response.
- It should only return `{ success: true, email_sent: true }` after Resend responds with success.
- If Resend rejects because of domain/API-key/sandbox restrictions, the function should return a non-2xx status so the frontend cannot display a false success toast.
- After changing the Edge Function, it must be redeployed so the deployed logs match the repo code.