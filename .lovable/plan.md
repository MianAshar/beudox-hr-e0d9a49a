## Root cause

Your `beudox.com` domain is verified in Resend, but the current `invite-employee` edge function sends from `onboarding@resend.dev`. That sender forces Resend into sandbox mode, which only allows delivery to your own Resend account email (`ashar617@gmail.com`) — that's why `ashar410@outlok.com` is rejected with a 403.

Until yesterday it worked because the previous version of the function used `noreply@beudox.com` (your verified domain). The recent rewrite changed the sender, which broke it.

## Fix

Restore the verified sender. One small change in `supabase/functions/invite-employee/index.ts`:

- Change the Resend `from` field from
  `Beudox HR <onboarding@resend.dev>`
  to
  `Beudox HR <noreply@beudox.com>`

That's the only required change. Everything else (auth user creation, `must_change_password` flag, error handling, frontend toast) stays exactly as-is and continues to work.

## Why this is enough

- Your existing `RESEND_API_KEY` is already scoped to `beudox.com` (it was working with `noreply@beudox.com` before).
- Resend will accept the send to any recipient because the sender domain is verified — no sandbox restriction.
- The 502 sandbox error path in the function will simply stop firing, so the runtime error screen goes away on its own.

## Steps after editing

1. Update the `from` address in `supabase/functions/invite-employee/index.ts`.
2. Redeploy the `invite-employee` edge function.
3. Add a new test employee with a non-Gmail address — the welcome email will be delivered from `noreply@beudox.com`.

No database changes, no frontend changes, no Supabase SMTP changes are needed for this fix.