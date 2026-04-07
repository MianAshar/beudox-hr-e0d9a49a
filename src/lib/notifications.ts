import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  companyId: string;
  recipientIds: string[];
  type: string;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
}

/**
 * Send notifications to recipients via edge function.
 * Fire-and-forget — errors are logged but never block the caller.
 */
export async function sendNotification(params: SendNotificationParams) {
  try {
    await supabase.functions.invoke('send-notification', {
      body: {
        company_id: params.companyId,
        recipient_ids: params.recipientIds,
        type: params.type,
        title: params.title,
        message: params.message,
        reference_type: params.referenceType || null,
        reference_id: params.referenceId || null,
      },
    });
  } catch (err) {
    console.error('Notification send failed (non-blocking):', err);
  }
}

/**
 * Get employee IDs by role name(s) for a given company.
 * Queries employee_roles joined with roles to find matching employees.
 */
export async function getEmployeeIdsByRole(companyId: string, roleNames: string[]): Promise<string[]> {
  // First get role IDs matching the names
  const { data: roles } = await supabase
    .from('roles' as any)
    .select('id')
    .eq('company_id', companyId)
    .in('name', roleNames);

  if (!roles || roles.length === 0) return [];

  const roleIds = roles.map((r: any) => r.id);

  const { data: empRoles } = await supabase
    .from('employee_roles')
    .select('employee_id')
    .in('role_id', roleIds);

  if (!empRoles) return [];
  return [...new Set(empRoles.map((r: any) => r.employee_id))];
}

/** Helper to collect unique recipient IDs from multiple sources. */
export function uniqueRecipients(...groups: (string | string[] | undefined | null)[]): string[] {
  const set = new Set<string>();
  for (const g of groups) {
    if (!g) continue;
    if (Array.isArray(g)) g.forEach((id) => set.add(id));
    else set.add(g);
  }
  return Array.from(set);
}
