## Goal

Rebuild the payroll row detail sidebar so it shows the full breakdown defined in the brief. Row click → open is already wired (`onClick={() => setDetailRecord(rec)}` on each `TableRow` in `Payroll.tsx`), and `PayrollDetailSheet` is already mounted at the bottom of the page. The work is confined to:

1. **`src/components/payroll/PayrollDetailSheet.tsx`** — full UI rewrite + extra data fetch.
2. **`src/pages/Payroll.tsx`** — tiny tweak to the row's hover background (use `#F6F5FF`) and add `cursor-pointer` (already present). No other table changes.

Approve/Paid flow, Forgo toggle on the row, table columns, and every other screen stay untouched.

## Sidebar behaviour

- Width: `420px` on `sm+`, full-screen on mobile (`w-full sm:w-[420px] sm:max-w-[420px]`).
- Slide-in from right, 200ms ease (Radix `Sheet` default animation is close — override the inline transition duration to `200ms`).
- Close on: X button (already in `SheetContent`), outside click and `Esc` (handled by Radix).
- Scrollable body.

## Sidebar header (top, border-bottom)

- 48px circular avatar (initials fallback).
- Full name — Syne 700, 18px, `#120E36`.
- Designation — DM Sans 400, 13px, `#9490B4`.
- Month/year pill — small rounded badge: bg `rgba(91,63,248,0.08)`, text `#5B3FF8`, 11px, padding `2px 8px`.

## Sidebar content — sections

Reusable `Row` component:
- Container: `padding: 10px 0; border-bottom: 0.5px solid rgba(91,63,248,0.1)`.
- Label: DM Sans 400, 13px, `#9490B4`.
- Value: DM Sans 500, 13px, `#120E36` (overridable for red/green/bold/larger).

Section heading style: DM Sans 600, 11px, `#5B3FF8`, uppercase, letter-spacing `0.08em`, `margin: 16px 0 4px`.

### 1. SALARY
- Basic Salary — `PKR basic_salary`
- Fuel Allowance — `PKR allowance`
- Total Base Salary — `PKR (basic + allowance)` (bold)

### 2. ATTENDANCE SUMMARY
- Leaves — `N days`
- Absents — `N days`
- Lates — `N times`
- Short Time — `X hrs` (red `#E84545` when > 0)
- Overtime — `X hrs` (green `#1DC97A` when > 0)
- Regular Days OT (net) — `X hrs` (red if < 0, green if > 0)
- Holiday OT — `X hrs` (green if > 0)

### 3. SALARY BREAKDOWN
- Per Day Salary — `PKR basic / ot_divisor`
- Per Hour Salary — `PKR perDay / working_hours_per_day`
- Regular OT Salary — `PKR regular_ot_amount` (red if < 0, green if > 0; show 0 if `forgo_ot`)
- Holiday OT Salary — `PKR holiday_ot_amount` (green if > 0)
- Total OT Salary — `PKR sum` (bold)
- Loan Deduction — `- PKR loan_deduction` (red, only if > 0)
- Bonus — `+ PKR bonus` (green, only if > 0)

### 4. FINAL
- Total Salary — `PKR total_salary` (bold, 15px)
- Final Payment — `PKR final_payment` (Syne 700, 20px, `#5B3FF8`)
- Forgo Applied — `Yes` in green (only when `forgo_ot = true`)
- Status badge — Draft / Approved / Paid (reuse existing `statusStyles` colors)

If `hideSalary` (HR viewer + CEO/director employee), keep current restricted-message body — no change.

## Data fetched per open

Single `useQuery` keyed `['payroll-detail', employeeId, monthYear]` running in parallel (`Promise.all`):

1. `attendance_records` for the month — `regular_ot_hours, is_late, is_absent`. Used to compute:
   - `shortHours = Σ |regular_ot_hours| where < 0`
   - `overtimeHours = Σ regular_ot_hours where > 0`
   - `lateCount = count(is_late)`
   - `absentCount = count(is_absent)`
2. `leave_requests` for the month — `status='approved'`, overlapping `[month start, month end]`. Sum `days_requested` clipped to the month → `leaveDays`.
3. `company_settings` (single row by `company_id`) — `ot_divisor`, `shift_start_time`, `shift_end_time`, `lunch_break_hours`. Used to compute:
   - `workingHoursPerDay = (shift_end − shift_start) − lunch_break_hours` (fallback 8).
   - `perDay = basic_salary / ot_divisor` (fallback divisor 26).
   - `perHour = perDay / workingHoursPerDay`.

All values from `payroll_records` come directly from the existing `record` prop — no extra fetch needed.

Net Regular OT (hrs) = `record.regular_ot_hours` (already net). Total OT amount = `(forgo_ot ? 0 : regular_ot_amount) + holiday_ot_amount`.

## Row hover

Update the `TableRow` className in `Payroll.tsx` from `hover:bg-muted/40` to use `#F6F5FF` (inline style on mouse enter is overkill — easier: add a tailwind arbitrary class `hover:bg-[#F6F5FF]`). `cursor-pointer` already applied.

## Out of scope

- Table columns, ordering, approve/paid modal, forgo switch on rows, other screens.
- No DB schema changes, no edge function changes.

## Verification

1. Click any payroll row → sidebar opens from right, 420px, with employee header, month pill, all sections populated.
2. Toggle Forgo on the row → reopen sheet → Regular OT Salary shows 0 and Forgo Applied = Yes.
3. Employee with loan deduction shows red `- PKR …`; employee with bonus shows green `+ PKR …`.
4. Press Esc / click overlay / click X → sidebar closes.
5. Mobile viewport → sidebar covers full screen.
6. HR viewer opens a CEO/director row → restricted message still shown.
