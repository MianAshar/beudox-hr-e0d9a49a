import { addMonths, differenceInCalendarDays, parseISO, isValid, format } from 'date-fns';

/**
 * Compute the next review date by advancing first_review_date by
 * review_frequency_months until it lands on or after today (or returning
 * the first_review_date itself if it's still in the future).
 */
export function computeNextReviewDate(
  firstReviewDate: string | null | undefined,
  frequencyMonths: number | null | undefined,
): Date | null {
  if (!firstReviewDate) return null;
  const freq = Number(frequencyMonths) || 6;
  const start = parseISO(firstReviewDate);
  if (!isValid(start)) return null;
  return addMonths(start, 0) > new Date()
    ? start // first review still upcoming
    : advanceUntilFuture(start, freq);
}

function advanceUntilFuture(start: Date, freqMonths: number): Date {
  const today = new Date();
  let next = start;
  // safety cap to prevent infinite loops on bad data
  for (let i = 0; i < 240 && next < today; i++) {
    next = addMonths(next, freqMonths);
  }
  return next;
}

export type ReviewStatus = 'overdue' | 'due_soon' | 'upcoming' | 'unset';

export function getReviewStatus(nextDate: Date | null): ReviewStatus {
  if (!nextDate) return 'unset';
  const days = differenceInCalendarDays(nextDate, new Date());
  if (days < 0) return 'overdue';
  if (days <= 30) return 'due_soon';
  return 'upcoming';
}

export function formatNextReviewLabel(nextDate: Date | null): string {
  if (!nextDate) return 'Not scheduled';
  return format(nextDate, 'EEE, d MMM yyyy');
}
