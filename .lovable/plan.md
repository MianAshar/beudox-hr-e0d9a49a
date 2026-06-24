## Fix invite email URL

Update the hardcoded `portalUrl` in `supabase/functions/invite-employee/index.ts` from `https://beudox-hr.lovable.app/login` to `https://forte-hr.lovable.app/login`, then redeploy the edge function.

That's the only reference; the email body's CTA button uses this variable, so the link in new invite emails will point to the new domain.