# Fix "Auth session missing!" on /set-password

## Problem

When a newly invited employee clicks the link in their invite email, the URL contains `?token_hash=...&type=invite` (current Supabase format). The `/set-password` page never exchanges this token for a session — it just renders the form. When the user submits, `supabase.auth.updateUser({ password })` fails with **"Auth session missing!"** because there is no active session yet.

The legacy hash-fragment format (`#access_token=...`) is partially handled because Supabase auto-processes it, but the new query-string format requires an explicit `verifyOtp` call.

## What changes

### 1. `src/pages/SetPassword.tsx` — verify the token on mount

Replace the existing `useEffect` (lines 43–71) with a verification flow that:

- Parses the URL on mount, looking at both the **query string** and the **hash fragment** for: `token_hash`, `token`, `type`, `access_token`, `refresh_token`.
- Picks the right verification path:
  - **Format A** (current invite emails): `token_hash` + `type` in query string → `supabase.auth.verifyOtp({ token_hash, type })`.
  - **Format B** (legacy hash fragment): `access_token` + `refresh_token` in hash → `supabase.auth.setSession({ access_token, refresh_token })`.
  - **Format C**: bare `token` + `type` + `email` in query string → `supabase.auth.verifyOtp({ token, type, email })` (older fallback).
  - **No params, no existing session** → redirect to `/login`.
  - **No params but existing session** → treat as already verified (covers internal navigation).
- Tracks one of three view states: `verifying`, `ready`, `expired`.
- After successful verification, scrubs the sensitive token params from the URL via `history.replaceState`.

### 2. New view states in the render tree

- **`verifying`** — centered spinner with text **"Verifying your invite link..."**, replacing the form.
- **`expired`** — error card with the message **"This invite link has expired or has already been used. Please ask your HR manager to send a new invite."** and a **"Go to login"** button that calls `signOut()` then navigates to `/login`.
- **`ready`** — the existing password form (unchanged styling).
- **`success`** — existing success card (kept).

All three reuse the current page chrome (gradient background, brand panel, card) so the visual treatment stays consistent.

### 3. Success behaviour

After `supabase.auth.updateUser({ password })` succeeds:

- Show a sonner toast: **"Password set successfully. Welcome to Beudox!"** (invite mode) or the existing reset-success messaging (recovery mode).
- Invite → redirect to `/dashboard`.
- Recovery → sign out, redirect to `/login` (unchanged).

### 4. `src/hooks/useAuth.tsx` — detect the query-string format too

Update the mount-time detection (lines 58–70) so `passwordMode` is set whether the token arrives in the **hash** or the **query string**. Stop clearing the URL there — the SetPassword page now owns that step (it needs the params to verify the token).

### 5. `src/App.tsx`

No structural changes. `SetPasswordRoute` already defaults to `'invite'` mode when none is detected, which covers direct visits and the brief moment before the URL is parsed.

## Files touched

- `src/pages/SetPassword.tsx` — token verification, loading/expired/ready view states, success toast.
- `src/hooks/useAuth.tsx` — also detect `type=invite` / `type=recovery` in the query string; stop clearing the URL prematurely.

## What stays the same

- Page layout, branding, gradient, strength meter, password validation rules.
- Recovery flow (sign-out + redirect to login).
- `App.tsx` routing.
- The `delete-employee` and `invite-employee` Edge Functions (already fixed in the previous turn).
