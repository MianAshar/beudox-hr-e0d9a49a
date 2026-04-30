import { supabase } from '@/integrations/supabase/client';

/**
 * For an approved leave request, create on_leave attendance records
 * for each working day in the range (excluding weekends + public holidays).
 *
 * - Skips dates where status is already 'present' or 'late'
 * - Promotes 'absent' rows to 'on_leave'
 * - Inserts new on_leave rows when no record exists
 */
export async function syncLeaveToAttendance(params: {
  companyId: string;
  employeeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  leaveTypeName: string;
}): Promise<{ inserted: number; updated: number; skipped: number }> {
  const { companyId, employeeId, startDate, endDate, leaveTypeName } = params;

  // Fetch public holidays overlapping the range
  const { data: holidays } = await supabase
    .from('public_holidays' as any)
    .select('date, end_date')
    .eq('company_id', companyId)
    .lte('date', endDate);

  const holidaySet = new Set<string>();
  (holidays || []).forEach((h: any) => {
    const hStart = h.date as string;
    const hEnd = (h.end_date as string | null) ?? hStart;
    if (hEnd < startDate) return;
    const cur = new Date(hStart + 'T00:00:00');
    const end = new Date(hEnd + 'T00:00:00');
    while (cur <= end) {
      const ds = cur.toISOString().split('T')[0];
      if (ds >= startDate && ds <= endDate) holidaySet.add(ds);
      cur.setDate(cur.getDate() + 1);
    }
  });

  // Build list of working days (Mon-Fri, not a public holiday)
  const workingDays: string[] = [];
  const cur = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  while (cur <= end) {
    const dow = cur.getDay(); // 0 Sun, 6 Sat
    const ds = cur.toISOString().split('T')[0];
    if (dow !== 0 && dow !== 6 && !holidaySet.has(ds)) {
      workingDays.push(ds);
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (workingDays.length === 0) {
    return { inserted: 0, updated: 0, skipped: 0 };
  }

  // Fetch existing attendance records for those days
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('id, date, status')
    .eq('company_id', companyId)
    .eq('employee_id', employeeId)
    .in('date', workingDays);

  const existingMap = new Map<string, { id: string; status: string | null }>();
  (existing || []).forEach((r: any) => existingMap.set(r.date, { id: r.id, status: r.status }));

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  const inserts: any[] = [];

  for (const ds of workingDays) {
    const ex = existingMap.get(ds);
    if (ex) {
      if (ex.status === 'present' || ex.status === 'late') {
        skipped++;
        continue;
      }
      // absent (or anything else non-present/late) → promote to on_leave
      const { error: upErr } = await supabase
        .from('attendance_records')
        .update({
          status: 'on_leave',
          is_absent: false,
          notes: leaveTypeName,
          source: 'leave_approval',
        } as any)
        .eq('id', ex.id);
      if (!upErr) updated++;
      else skipped++;
    } else {
      inserts.push({
        company_id: companyId,
        employee_id: employeeId,
        date: ds,
        check_in: null,
        check_out: null,
        working_hours: null,
        regular_ot_hours: 0,
        holiday_ot_hours: 0,
        is_absent: false,
        is_late: false,
        is_weekend: false,
        is_holiday: false,
        status: 'on_leave',
        source: 'leave_approval',
        notes: leaveTypeName,
      });
    }
  }

  if (inserts.length > 0) {
    const { error: insErr } = await supabase.from('attendance_records').insert(inserts as any);
    if (!insErr) inserted += inserts.length;
  }

  return { inserted, updated, skipped };
}

/**
 * One-time backfill: sync all approved leave requests for a company.
 */
export async function syncAllApprovedLeaves(companyId: string): Promise<{
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
}> {
  const { data: requests } = await supabase
    .from('leave_requests')
    .select('id, employee_id, start_date, end_date, leave_type_id, leave_types!leave_requests_leave_type_id_fkey(name)')
    .eq('company_id', companyId)
    .eq('status', 'approved');

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const r of requests || []) {
    const result = await syncLeaveToAttendance({
      companyId,
      employeeId: (r as any).employee_id,
      startDate: (r as any).start_date,
      endDate: (r as any).end_date,
      leaveTypeName: (r as any).leave_types?.name || 'Leave',
    });
    inserted += result.inserted;
    updated += result.updated;
    skipped += result.skipped;
  }

  return { processed: (requests || []).length, inserted, updated, skipped };
}
