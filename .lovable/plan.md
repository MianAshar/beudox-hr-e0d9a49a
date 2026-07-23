## Root cause

Abu Baker Abid triggered 6 CEO notifications on 2026-07-23 (at 09:11, 10:54, 11:00, 11:10, 11:12, 11:12) — 3 recipients each. Two independent client-side code paths generate these, and both fire on ordinary user activity:

1. **`src/lib/review-alerts.ts`** — called from `AppLayout` on every session that mounts the shell. Uses `first_review_date` + `review_frequency_months`. Notifies CEO only. Throttled in-memory 30 min per session (resets on every refresh / new tab / new user login).
2. **`src/pages/Dashboard.tsx`** (lines ~170–226) — runs on Dashboard mount. Uses a *different* rule (`joining_date` anniversary). Notifies **hr_manager + ceo**. No throttle.

Both paths have a 7-day dedup DB check, but:
- The check is per-session/per-mount, so concurrent users or rapid navigation race: multiple runs all read "no recent notification" before any INSERT lands, then each inserts.
- The two paths use different date rules, so one can fire even when the other's dedup would have blocked it.
- The 30-min in-memory throttle resets on every page refresh and per browser tab, so any active workday with a few logins/refreshes produces several bursts.

That matches the pattern in the data exactly — bursts a few minutes apart, always the same 3 CEO recipients.

## Fix

Consolidate to a single code path and make dedup race-proof at the database level.

1. **Delete the Dashboard salary-review notification block** (`src/pages/Dashboard.tsx` lines ~166–230, the whole `useEffect` that inserts `increment_due` notifications). Keep the visual "upcoming reviews" widget if it exists; only remove the insert side-effect.
2. **Keep `src/lib/review-alerts.ts` as the single source** and tighten it:
   - Broaden recipients to `['ceo', 'hr_manager']` so HR still gets alerted (matching the previous Dashboard behavior and `NotificationPreferencesTab` which lists this type for both roles).
   - Change dedup window from "last 7 days" to "same calendar day" — good enough to stop bursts, still allows a fresh reminder next day if unresolved.
   - Route inserts through the existing `send-notification` edge function (via `sendNotification` in `src/lib/notifications.ts`) so per-user notification preferences are respected, instead of bypassing them with a direct `notifications.insert`.
3. **Add a database-level guard** so races can never produce same-day duplicates for the same employee/type/recipient:
   - Migration: `CREATE UNIQUE INDEX notifications_increment_due_daily_uniq ON public.notifications (company_id, recipient_id, reference_id, (created_at::date)) WHERE type = 'increment_due';`
   - The edge function already tolerates conflicts on insert; wrap the insert with `.onConflict(...).ignore()` equivalent (upsert with `ignoreDuplicates: true`) in `supabase/functions/send-notification/index.ts` so a duplicate insert becomes a no-op instead of a 500.
4. **Move the trigger out of every render path**: gate `checkReviewAlerts` in `AppLayout` so it only runs once per browser tab per day (persist last-run timestamp in `localStorage` keyed by `company_id`), instead of the in-memory 30-min throttle. This limits DB pressure even before dedup kicks in.
5. **Backfill cleanup (optional, one-off SQL)**: delete today's duplicate `increment_due` rows for Abu Baker Abid, keeping the earliest per recipient, so the bell clears immediately.

## Files touched

- `src/pages/Dashboard.tsx` — remove the duplicate notification useEffect.
- `src/lib/review-alerts.ts` — broaden recipients, tighten dedup to same-day, route through `sendNotification`.
- `src/components/layout/AppLayout.tsx` — replace in-memory throttle with once-per-day localStorage gate.
- `supabase/functions/send-notification/index.ts` — use `upsert({ ignoreDuplicates: true })` on the notifications insert.
- New migration — partial unique index on `notifications` for `increment_due`.
- One-off cleanup SQL for today's duplicates.

## Verification

- Query `notifications` after the fix: only one `increment_due` row per (recipient, employee) per day.
- Manually call `checkReviewAlerts` twice back-to-back in the console → second call inserts 0 rows.
- Log in as HR — confirm HR now receives the alert again.
