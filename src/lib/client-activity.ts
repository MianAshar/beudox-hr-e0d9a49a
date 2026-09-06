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
  // Exclude cancelled and submitted projects from activity signal
  const relevant = projects.filter(p => p.status !== 'cancelled');

  if (relevant.length === 0) return 'inactive_6m';

  // Check for actively worked or upcoming projects:
  // in_progress or pending with a future or recent deadline (within last 60 days)
  const hasActiveWork = relevant.some(p => {
    const dateStr = p.client_deadline || p.internal_deadline || p.created_at;
    if (!dateStr) return false;
    const date = new Date(dateStr).getTime();
    const daysFromNow = (date - Date.now()) / (1000 * 60 * 60 * 24);
    if (p.status === 'in_progress' || p.status === 'pending') {
      // Active/upcoming work: future deadline OR deadline within last 60 days
      return daysFromNow > -60;
    }
    if (p.status === 'submitted' || p.status === 'completed') {
      // Recently finished: deadline or created within last 60 days
      return daysFromNow > -60;
    }
    return false;
  });

  if (hasActiveWork) return 'active';

  // No active/pending work — find most recent deadline across all non-cancelled projects
  // to determine how long ago this client was last active
  const mostRecentMs = relevant
    .map(p => {
      const dateStr = p.client_deadline || p.internal_deadline || p.created_at;
      return dateStr ? new Date(dateStr).getTime() : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);

  if (mostRecentMs === 0) return 'inactive_6m';

  // Only use positive daysAgo (past deadlines) for idle classification
  const daysAgo = (Date.now() - mostRecentMs) / (1000 * 60 * 60 * 24);

  // If most recent deadline is still in the future but no active/pending work, treat as recent
  if (daysAgo < 0) return 'inactive_2m';
  if (daysAgo <= 60)  return 'inactive_2m';
  if (daysAgo <= 120) return 'inactive_4m';
  return 'inactive_6m';
}
