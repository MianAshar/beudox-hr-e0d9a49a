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
 * Uses service-side queries via the current user's session.
 */
export async function getEmployeeIdsByRole(companyId: string, roleNames: string[]): Promise<string[]> {
  const { data } = await supabase
    .from('employee_roles')
    .select('employee_id, roles!employee_roles_role_id_fkey(name)')
    .in('roles.name', roleNames);

  if (!data) return [];

  // Filter out rows where the join didn't match (roles is null)
  return data
    .filter((row: any) => row.roles?.name)
    .map((row: any) => row.employee_id);
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
