// Shared helper to compute "absent" working days for an employee in a given window.
// Absent = working day (not weekend per company config, not public holiday)
// AND no attendance record exists AND no approved leave covers it.
//
// Returns an array of YYYY-MM-DD strings sorted ascending.

export interface ComputeAbsentDatesArgs {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  workingDays?: number[]; // day-of-week indexes (0=Sun..6=Sat) considered working. Default Mon-Fri.
  holidayDates: Set<string>;
  attendedDates: Set<string>;
  leaveDates: Set<string>;
}

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function computeAbsentDates({
  startDate,
  endDate,
  workingDays = [1, 2, 3, 4, 5],
  holidayDates,
  attendedDates,
  leaveDates,
}: ComputeAbsentDatesArgs): string[] {
  const out: string[] = [];
  const cur = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  while (cur <= end) {
    const ds = fmt(cur);
    const dow = cur.getDay();
    const isWorkingDow = workingDays.includes(dow);
    if (isWorkingDow && !holidayDates.has(ds) && !attendedDates.has(ds) && !leaveDates.has(ds)) {
      out.push(ds);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}
