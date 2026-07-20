## Goal
Prevent accidental payroll generation when no attendance data exists for the selected month. Show a clear prompt to upload attendance first.

## Changes (single file: `src/pages/Payroll.tsx`)

1. **Attendance availability check**
   - Add `hasAttendance` state (boolean) and `checkingAttendance` state.
   - In `fetchExisting` (and `handleMonthYearChange`), also query `attendance_records` for the selected `company_id` and month (filter rows whose date falls in `monthYear`), `select('id', { count: 'exact', head: true })`, limit 1. Set `hasAttendance = count > 0`.
   - Run this whenever month/year changes.

2. **Disable Generate Payroll button**
   - Add `disabled={loading || checkingAttendance || !hasAttendance}` to the Generate button.
   - When disabled due to missing attendance, wrap it in a Tooltip: "Upload attendance for this month before generating payroll."

3. **Inline warning banner**
   - When `!checkingAttendance && !hasAttendance && !generated`, show a warning card above the empty state:
     - Icon (AlertTriangle), title "No attendance data for {Month Year}", body "Upload attendance data for this month before generating payroll.", and a button "Go to Attendance" that navigates to `/attendance`.
   - Replace/augment the existing "No payroll data" empty state so the warning takes precedence when attendance is missing.

4. **Guard `handleGenerate`**
   - Early return with `toast.error('Upload attendance for this month before generating payroll.')` if `!hasAttendance`, as a safety net.

## Notes
- No changes to the edge function or DB. Purely a frontend guardrail.
- Uses existing `attendance_records` table already queried elsewhere in the app.
