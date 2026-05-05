# Mobile Responsive Fixes — Final Pass

Address the 6 issues found during the QA sweep in a single coordinated pass.

## Files to edit

1. **`src/pages/Clients.tsx`** — Convert table to responsive card/stacked rows on mobile (mirror Projects pattern: `flex flex-wrap lg:flex-nowrap`, full-width name on mobile, secondary fields wrap below). Hide sticky table header below `lg`.

2. **`src/pages/Invoices.tsx`** — Same treatment as Clients: stacked rows on mobile with invoice number + client name full-width, status/amount/date wrapping below. Hide `lg`-only header row on mobile.

3. **`src/pages/ClientDetail.tsx`**
   - Header: change action bar to `flex-col sm:flex-row` with wrapping; allow title to wrap (`break-words`).
   - Inner Projects table: wrap in `overflow-x-auto` with `min-w-[640px]` so columns stay legible while horizontally scrollable; add a subtle scroll hint on mobile.

4. **`src/pages/InvoiceDetail.tsx`**
   - Header action bar: stack Edit/Delete/PDF/Send buttons on mobile (`flex-wrap gap-2`), ensure title doesn't get clipped.
   - Line items table: same `overflow-x-auto` + `min-w-[600px]` treatment.

5. **`src/pages/ProjectDetail.tsx`** — Header action bar: allow buttons to wrap (`flex-wrap`), title `min-w-0 break-words`. No table changes needed.

6. **`src/pages/ProjectForm.tsx`** — Select triggers truncating ("Selec…"): give selects `w-full` on mobile and remove fixed narrow widths so the trigger expands; ensure the form grid collapses to single column below `sm`.

## Approach

- Reuse the exact pattern already shipped in `src/pages/Projects.tsx` (flex-wrap rows, `basis-full lg:basis-auto`, hidden header row below `lg`) for both list pages — keeps visual consistency.
- For detail-page inner tables where a card layout would lose meaning (line items, project rows), keep the table but make it horizontally scrollable inside a bordered container with `min-w-[Xpx]` so columns stay readable.
- Header action bars: standardize on `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3` with `flex-wrap` on the actions cluster.

## QA after fixes

Live browser sweep at 390x844 of: `/clients`, `/clients/:id`, `/invoices`, `/invoices/:id`, `/projects/:id`, `/projects/new`. Screenshot each and confirm no overflow, no clipped buttons, no truncated select labels. Fix any regressions before reporting back.

## Out of scope

- No data/logic changes.
- No desktop layout changes — all changes gated behind `lg:`/`sm:` breakpoints.
