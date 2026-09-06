// Client activity categorisation based on most recent project client deadline

export type ActivityCategory = 'active' | 'inactive_2m' | 'inactive_4m' | 'inactive_6m';

export interface ProjectActivityInfo {
  status: string;
  client_deadline: string | null;
  internal_deadline: string | null;
  created_at: string | null;
}

export const ACTIVITY_LABELS: Record<ActivityCategory, string> = {
  active: 'Recent',
  inactive_2m: 'Idle 2M',
  inactive_4m: 'Idle 4M',
  inactive_6m: 'Dormant',
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityCategory, string> = {
  active: 'This client has at least one project currently in progress.',
  inactive_2m: 'No active projects. Last project deadline was 1 to 2 months ago.',
  inactive_4m: 'No active projects. Last project deadline was 2 to 4 months ago.',
  inactive_6m: 'No project activity for 6 months or more, or no projects have been added yet.',
};

export const ACTIVITY_STYLES: Record<ActivityCategory, { bg: string; text: string }> = {
  active:      { bg: '#D1FAE5', text: '#065F46' },
  inactive_2m: { bg: '#FEF3C7', text: '#92400E' },
  inactive_4m: { bg: '#FEE2E2', text: '#991B1B' },
  inactive_6m: { bg: '#F3F4F6', text: '#374151' },
};

export function getActivityCategory(projects: ProjectActivityInfo[]): ActivityCategory {
  // Exclude cancelled projects
  const relevant = projects.filter(p => p.status !== 'cancelled');

  if (relevant.length === 0) return 'inactive_6m';

  // In-progress projects: check if their client_deadline (or internal_deadline) is within 60 days
  // from today in either direction — i.e. currently active work
  const hasActiveInProgress = relevant.some(p => {
    if (p.status !== 'in_progress') return false;
    // If no deadline set, treat as active (work is ongoing, no deadline yet)
    if (!p.client_deadline && !p.internal_deadline) return true;
    const deadline = new Date(p.client_deadline || p.internal_deadline!).getTime();
    const daysFromNow = (deadline - Date.now()) / (1000 * 60 * 60 * 24);
    // Active if deadline is in the future OR was within the last 60 days
    return daysFromNow > -60;
  });

  if (hasActiveInProgress) return 'active';

  // Find most recent deadline across all non-cancelled projects
  // Use client_deadline first, fall back to internal_deadline, then created_at
  const mostRecentMs = relevant
    .map(p => {
      const dateStr = p.client_deadline || p.internal_deadline || p.created_at;
      return dateStr ? new Date(dateStr).getTime() : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);

  if (mostRecentMs === 0) return 'inactive_6m';

  const daysAgo = (Date.now() - mostRecentMs) / (1000 * 60 * 60 * 24);

  if (daysAgo <= 60)  return 'inactive_2m';  // within 2 months
  if (daysAgo <= 120) return 'inactive_4m';  // within 4 months
  return 'inactive_6m';                       // 4+ months
}
