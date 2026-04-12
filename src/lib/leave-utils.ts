import { supabase } from '@/integrations/supabase/client';

/**
 * Count working days between two dates, excluding weekends and public holidays.
 */
export async function countWorkingDays(
  startDate: string,
  endDate: string,
  companyId: string,
): Promise<number> {
  // Get company working_days
  const { data: settings } = await supabase
    .from('company_settings')
    .select('working_days')
    .eq('company_id', companyId)
    .single();

  const workingDays: number[] = settings?.working_days ?? [1, 2, 3, 4, 5];

  // Get public holidays in range
  const { data: holidays } = await supabase
    .from('public_holidays' as any)
    .select('date')
    .eq('company_id', companyId)
    .gte('date', startDate)
    .lte('date', endDate);

  const holidaySet = new Set((holidays || []).map((h: any) => h.date));

  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0=Sun, 1=Mon...
    const dateStr = current.toISOString().split('T')[0];
    if (workingDays.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Ensure a leave balance row exists for employee + leave type + year.
 * If not, auto-create with proration if applicable.
 */
export async function ensureLeaveBalance(
  companyId: string,
  employeeId: string,
  leaveTypeId: string,
  year: number,
): Promise<void> {
  const { data: existing } = await supabase
    .from('leave_balances')
    .select('id')
    .eq('company_id', companyId)
    .eq('employee_id', employeeId)
    .eq('leave_type_id', leaveTypeId)
    .eq('year', year)
    .maybeSingle();

  if (existing) return;

  // Get leave type info
  const { data: lt } = await supabase
    .from('leave_types')
    .select('annual_entitlement, apply_proration')
    .eq('id', leaveTypeId)
    .single();

  if (!lt) return;

  let systemDays = lt.annual_entitlement;

  if (lt.apply_proration) {
    // Get employee joining date
    const { data: emp } = await supabase
      .from('employees')
      .select('joining_date')
      .eq('id', employeeId)
      .single();

    if (emp?.joining_date) {
      const joinDate = new Date(emp.joining_date);
      const joinYear = joinDate.getFullYear();
      if (joinYear === year) {
        const monthsRemaining = 12 - joinDate.getMonth();
        systemDays = Math.round((lt.annual_entitlement * monthsRemaining) / 12);
      }
    }
  }

  await supabase.from('leave_balances').insert({
    company_id: companyId,
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    year,
    system_days: systemDays,
    adjustment_days: 0,
    carried_over_days: 0,
    used_days: 0,
  } as any);
}

/**
 * Get remaining balance for an employee + leave type + year.
 */
export async function getRemainingBalance(
  companyId: string,
  employeeId: string,
  leaveTypeId: string,
  year: number,
): Promise<number> {
  await ensureLeaveBalance(companyId, employeeId, leaveTypeId, year);

  const { data } = await supabase
    .from('leave_balances')
    .select('system_days, adjustment_days, carried_over_days, used_days')
    .eq('company_id', companyId)
    .eq('employee_id', employeeId)
    .eq('leave_type_id', leaveTypeId)
    .eq('year', year)
    .single();

  if (!data) return 0;
  return (data.system_days || 0) + (data.adjustment_days || 0) + (data.carried_over_days || 0) - (data.used_days || 0);
}
