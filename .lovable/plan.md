## Goal

Rebrand only the **email templates** sent by the three Resend-backed edge functions from "Beudox" to "Forte". No changes to the app UI, components, CSS, or sender email address.

## Changes

### 1. `supabase/functions/invite-employee/index.ts`
- `from: 'Beudox HR <noreply@beudox.com>'` → `from: 'Forte HR <noreply@beudox.com>'`
- Subject: "Welcome to Beudox HR Portal — your login details" → "Welcome to Forte HR Portal — your login details"
- Body text: "Your Beudox HR Portal account has been created" → "Your Forte HR Portal account has been created"

### 2. `supabase/functions/send-invoice-email/index.ts`
- `from: 'Beudox <noreply@beudox.com>'` → `from: 'Forte <noreply@beudox.com>'`
- Footer text: "This email was sent from Beudox HR Platform." → "This email was sent from Forte HR Platform."

### 3. `supabase/functions/send-notification/index.ts`
- `from: 'Beudox <noreply@beudox.com>'` → `from: 'Forte <noreply@beudox.com>'`
- Footer text: "This email was sent from Beudox HR Platform." → "This email was sent from Forte HR Platform."

### 4. Redeploy

Redeploy all three edge functions so the new content takes effect immediately.

## Out of scope

- App UI, components, pages, CSS, logos, `index.html` metadata
- Sender email address (`noreply@beudox.com` stays)
- Any code outside the three edge function files above
