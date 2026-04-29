import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

const fmtPKR = (n: number) =>
  `PKR ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtHrs = (n: number) => `${Number(n || 0).toFixed(2)} hrs`;

const parseTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h + (m || 0) / 60;
};

const Row = ({
  label,
  value,
  valueClass = '',
  bold = false,
  size = 'sm',
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  bold?: boolean;
  size?: 'sm' | 'base';
}) => (
  <div className="flex justify-between items-baseline py-2.5 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{label}</span>
    <span
      className={`font-mono ${size === 'base' ? 'text-base' : 'text-sm'} ${bold ? 'font-bold' : 'font-medium'} ${valueClass}`}
    >
      {value}
    </span>
  </div>
);

const StatCard = ({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) => (
  <Card>
    <CardContent className="pt-5 pb-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--ff-body)' }}>
        {label}
      </p>
      <p className="text-xl font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-5 mb-1" style={{ fontFamily: 'var(--ff-body)' }}>
    {children}
  </h4>
);

const PayrollTab = ({ employeeId }: { employeeId: string }) => {
  const { employee: authEmp } = useAuth();
  const roles = authEmp?.roles ?? [];
  const isCeo = roles.includes('ceo');
  const isFinance = roles.includes('finance_manager');
  const isHR = roles.includes('hr_manager');
  const canSeeRates = isCeo || isFinance; // HR & employee hide rates/basic

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));
  const monthYear = `${year}-${month}`;
  const monthLabel = MONTHS.find(m => m.value === month)?.label || '';

  // Employee basic info (basic_salary, allowance, company_id)
  const { data: emp, isLoading: empLoading } = useQuery({
    queryKey: ['emp-payroll-basic', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, basic_salary, allowance, company_id')
        .eq('id', employeeId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  // Company settings — load once per employee
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['company-payroll-settings-full', emp?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time, lunch_break_hours, ot_divisor, enable_ot_adjustment')
        .eq('company_id', emp!.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!emp?.company_id,
  });

  // Existing payroll record for the selected month
  const { data: record } = useQuery({
    queryKey: ['employee-payslip-record', employeeId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  // Attendance breakdown for the selected month
  const { data: attendance, isLoading: attLoading } = useQuery({
    queryKey: ['payslip-attendance', employeeId, monthYear],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('attendance_records')
        .select('regular_ot_hours, holiday_ot_hours')
        .eq('employee_id', employeeId)
        .gte('date', `${monthYear}-01`)
        .lte('date', `${monthYear}-${String(last).padStart(2, '0')}`);
      return data ?? [];
    },
    enabled: !!employeeId,
  });

  // Loan deduction for this month (active loan with remaining balance)
  const { data: loanDeduction } = useQuery({
    queryKey: ['payslip-loan', employeeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('loans')
        .select('monthly_deduction, remaining_amount, status')
        .eq('employee_id', employeeId)
        .eq('status', 'active');
      const total = (data ?? []).reduce(
        (s: number, l: any) => s + Math.min(Number(l.monthly_deduction || 0), Number(l.remaining_amount || 0)),
        0
      );
      return total;
    },
    enabled: !!employeeId,
  });

  // ===== Section 1 — rates =====
  const rates = useMemo(() => {
    if (!emp || !settings) return null;
    const shiftDuration = Math.max(0, parseTime(settings.shift_end_time) - parseTime(settings.shift_start_time));
    const lunch = Number(settings.lunch_break_hours || 0);
    const workingPerDay = Math.max(0.0001, shiftDuration - lunch);
    const perDay = Number(emp.basic_salary || 0) / Number(settings.ot_divisor || 26);
    const perHour = perDay / workingPerDay;
    return {
      shiftDuration,
      lunch,
      workingPerDay,
      perDay,
      perHour,
      shiftStart: settings.shift_start_time.slice(0, 5),
      shiftEnd: settings.shift_end_time.slice(0, 5),
    };
  }, [emp, settings]);

  // ===== Section 2 — monthly breakdown =====
  const hasAttendance = (attendance?.length ?? 0) > 0;
  const enableOt = settings?.enable_ot_adjustment ?? true;

  const breakdown = useMemo(() => {
    if (!rates || !emp) return null;

    // From payroll record (preferred when generated)
    if (record) {
      const shortTime = Number((record as any).short_time_hours ?? 0);
      const overtime = Number((record as any).overtime_hours ?? 0);
      const regularOtHours = Number(record.regular_ot_hours || 0);
      const holidayOtHours = Number(record.holiday_ot_hours || 0);
      const regularOtAmount = Number(record.regular_ot_amount || 0);
      const holidayOtAmount = Number(record.holiday_ot_amount || 0);
      // Reconstruct short/overtime if not stored
      let st = shortTime;
      let ot = overtime;
      if (!st && !ot && hasAttendance) {
        for (const r of attendance!) {
          const v = Number(r.regular_ot_hours || 0);
          if (v < 0) st += v;
          else if (v > 0) ot += v;
        }
      }
      return {
        source: 'payroll' as const,
        shortTime: st,
        overtime: ot,
        regularOtHours,
        holidayOtHours,
        regularOtAmount,
        holidayOtAmount,
        totalOt: regularOtAmount + holidayOtAmount,
        basic: Number(record.basic_salary || 0),
        allowance: Number(record.allowance || 0),
        loan: Number(record.loan_deduction || 0),
        bonus: Number((record as any).bonus || 0),
        totalSalary: Number(record.total_salary || 0),
      };
    }

    // Estimated from attendance
    if (!hasAttendance) return null;
    let st = 0, ot = 0, hol = 0;
    for (const r of attendance!) {
      const v = Number(r.regular_ot_hours || 0);
      if (v < 0) st += v;
      else if (v > 0) ot += v;
      hol += Number(r.holiday_ot_hours || 0);
    }
    const regularOtHours = st + ot;
    const regularOtAmount = regularOtHours * rates.perHour;
    const holidayOtAmount = hol * rates.perHour * 1.5;
    const totalOt = regularOtAmount + holidayOtAmount;
    const basic = Number(emp.basic_salary || 0);
    const allowance = Number(emp.allowance || 0);
    return {
      source: 'estimated' as const,
      shortTime: st,
      overtime: ot,
      regularOtHours,
      holidayOtHours: hol,
      regularOtAmount,
      holidayOtAmount,
      totalOt,
      basic,
      allowance,
      loan: Number(loanDeduction || 0),
      bonus: 0,
      totalSalary: basic + allowance + totalOt,
    };
  }, [rates, emp, record, attendance, hasAttendance, loanDeduction]);

  const loading = empLoading || settingsLoading;

  const maskRate = (v: string) => (canSeeRates ? v : '—');

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Section 1 — Salary Rates */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--ff-display)' }}>Salary Rates</h3>
        {loading || !rates ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Per Day Salary" value={maskRate(fmtPKR(rates.perDay))} />
            <StatCard label="Per Hour Salary" value={maskRate(fmtPKR(rates.perHour))} />
            <StatCard
              label="Shift Duration"
              value={`${rates.shiftDuration.toFixed(2)} hrs`}
              subtitle={`${rates.shiftStart} – ${rates.shiftEnd}`}
            />
            <StatCard
              label="Working Hours/Day"
              value={`${rates.workingPerDay.toFixed(2)} hrs`}
              subtitle={`excluding ${rates.lunch}h lunch`}
            />
          </div>
        )}
      </div>

      {/* Section 2 — Monthly Breakdown */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Monthly Breakdown — {monthLabel} {year}
        </h3>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            {attLoading ? (
              <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : !hasAttendance ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarCheck className="mb-3" size={32} style={{ color: '#9490B4' }} />
                <p className="text-base font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
                  No attendance data for {monthLabel} {year}
                </p>
                <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                  Import attendance records to see the monthly breakdown.
                </p>
              </div>
            ) : breakdown ? (
              <>
                {breakdown.source === 'estimated' && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-md mb-4 text-sm"
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                  >
                    <AlertTriangle size={16} />
                    Estimated — payroll not yet generated for this month
                  </div>
                )}

                {enableOt && (
                  <>
                    <SectionTitle>Overtime &amp; Short Time</SectionTitle>
                    <Row
                      label="Short Time"
                      value={`${Math.abs(breakdown.shortTime).toFixed(2)} hrs`}
                      valueClass={breakdown.shortTime < 0 ? 'text-[#E84545]' : ''}
                    />
                    <Row
                      label="Overtime"
                      value={fmtHrs(breakdown.overtime)}
                      valueClass={breakdown.overtime > 0 ? 'text-[#1DC97A]' : ''}
                    />
                    <Row
                      label="Net Regular OT"
                      value={`${breakdown.regularOtHours >= 0 ? '' : '-'}${Math.abs(breakdown.regularOtHours).toFixed(2)} hrs`}
                      valueClass={
                        breakdown.regularOtHours < 0
                          ? 'text-[#E84545]'
                          : breakdown.regularOtHours > 0
                          ? 'text-[#1DC97A]'
                          : ''
                      }
                    />

                    <SectionTitle>OT Amounts</SectionTitle>
                    <Row label="Regular OT Amount" value={fmtPKR(breakdown.regularOtAmount)} />
                    <Row label="Holiday OT" value={fmtHrs(breakdown.holidayOtHours)} />
                    <Row label="Holiday OT Amount" value={fmtPKR(breakdown.holidayOtAmount)} />
                    <Row label="Total OT" value={fmtPKR(breakdown.totalOt)} bold size="base" />
                  </>
                )}

                <SectionTitle>Final Salary</SectionTitle>
                <Row
                  label="Basic Salary"
                  value={canSeeRates ? fmtPKR(breakdown.basic) : '—'}
                />
                <Row label="Allowance" value={fmtPKR(breakdown.allowance)} />
                {breakdown.loan > 0 && (
                  <Row label="Loan Deduction" value={`- ${fmtPKR(breakdown.loan)}`} valueClass="text-[#E84545]" />
                )}
                {breakdown.source === 'payroll' && breakdown.bonus > 0 && (
                  <Row label="Bonus" value={fmtPKR(breakdown.bonus)} valueClass="text-[#1DC97A]" />
                )}
                <div className="pt-3 mt-3 border-t-2 border-border">
                  <Row
                    label="Total Salary"
                    value={fmtPKR(breakdown.totalSalary)}
                    bold
                    size="base"
                    valueClass="text-[#5B3FF8]"
                  />
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">—</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollTab;
