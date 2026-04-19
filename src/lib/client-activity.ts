// Client activity categorisation based on most recent non-cancelled project activity

export type ActivityCategory = 'active' | 'inactive_2m' | 'inactive_4m' | 'inactive_6m';

export interface ProjectActivityInfo {
  status: string;
  updated_at: string | null;
  created_at: string | null;
}

export const ACTIVITY_LABELS: Record<ActivityCategory, string> = {
  active: 'Active',
  inactive_2m: 'Inactive 2M',
  inactive_4m: 'Inactive 4M',
  inactive_6m: 'Inactive 6M+',
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityCategory, string> = {
  active: 'Clients with at least one project currently in progress',
  inactive_2m: 'Clients with no active projects and whose last project was updated 1 to 2 months ago',
  inactive_4m: 'Clients with no active projects and whose last project was updated 2 to 4 months ago',
  inactive_6m: 'Clients with no active projects and whose last project was updated more than 6 months ago, or clients with no projects at all',
};

export const ACTIVITY_STYLES: Record<ActivityCategory, { bg: string; text: string }> = {
  active: { bg: '#D1FAE5', text: '#065F46' },
  inactive_2m: { bg: '#FEF3C7', text: '#92400E' },
  inactive_4m: { bg: '#FEE2E2', text: '#991B1B' },
  inactive_6m: { bg: '#F3F4F6', text: '#374151' },
};

export function getActivityCategory(projects: ProjectActivityInfo[]): ActivityCategory {
  const relevant = projects.filter(p => p.status !== 'cancelled');

  if (relevant.some(p => p.status === 'in_progress')) {
    return 'active';
  }

  if (relevant.length === 0) {
    return 'inactive_6m';
  }

  // Most recent activity timestamp
  const mostRecent = relevant
    .map(p => new Date(p.updated_at || p.created_at || 0).getTime())
    .reduce((a, b) => Math.max(a, b), 0);

  if (mostRecent === 0) return 'inactive_6m';

  const daysAgo = (Date.now() - mostRecent) / (1000 * 60 * 60 * 24);

  if (daysAgo <= 60) return 'inactive_2m';      // 1–2 months
  if (daysAgo <= 120) return 'inactive_4m';     // 2–4 months
  return 'inactive_6m';                          // >6 months (or 4–6, grouped into 6M+)
}
