const ROLE_LABELS: Record<string, string> = {
  ceo: 'CEO',
  hr_manager: 'HR Manager',
  finance_manager: 'Finance Manager',
  team_lead: 'Team Lead',
  employee: 'Employee',
};

export const formatRole = (role: string | null | undefined): string => {
  if (!role) return '—';
  return ROLE_LABELS[role] || role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
