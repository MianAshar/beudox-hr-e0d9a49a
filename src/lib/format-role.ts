const ROLE_LABELS: Record<string, string> = {
  ceo: 'CEO',
  hr_manager: 'HR',
  finance_manager: 'Finance',
  team_lead: 'Team Lead',
  employee: 'Employee',
};

export const ROLE_ORDER: string[] = ['ceo', 'finance_manager', 'hr_manager', 'team_lead', 'employee'];


export const formatRole = (role: string | null | undefined): string => {
  if (!role) return '—';
  return ROLE_LABELS[role] || role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
