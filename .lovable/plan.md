# Security hardening

## 1. Database migration (your SQL, minus the bucket UPDATE)

Run everything in your SQL except section (4) — the migration tool rejects `UPDATE storage.buckets SET public = ...`. That flip is done via the storage tool instead (step 2).

Includes:
- Drop `leave_balances_update_own`
- Drop `projects_update_any_company_member`, add `projects_update_assigned_employee`
- Add CEO-only insert/update/delete policies on `roles`
- Rewrite `company-logos` storage policies (auth read, CEO-only writes scoped to own company folder)
- Replace `avatar_select_authenticated` with company-folder-scoped select
- Revoke PUBLIC/anon EXECUTE on the security-definer helpers; grant back to `authenticated` / `service_role` as listed. `get_employee_status_by_email` is intentionally left alone (called pre-login by anon on the Forgot Password / Login screen).

## 2. Flip four buckets to private

Using the storage tool (not SQL): `invoice-pdfs`, `expense-receipts`, `employee-avatars`, `company-logos` → `public = false`.

## 3. App-side impact of private buckets — required patches

Turning these buckets private breaks every `getPublicUrl(...)` render. To keep the app working after the flip:

- **`src/pages/MyProfile.tsx`, `src/pages/EmployeeForm.tsx`** — avatar upload currently stores the returned `getPublicUrl` into `employees.avatar_url`. Switch to signed URLs (`createSignedUrl`, ~1 year expiry) so `<img>` tags still resolve.
- **`src/components/settings/CompanyTab.tsx`** — same treatment for `companies.logo_url`.
- **Existing rows** — `employees.avatar_url` and `companies.logo_url` still hold old `/object/public/...` URLs. A one-time backfill (SQL `UPDATE`) rewrites them to `/object/sign/...` equivalents via a small script, OR we lazy-replace on next upload. I'll do the lazy path by default; call out if you want the backfill instead.
- **Login screen logo** (unauthenticated) — currently loads `companies.logo_url` public URL. Since the bucket is now private and the visitor isn't signed in yet, the login-page logo will stop loading. Options:
  - (a) Keep `company-logos` public after all (skip the flip for this bucket only), or
  - (b) Fetch the logo via a small anon-callable edge function that returns a signed URL.

  Default in this plan: **(a) keep `company-logos` public** so login isn't broken. I'll still apply the tightened write policies from your SQL (CEO-only, company-folder-scoped). Tell me if you'd rather do (b).
- **`supabase/functions/generate-invoice-pdf/index.ts`** — currently writes `getPublicUrl` into `invoices.pdf_url`. Switch to a long-lived signed URL. This also addresses `generate_invoice_pdf_no_auth` (see step 4).
- **`src/pages/FinanceSheet.tsx`** — expense receipts: switch upload flow to store signed URLs; existing links open via `createSignedUrl` on click.

## 4. `generate_invoice_pdf_no_auth` (bonus, since you listed it earlier)

Add JWT verification + company-match + role check (`finance_manager` / `ceo`) at the top of `supabase/functions/generate-invoice-pdf/index.ts`, and replace `String(err)` in the catch with a generic message.

## 5. Auth config warnings (`SUPA_auth_leaked_password_protection`, `SUPA_auth_otp_long_expiry`)

These are Supabase Auth dashboard toggles, not code. I'll direct you to the two exact settings in the Supabase Auth dashboard (Enable leaked-password protection; set OTP expiry ≤ 3600s). I can't flip them from here.

## 6. Mark findings

After the above, call `manage_security_finding` → `mark_as_fixed` for every finding in your list, each with a one-line explanation of what changed. The two Auth-config findings will be marked once you confirm you flipped them in the dashboard.

## Confirm before I proceed

- **Company-logos bucket**: keep public (default in this plan, login stays working) or make private + add signed-URL edge function?
- **Existing `avatar_url` / `logo_url` values**: lazy-migrate on next upload (default) or one-time SQL backfill now?
