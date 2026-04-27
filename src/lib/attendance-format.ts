// Shared formatters for attendance times and working hours.
// Used across the AttendanceUpload preview, employee profile attendance tab,
// and any future surface that renders attendance data.

/**
 * Convert "HH:mm" / "HH:mm:ss" / Date / ISO timestamp to "h:mm AM/PM".
 * Returns "—" for null/invalid inputs.
 */
export function formatTime12h(input: string | Date | null | undefined): string {
  if (input == null || input === '') return '—';

  let h: number;
  let m: number;

  if (input instanceof Date) {
    h = input.getHours();
    m = input.getMinutes();
  } else {
    const s = String(input).trim();
    // Try HH:mm or HH:mm:ss directly first
    const direct = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (direct) {
      h = parseInt(direct[1], 10);
      m = parseInt(direct[2], 10);
    } else {
      // Fall back to Date parsing for ISO timestamps
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return '—';
      h = d.getHours();
      m = d.getMinutes();
    }
  }

  if (Number.isNaN(h) || Number.isNaN(m)) return '—';
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Convert decimal hours (e.g. 8.9) to "Xh Ym" (e.g. "8h 54m").
 * Returns "—" for null/undefined.
 */
export function formatWorkingHours(decimalHours: number | null | undefined): string {
  if (decimalHours == null || Number.isNaN(decimalHours)) return '—';
  const totalMinutes = Math.round(decimalHours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}
