## Goal
Replace the hardcoded "Attendance Overview (sample data)" card on the Create/Edit Evaluation screen (`src/pages/EvaluationForm.tsx`) with real data for the selected employee, covering the current calendar year (Jan 1 → today).

## Metrics to show
1. **Days Present** — count of `attendance_records` in year with both `check_in` and `check_out`, excluding weekends/holidays.
2. **Days Absent** — computed via existing `computeAbsentDates` helper (`src/lib/absent-days.ts`) using company `working_days`, public holidays, attendance dates, and approved leave dates. Window: Jan 1 → today (or employee join date if later).
3. **Late Arrivals** — count of records where `is_late = true`.
4. **Total Overtime (hrs)** — `SUM(regular_ot_hours + holiday_ot_hours)` across the year, formatted with 1 decimal.
5. **Total Undertime (hrs)** — sum of shortfall per working day where `working_hours` is present and less than the required daily hours derived from `company_settings.shift_start_time`/`shift_end_time` (skip weekends/holidays/leave). Formatted with 1 decimal.
6. **Total Tasks Completed** — count of `project_tasks` where `assigned_to = employeeId`, `is_completed = true`, and `completed_at` within current year.

## Implementation
- In `EvaluationForm.tsx`, add a `useQuery` keyed on `['eval-attendance-overview', companyId, employeeId, year]`, enabled only when `employeeId` is set.
- Query fetches in parallel:
  - `attendance_records` for employee/company in year range (fields: date, check_in, check_out, is_weekend, is_holiday, is_late, working_hours, regular_ot_hours, holiday_ot_hours).
  - `leave_requests` where status=`approved` overlapping year — expand into leave-date set.
  - `public_holidays` for company in year — build holiday date set (plus any `is_holiday` flag on attendance rows).
  - `company_settings` for `working_days`, `shift_start_time`, `shift_end_time` (to compute required daily hours for undertime).
  - `project_tasks` count with the completion filters.
  - `employees.joining_date` (already available? if not, fetch) to clamp window start.
- Aggregate client-side using existing helpers (`computeAbsentDates`).
- Replace the sample card:
  - Title: "Attendance Overview ({year})".
  - Show skeletons while loading; empty prompt ("Select an employee") when none selected.
  - Rows: Days Present, Days Absent, Late Arrivals, Total Overtime, Total Undertime, Tasks Completed.
  - Keep existing blue-tinted card style but drop the "sample data" wording.

## Out of scope
No schema changes, no changes to other screens.
