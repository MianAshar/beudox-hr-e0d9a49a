import { format, isValid } from 'date-fns';

/**
 * Centralised date formatter for all user-visible dates.
 *
 * Default format: "Mon, 4 March"
 * If the date is not in the current calendar year, the year is appended:
 *   "Mon, 4 March 2025"
 *
 * Returns the provided fallback (default '—') when the input is null,
 * undefined, or unparseable.
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  fallback: string = '—'
): string {
  if (value === null || value === undefined || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (!isValid(d)) return fallback;

  const currentYear = new Date().getFullYear();
  const pattern = d.getFullYear() === currentYear ? 'EEE, d MMMM' : 'EEE, d MMMM yyyy';
  return format(d, pattern);
}

/**
 * Same format as formatDate but always includes the year. Useful for
 * archival/log contexts where the year matters even if it's the current year.
 */
export function formatDateWithYear(
  value: Date | string | number | null | undefined,
  fallback: string = '—'
): string {
  if (value === null || value === undefined || value === '') return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (!isValid(d)) return fallback;
  return format(d, 'EEE, d MMMM yyyy');
}
