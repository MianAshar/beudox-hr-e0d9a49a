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
    const { data: settings, error: settingsErr } = await supabase
      .from('company_settings')
      .select('ot_divisor, shift_start_time, shift_end_time')
      .eq('company_id', company_id)
      .single();

    if (settingsErr || !settings) {
      return new Response(JSON.stringify({ error: 'Company settings not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate shift hours
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    };
    const shiftHours = parseTime(settings.shift_end_time) - parseTime(settings.shift_start_time);
    const otDivisor = settings.ot_divisor || 26;

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

    // 3. Date range for the month
    const [year, month] = month_year.split('-').map(Number);
    const startDate = `${month_year}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${month_year}-${String(lastDay).padStart(2, '0')}`;

    // Fetch all attendance records for this month + company
    const { data: attendance } = await supabase
      .from('attendance_records')
      .select('employee_id, regular_ot_hours, holiday_ot_hours')
      .eq('company_id', company_id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Group attendance by employee
    const attendanceMap: Record<string, { regularOt: number; holidayOt: number }> = {};
    for (const rec of attendance || []) {
      if (!attendanceMap[rec.employee_id]) {
        attendanceMap[rec.employee_id] = { regularOt: 0, holidayOt: 0 };
      }
      attendanceMap[rec.employee_id].regularOt += Number(rec.regular_ot_hours || 0);
      attendanceMap[rec.employee_id].holidayOt += Number(rec.holiday_ot_hours || 0);
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

      if (!isDirector) {
        const att = attendanceMap[emp.id];
        regularOtHours = att?.regularOt || 0;
        holidayOtHours = att?.holidayOt || 0;

        const hourlyRate = shiftHours > 0 ? basicSalary / otDivisor / shiftHours : 0;
        regularOtAmount = regularOtHours * hourlyRate * 1.0;
        holidayOtAmount = holidayOtHours * hourlyRate * 1.5;
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
