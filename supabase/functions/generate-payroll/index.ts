import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { company_id, month_year } = await req.json();
    if (!company_id || !month_year) {
      return new Response(JSON.stringify({ error: 'company_id and month_year are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate month_year format YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(month_year)) {
      return new Response(JSON.stringify({ error: 'month_year must be YYYY-MM format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Fetch company_settings
    const { data: settings } = await supabase
      .from('company_settings')
      .select('ot_divisor, shift_start_time, shift_end_time, lunch_break_hours, enable_ot_adjustment, short_time_relaxation_hours')
      .eq('company_id', company_id)
      .maybeSingle();

    // Calculate shift hours with fallback defaults
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    };
    const shiftStart = settings?.shift_start_time ?? '09:00:00';
    const shiftEnd = settings?.shift_end_time ?? '18:00:00';
    const shiftHours = parseTime(shiftEnd) - parseTime(shiftStart);
    const lunchBreakHours = Number((settings as any)?.lunch_break_hours ?? 1);
    const otDivisor = settings?.ot_divisor || 30;
    const enableOtAdjustment = (settings as any)?.enable_ot_adjustment ?? true;
    const shortTimeRelaxation = Number((settings as any)?.short_time_relaxation_hours ?? 0);
    const workingHoursPerDay = Math.max(0.0001, shiftHours - lunchBreakHours);

    // 2. Fetch active employees (full_time + director)
    const { data: employees, error: empErr } = await supabase
      .from('employees')
      .select('id, full_name, department, basic_salary, allowance, employment_type')
      .eq('company_id', company_id)
      .eq('status', 'active')
      .in('employment_type', ['full_time', 'director']);

    if (empErr) {
      return new Response(JSON.stringify({ error: empErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!employees || employees.length === 0) {
      return new Response(JSON.stringify({ error: 'No active employees found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TEMP DEBUG: resolve employee_code -> id for targeted logging
    const DEBUG_EMP_CODE = '511122';
    const { data: debugEmpRow } = await supabase
      .from('employees')
      .select('id')
      .eq('company_id', company_id)
      .eq('employee_code', DEBUG_EMP_CODE)
      .maybeSingle();
    const debugEmpId = (debugEmpRow as any)?.id ?? null;


    // 3. Date range for the month
    const [year, month] = month_year.split('-').map(Number);
    const startDate = `${month_year}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${month_year}-${String(lastDay).padStart(2, '0')}`;

    // Fetch all attendance records for this month + company
    const { data: attendance } = await supabase
      .from('attendance_records')
      .select('employee_id, date, regular_ot_hours, holiday_ot_hours, is_weekend, is_holiday, check_in, check_out')
      .eq('company_id', company_id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Fetch approved leave requests overlapping the month, then expand into a
    // per-employee set of leave dates (weekends/holidays kept inside the set are
    // harmless because attendance won't have OT entries for those days anyway).
    const { data: approvedLeaves } = await supabase
      .from('leave_requests')
      .select('employee_id, start_date, end_date')
      .eq('company_id', company_id)
      .eq('status', 'approved')
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    const leaveDatesByEmp: Record<string, Set<string>> = {};
    for (const lr of approvedLeaves || []) {
      const empId = (lr as any).employee_id as string;
      if (!leaveDatesByEmp[empId]) leaveDatesByEmp[empId] = new Set<string>();
      const set = leaveDatesByEmp[empId];
      const s = new Date(((lr as any).start_date as string) + 'T00:00:00');
      const e = new Date(((lr as any).end_date as string) + 'T00:00:00');
      const winStart = new Date(startDate + 'T00:00:00');
      const winEnd = new Date(endDate + 'T00:00:00');
      const cur = new Date(Math.max(s.getTime(), winStart.getTime()));
      const stop = new Date(Math.min(e.getTime(), winEnd.getTime()));
      while (cur <= stop) {
        set.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Group attendance by employee — split negative (short time) from positive (overtime).
    // Include every record that is NOT weekend/holiday/leave AND has both check_in and check_out.
    // No threshold on size of deviation — every valid day counts at its full value.
    const attendanceMap: Record<string, { shortTime: number; overtime: number; holidayOt: number }> = {};
    for (const rec of attendance || []) {
      const empId = (rec as any).employee_id as string;
      const recDate = (rec as any).date as string;
      if (!attendanceMap[empId]) {
        attendanceMap[empId] = { shortTime: 0, overtime: 0, holidayOt: 0 };
      }

      // Holiday OT accumulates from weekend/holiday rows (skip leave + single-punch).
      if ((rec as any).is_weekend || (rec as any).is_holiday) {
        if (leaveDatesByEmp[empId]?.has(recDate)) continue;
        if (!(rec as any).check_in || !(rec as any).check_out) continue;
        attendanceMap[empId].holidayOt += Number(rec.holiday_ot_hours || 0);
        continue;
      }

      // Regular working day — must have both punches and not be a leave day.
      const deviation = Number(rec.regular_ot_hours || 0);
      if (debugEmpId && empId === debugEmpId) {
        console.log(`Processing ${recDate} for emp ${empId}: deviation=${deviation}, inLeaveSet=${leaveDatesByEmp[empId]?.has(recDate)}, hasCheckIn=${!!(rec as any).check_in}, hasCheckOut=${!!(rec as any).check_out}`);
      }
      if (leaveDatesByEmp[empId]?.has(recDate)) continue;
      if (!(rec as any).check_in || !(rec as any).check_out) continue;

      if (deviation < 0) attendanceMap[empId].shortTime += deviation;
      else attendanceMap[empId].overtime += deviation;

    }

    // 4. Fetch active loans
    const { data: loans } = await supabase
      .from('loans')
      .select('employee_id, monthly_deduction')
      .eq('company_id', company_id)
      .eq('status', 'active');

    const loanMap: Record<string, number> = {};
    for (const loan of loans || []) {
      loanMap[loan.employee_id] = (loanMap[loan.employee_id] || 0) + Number(loan.monthly_deduction || 0);
    }

    // 4b. Fetch unpaid arrears from approved salary_history
    const { data: arrearsRows } = await supabase
      .from('salary_history')
      .select('id, employee_id, arrears_amount')
      .eq('company_id', company_id)
      .eq('status', 'approved')
      .eq('arrears_paid', false)
      .gt('arrears_amount', 0);

    const arrearsMap: Record<string, { total: number; ids: string[] }> = {};
    for (const row of arrearsRows || []) {
      if (!arrearsMap[row.employee_id]) {
        arrearsMap[row.employee_id] = { total: 0, ids: [] };
      }
      arrearsMap[row.employee_id].total += Number(row.arrears_amount || 0);
      arrearsMap[row.employee_id].ids.push(row.id);
    }

    // 5. Check existing payroll records for this month (avoid overwriting approved/paid)
    const { data: existingRecords } = await supabase
      .from('payroll_records')
      .select('id, employee_id, status, superseded')
      .eq('company_id', company_id)
      .eq('month_year', month_year)
      .eq('superseded', false);

    const existingMap: Record<string, { id: string; status: string }> = {};
    for (const rec of existingRecords || []) {
      existingMap[rec.employee_id] = { id: rec.id, status: rec.status };
    }

    // 6. Build payroll records
    const upserts: any[] = [];
    const skipped: string[] = [];
    const arrearsToMarkPaid: string[] = [];

    for (const emp of employees) {
      const existing = existingMap[emp.id];

      // Never overwrite approved or paid
      if (existing && (existing.status === 'approved' || existing.status === 'paid')) {
        skipped.push(emp.id);
        continue;
      }

      const basicSalary = Number(emp.basic_salary || 0);
      const allowance = Number(emp.allowance || 0);
      const isDirector = emp.employment_type === 'director';

      let regularOtHours = 0;
      let holidayOtHours = 0;
      let regularOtAmount = 0;
      let holidayOtAmount = 0;

      if (!isDirector && enableOtAdjustment) {
        const att = attendanceMap[emp.id];
        const shortTime = att?.shortTime || 0; // negative
        const overtime = att?.overtime || 0;   // positive

        // Apply monthly short-time relaxation: up to N hours of short time per month are forgiven.
        const relaxation = shortTimeRelaxation || 0;
        const adjustedShortTime = shortTime + relaxation;
        const effectiveShortTime = adjustedShortTime >= 0 ? 0 : adjustedShortTime;
        const regularOtTotal = effectiveShortTime + overtime;

        regularOtHours = Math.round(regularOtTotal * 100) / 100; // net, can be negative
        holidayOtHours = att?.holidayOt || 0;

        const perDaySalary = basicSalary / otDivisor;
        const perHourSalary = perDaySalary / workingHoursPerDay;
        regularOtAmount = regularOtHours * perHourSalary * 1.0;
        holidayOtAmount = holidayOtHours * perHourSalary * 1.5;
      }

      const loanDeduction = loanMap[emp.id] || 0;
      const arrears = arrearsMap[emp.id];
      const bonus = arrears?.total || 0;
      const dinnerExpense = 0;

      const totalSalary = Math.max(0, basicSalary + allowance + regularOtAmount + holidayOtAmount + bonus - loanDeduction);
      const finalPayment = Math.ceil(totalSalary / 50) * 50;

      const record: any = {
        company_id,
        employee_id: emp.id,
        month_year,
        basic_salary: basicSalary,
        allowance,
        regular_ot_hours: regularOtHours,
        holiday_ot_hours: holidayOtHours,
        regular_ot_amount: regularOtAmount,
        holiday_ot_amount: holidayOtAmount,
        bonus,
        dinner_expense: dinnerExpense,
        loan_deduction: loanDeduction,
        total_salary: totalSalary,
        final_payment: finalPayment,
        status: 'draft',
        superseded: false,
        notes: bonus > 0 ? `Includes PKR ${bonus.toLocaleString()} arrears from approved salary increment(s).` : null,
      };

      if (existing) {
        record.id = existing.id;
      }

      upserts.push(record);

      if (arrears) {
        arrearsToMarkPaid.push(...arrears.ids);
      }
    }

    // 7. Upsert into payroll_records
    if (upserts.length > 0) {
      const { error: upsertErr } = await supabase
        .from('payroll_records')
        .upsert(upserts, { onConflict: 'id' });

      if (upsertErr) {
        return new Response(JSON.stringify({ error: upsertErr.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Mark arrears as paid for employees whose payroll was just created/updated
      if (arrearsToMarkPaid.length > 0) {
        await supabase
          .from('salary_history')
          .update({ arrears_paid: true })
          .in('id', arrearsToMarkPaid);
      }
    }

    // 8. Return all records for this month grouped by department
    const { data: result, error: resultErr } = await supabase
      .from('payroll_records')
      .select('*, employees!payroll_records_employee_id_fkey(id, full_name, department, employment_type)')
      .eq('company_id', company_id)
      .eq('month_year', month_year)
      .eq('superseded', false)
      .order('created_at');

    if (resultErr) {
      return new Response(JSON.stringify({ error: resultErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ records: result, skipped_count: skipped.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
