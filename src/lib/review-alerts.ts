import { supabase } from '@/integrations/supabase/client';
import { computeNextReviewDate, getReviewStatus } from '@/lib/review-schedule';
import { format } from 'date-fns';

const lastRunByCompany = new Map<string, number>();
const RUN_INTERVAL_MS = 30 * 60 * 1000; // throttle to once per 30 min per company per session

/**
 * Scan employees in the company for upcoming/overdue salary reviews and
 * insert notifications for the CEO only (de-duped to once per 7 days per employee).
 * Throttled per session to avoid hammering the DB on every navigation.
 * Non-blocking: errors are swallowed so the app continues to render.
 */
export async function checkReviewAlerts(companyId: string): Promise<void> {
  const now = Date.now();
  const last = lastRunByCompany.get(companyId) ?? 0;
  if (now - last < RUN_INTERVAL_MS) return;
  lastRunByCompany.set(companyId, now);

  try {
    const { data: employees, error: empErr } = await supabase
      .from('employees')
      .select('id, full_name, first_review_date, review_frequency_months')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .not('first_review_date', 'is', null);

    if (empErr) throw empErr;
    if (!employees?.length) return;

    // Resolve CEO recipients only
    const { data: roleRows, error: roleErr } = await supabase
      .from('roles' as any)
      .select('id, name')
      .eq('company_id', companyId)
      .eq('name', 'ceo');
    if (roleErr) throw roleErr;
    const roleIds = (roleRows as any[] ?? []).map(r => r.id);
    if (!roleIds.length) return;

    const { data: empRoles, error: erErr } = await supabase
      .from('employee_roles')
      .select('employee_id')
      .in('role_id', roleIds);
    if (erErr) throw erErr;
    const recipients = Array.from(new Set((empRoles ?? []).map((e: any) => e.employee_id)));
    if (!recipients.length) return;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    for (const emp of employees) {
      const next = computeNextReviewDate(emp.first_review_date, emp.review_frequency_months);
      const status = getReviewStatus(next);
      // Notify for both overdue and within-30-days windows
      if (status !== 'overdue' && status !== 'due_soon') continue;
      if (!next) continue;

      // Check if a recent increment_due notification exists for this employee
      const { data: recent } = await supabase
        .from('notifications')
        .select('id')
        .eq('company_id', companyId)
        .eq('type', 'increment_due')
        .eq('reference_id', emp.id)
        .gte('created_at', sevenDaysAgo)
        .limit(1);
      if (recent && recent.length > 0) continue;

      const message = `${emp.full_name} is due for a salary review on ${format(next, 'd MMM yyyy')}.`;
      const rows = recipients.map(rid => ({
        company_id: companyId,
        recipient_id: rid,
        type: 'increment_due',
        title: 'Salary Review Due',
        message,
        reference_type: 'employee',
        reference_id: emp.id,
      }));
      await supabase.from('notifications').insert(rows);
    }
  } catch (err) {
    // Non-blocking: log and move on
    console.error('Review alert check failed (non-blocking):', err);
  }
}
