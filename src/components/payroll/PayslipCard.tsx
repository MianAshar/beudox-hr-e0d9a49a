import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Download, DollarSign } from 'lucide-react';

const MONTHS_LBL: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

const fmtPKR = (n: number) =>
  `PKR ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtHoursPretty = (decimalHours: number) => {
  const sign = decimalHours < 0 ? '-' : '';
  const abs = Math.abs(decimalHours);
  const totalMinutes = Math.round(abs * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${sign}${h}h ${m}m`;
};

const parseTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h + (m || 0) / 60;
};

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E', label: 'Draft' },
  approved: { bg: '#EBE6FF', text: '#2B1899', label: 'Approved' },
  paid: { bg: '#D1FAE5', text: '#065F46', label: 'Paid' },
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-[11px] uppercase font-medium mb-2.5"
    style={{ color: '#9490B4', letterSpacing: '0.1em', fontFamily: 'var(--ff-body)' }}
  >
    {children}
  </div>
);

const KeyLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-[11px] uppercase font-medium"
    style={{ color: '#9490B4', letterSpacing: '0.06em', fontFamily: 'var(--ff-body)' }}
  >
    {children}
  </div>
);

const Pill = ({
  bg,
  color,
  children,
}: {
  bg: string;
  color: string;
  children: React.ReactNode;
}) => (
  <span
    className="inline-flex items-center text-xs font-medium"
    style={{
      backgroundColor: bg,
      color,
      padding: '4px 12px',
      borderRadius: 9999,
      fontFamily: 'var(--ff-body)',
    }}
  >
    {children}
  </span>
);

const BreakdownRow = ({
  label,
  value,
  valueColor,
  emphasis = false,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  emphasis?: boolean;
}) => (
  <div
    className="flex justify-between items-baseline py-2"
    style={{ borderBottom: '1px dotted rgba(91,63,248,0.15)' }}
  >
    <span className="text-sm" style={{ color: '#4B4468', fontFamily: 'var(--ff-body)' }}>
      {label}
    </span>
    <span
      className={emphasis ? 'text-[15px] font-medium' : 'text-sm font-medium'}
      style={{ color: valueColor || '#120E36', fontFamily: 'var(--ff-body)' }}
    >
      {value}
    </span>
  </div>
);

interface PayslipCardProps {
  employeeId: string;
  monthYear: string; // YYYY-MM
  onDownload?: () => void;
}

const PayslipCard = ({ employeeId, monthYear, onDownload }: PayslipCardProps) => {
  const { employee: authEmp } = useAuth();
  const roles = authEmp?.roles ?? [];
  const isCeo = roles.includes('ceo');
  const isFinance = roles.includes('finance_manager');
  const isHR = roles.includes('hr_manager');
  const isSelf = authEmp?.employee_id === employeeId;
  const canSeeRates = isCeo || isFinance; // HR + employee hide per-day/per-hour & basic for employee

  // Employee can see own basic? Spec: employee NOT see basic. HR sees all except per-day/per-hour.
  const canSeeBasic = isCeo || isFinance || isHR;

  const [year, month] = monthYear.split('-');
  const monthLabelShort = `${MONTHS_LBL[month]} ${year}`;

  const { data: emp, isLoading: empLoading } = useQuery({
    queryKey: ['payslip-emp', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, designation, department, employee_code, avatar_url, basic_salary, allowance, company_id')
        .eq('id', employeeId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['payslip-settings', emp?.company_id],
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

  const { data: record } = useQuery({
    queryKey: ['payslip-record', employeeId, monthYear],
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

  const { data: attendance, isLoading: attLoading } = useQuery({
    queryKey: ['payslip-attendance', employeeId, monthYear],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('attendance_records')
        .select('regular_ot_hours, holiday_ot_hours, status, is_late')
        .eq('employee_id', employeeId)
        .gte('date', `${monthYear}-01`)
        .lte('date', `${monthYear}-${String(last).padStart(2, '0')}`);
      return data ?? [];
    },
    enabled: !!employeeId,
  });

  const { data: leaves } = useQuery({
    queryKey: ['payslip-leaves', employeeId, monthYear],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('leave_requests')
        .select('days_requested, start_date, end_date')
        .eq('employee_id', employeeId)
        .eq('status', 'approved')
        .lte('start_date', `${monthYear}-${String(last).padStart(2, '0')}`)
        .gte('end_date', `${monthYear}-01`);
      return data ?? [];
    },
    enabled: !!employeeId,
  });

  const { data: loanDeduction } = useQuery({
    queryKey: ['payslip-loan', employeeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('loans')
        .select('monthly_deduction, remaining_balance, status')
        .eq('employee_id', employeeId)
        .eq('status', 'active');
      return (data ?? []).reduce(
        (s: number, l: any) =>
          s + Math.min(Number(l.monthly_deduction || 0), Number(l.remaining_balance || 0)),
        0
      );
    },
    enabled: !!employeeId,
  });

  const rates = useMemo(() => {
    if (!emp || !settings) return null;
    const shiftDuration = Math.max(0, parseTime(settings.shift_end_time) - parseTime(settings.shift_start_time));
    const lunch = Number(settings.lunch_break_hours || 0);
    const workingPerDay = Math.max(0.0001, shiftDuration - lunch);
    const perDay = Number(emp.basic_salary || 0) / Number(settings.ot_divisor || 26);
    const perHour = perDay / workingPerDay;
    return { perDay, perHour, workingPerDay, shiftDuration };
  }, [emp, settings]);

  const enableOt = settings?.enable_ot_adjustment ?? true;
  const hasAttendance = (attendance?.length ?? 0) > 0;

  const attStats = useMemo(() => {
    let present = 0, late = 0, otSum = 0, holOt = 0, shortTime = 0, overtime = 0;
    for (const r of attendance ?? []) {
      const st = String(r.status || '').toLowerCase();
      if (st === 'present' || st === 'late') present++;
      if (r.is_late) late++;
      const v = Number(r.regular_ot_hours || 0);
      otSum += v;
      if (v < 0) shortTime += v;
      else if (v > 0) overtime += v;
      holOt += Number(r.holiday_ot_hours || 0);
    }
    const leaveDays = (leaves ?? []).reduce((s: number, l: any) => {
      // Clip to month
      const [y, m] = monthYear.split('-').map(Number);
      const monthStart = new Date(y, m - 1, 1);
      const monthEnd = new Date(y, m, 0);
      const ls = new Date(l.start_date);
      const le = new Date(l.end_date);
      const start = ls > monthStart ? ls : monthStart;
      const end = le < monthEnd ? le : monthEnd;
      const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
      // If full request fits in this month, prefer days_requested when smaller
      const total = Number(l.days_requested || days);
      return s + Math.min(days, total);
    }, 0);
    return { present, late, leaveDays, otSum, holOt, shortTime, overtime };
  }, [attendance, leaves, monthYear]);

  const breakdown = useMemo(() => {
    if (!emp || !rates) return null;

    if (record) {
      const regularOtHours = Number(record.regular_ot_hours || 0);
      const holidayOtHours = Number(record.holiday_ot_hours || 0);
      const regularOtAmount = Number(record.regular_ot_amount || 0);
      const holidayOtAmount = Number(record.holiday_ot_amount || 0);
      // Reconstruct short/overtime split if not stored
      let st = 0, ot = 0;
      for (const r of attendance ?? []) {
        const v = Number(r.regular_ot_hours || 0);
        if (v < 0) st += v;
        else if (v > 0) ot += v;
      }
      return {
        source: 'payroll' as const,
        basic: Number(record.basic_salary || 0),
        allowance: Number(record.allowance || 0),
        shortTime: st,
        overtime: ot,
        regularOtHours,
        holidayOtHours,
        regularOtAmount,
        holidayOtAmount,
        totalOt: regularOtAmount + holidayOtAmount,
        bonus: Number((record as any).bonus || 0),
        loan: Number(record.loan_deduction || 0),
        totalSalary: Number(record.total_salary || 0),
        finalPayment: Number(record.final_payment || 0),
        status: String(record.status || 'draft'),
      };
    }

    if (!hasAttendance) return null;
    const regularOtHours = attStats.otSum;
    const regularOtAmount = regularOtHours * rates.perHour;
    const holidayOtAmount = attStats.holOt * rates.perHour * 1.5;
    const totalOt = regularOtAmount + holidayOtAmount;
    const basic = Number(emp.basic_salary || 0);
    const allowance = Number(emp.allowance || 0);
    const total = basic + allowance + totalOt;
    return {
      source: 'estimated' as const,
      basic,
      allowance,
      shortTime: attStats.shortTime,
      overtime: attStats.overtime,
      regularOtHours,
      holidayOtHours: attStats.holOt,
      regularOtAmount,
      holidayOtAmount,
      totalOt,
      bonus: 0,
      loan: Number(loanDeduction || 0),
      totalSalary: total,
      finalPayment: total - Number(loanDeduction || 0),
      status: 'draft',
    };
  }, [emp, rates, record, attendance, hasAttendance, attStats, loanDeduction]);

  const loading = empLoading || settingsLoading;

  const maskRate = (v: string) => (canSeeRates ? v : '—');
  const maskBasic = (v: string) => (canSeeBasic ? v : '—');

  if (loading) {
    return <Skeleton className="w-full h-[520px] rounded-[14px]" />;
  }

  if (!emp) {
    return (
      <div className="w-full bg-white rounded-[14px] border p-12 text-center text-muted-foreground"
        style={{ borderColor: 'rgba(91,63,248,0.15)' }}>
        Employee not found.
      </div>
    );
  }

  const noData = !breakdown;
  const statusInfo = breakdown ? STATUS_BADGE[breakdown.status] || STATUS_BADGE.draft : null;

  return (
    <div
      className="w-full bg-white overflow-hidden"
      style={{ borderRadius: 14, border: '0.5px solid rgba(91,63,248,0.15)' }}
    >
      {/* Section 1 — accent bar */}
      <div style={{ height: 4, backgroundColor: '#5B3FF8' }} />

      {/* Section 2 — Header */}
      <div
        className="px-7 py-5"
        style={{ borderBottom: '0.5px solid rgba(91,63,248,0.15)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            className="text-[18px] font-bold"
            style={{ color: '#120E36', fontFamily: 'var(--ff-display)' }}
          >
            Salary Slip
          </h2>
          <div className="flex items-center gap-3">
            <Pill bg="#F6F5FF" color="#4B4468">{monthLabelShort}</Pill>
            {onDownload && breakdown && (
              <Button
                onClick={onDownload}
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1.5" /> Download PDF
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={emp.avatar_url || undefined} />
              <AvatarFallback className="text-sm">{initials(emp.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[15px] font-medium" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                {emp.full_name}
              </div>
              <div className="text-xs" style={{ color: '#9490B4', fontFamily: 'var(--ff-body)' }}>
                {emp.designation || '—'}{emp.employee_code ? ` · ${emp.employee_code}` : ''}
              </div>
            </div>
          </div>
          <div className="flex gap-8 text-xs" style={{ fontFamily: 'var(--ff-body)' }}>
            <div>
              <div style={{ color: '#9490B4' }}>Employee ID</div>
              <div style={{ color: '#120E36' }} className="font-medium mt-0.5">{emp.employee_code || '—'}</div>
            </div>
            <div>
              <div style={{ color: '#9490B4' }}>Department</div>
              <div style={{ color: '#120E36' }} className="font-medium mt-0.5">{emp.department || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {noData ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <DollarSign className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-base font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
            No payslip data for {monthLabelShort}
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
            Payroll has not been generated and no attendance is available.
          </p>
        </div>
      ) : (
        <>
          {/* Section 3 — Key figures grid */}
          <div className="grid grid-cols-3">
            <div className="px-6 py-4">
              <KeyLabel>Basic salary</KeyLabel>
              <div className="text-[15px] font-medium mt-1.5" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                {maskBasic(fmtPKR(breakdown.basic))}
              </div>
            </div>
            <div className="px-6 py-4" style={{ borderLeft: '0.5px solid rgba(91,63,248,0.15)', borderRight: '0.5px solid rgba(91,63,248,0.15)' }}>
              <KeyLabel>Allowance</KeyLabel>
              <div className="text-[15px] font-medium mt-1.5" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                {fmtPKR(breakdown.allowance)}
              </div>
            </div>
            <div className="px-6 py-4">
              <KeyLabel>Overtime</KeyLabel>
              <div
                className="text-[15px] font-medium mt-1.5"
                style={{
                  color:
                    breakdown.totalOt > 0 ? '#1DC97A' : breakdown.totalOt < 0 ? '#E84545' : '#9490B4',
                  fontFamily: 'var(--ff-body)',
                }}
              >
                {fmtPKR(breakdown.totalOt)}
              </div>
            </div>
          </div>

          {/* Section 4 — Attendance summary */}
          <div
            className="px-7 py-4"
            style={{
              borderTop: '0.5px solid rgba(91,63,248,0.15)',
              borderBottom: '0.5px solid rgba(91,63,248,0.15)',
            }}
          >
            <SectionLabel>Attendance</SectionLabel>
            {attLoading ? (
              <Skeleton className="h-7 w-72" />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Pill bg="#D1FAE5" color="#065F46">{attStats.present} present</Pill>
                <Pill bg="#F6F5FF" color="#4B4468">{attStats.leaveDays} leaves</Pill>
                {attStats.late > 0 && (
                  <Pill bg="#FEF3C7" color="#92400E">{attStats.late} late</Pill>
                )}
                <Pill bg="#F6F5FF" color="#4B4468">{fmtHoursPretty(breakdown.regularOtHours)} OT</Pill>
                {breakdown.holidayOtHours > 0 && (
                  <Pill bg="#EBE6FF" color="#2B1899">{fmtHoursPretty(breakdown.holidayOtHours)} Holiday OT</Pill>
                )}
              </div>
            )}
          </div>

          {/* Section 5 — Salary breakdown */}
          <div className={`grid ${enableOt ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="px-7 py-5">
              {breakdown.source === 'estimated' && (
                <div
                  className="flex items-center gap-2 px-3 py-2 mb-3 text-xs"
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    borderLeft: '3px solid #F5A623',
                    borderRadius: 4,
                  }}
                >
                  <AlertTriangle size={14} />
                  Estimated — payroll not yet generated for this month
                </div>
              )}
              <SectionLabel>Salary breakdown</SectionLabel>
              <BreakdownRow label="Basic salary" value={maskBasic(fmtPKR(breakdown.basic))} />
              <BreakdownRow label="Allowance" value={fmtPKR(breakdown.allowance)} />
              <BreakdownRow label="Per day salary" value={rates ? maskRate(fmtPKR(rates.perDay)) : '—'} />
              <BreakdownRow label="Per hour salary" value={rates ? maskRate(fmtPKR(rates.perHour)) : '—'} />
              {breakdown.loan > 0 && (
                <BreakdownRow
                  label="Loan deduction"
                  value={`- ${fmtPKR(breakdown.loan)}`}
                  valueColor="#E84545"
                />
              )}
              {breakdown.bonus > 0 && (
                <BreakdownRow
                  label="Bonus"
                  value={fmtPKR(breakdown.bonus)}
                  valueColor="#1DC97A"
                />
              )}
            </div>

            {enableOt && (
              <div className="px-7 py-5" style={{ borderLeft: '0.5px solid rgba(91,63,248,0.15)' }}>
                <SectionLabel>Overtime summary</SectionLabel>
                <BreakdownRow
                  label="Short time"
                  value={`${Math.abs(breakdown.shortTime).toFixed(2)} hrs`}
                  valueColor={breakdown.shortTime < 0 ? '#E84545' : undefined}
                />
                <BreakdownRow
                  label="Overtime"
                  value={`${breakdown.overtime.toFixed(2)} hrs`}
                  valueColor={breakdown.overtime > 0 ? '#1DC97A' : undefined}
                />
                <BreakdownRow
                  label="Net regular OT"
                  value={`${breakdown.regularOtHours.toFixed(2)} hrs`}
                  valueColor={
                    breakdown.regularOtHours > 0
                      ? '#1DC97A'
                      : breakdown.regularOtHours < 0
                      ? '#E84545'
                      : undefined
                  }
                />
                <BreakdownRow label="Regular OT amount" value={fmtPKR(breakdown.regularOtAmount)} />
                <BreakdownRow
                  label="Holiday OT hours"
                  value={fmtHoursPretty(breakdown.holidayOtHours)}
                />
                <BreakdownRow
                  label="Holiday OT amount"
                  value={fmtPKR(breakdown.holidayOtAmount)}
                  valueColor={breakdown.holidayOtAmount > 0 ? '#1DC97A' : undefined}
                />
                <BreakdownRow
                  label="Total overtime"
                  value={fmtPKR(breakdown.totalOt)}
                  emphasis
                />
              </div>
            )}
          </div>

          {/* Section 6 — Total payment footer */}
          <div
            className="grid grid-cols-2"
            style={{
              backgroundColor: '#F6F5FF',
              borderTop: '0.5px solid rgba(91,63,248,0.15)',
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14,
            }}
          >
            <div className="px-7 py-[18px]">
              <KeyLabel>Total Salary</KeyLabel>
              <div
                className="mt-1"
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontWeight: 700,
                  fontSize: 24,
                  color: '#120E36',
                }}
              >
                {fmtPKR(breakdown.totalSalary)}
              </div>
            </div>
            <div className="px-7 py-[18px]" style={{ borderLeft: '0.5px solid rgba(91,63,248,0.15)' }}>
              <KeyLabel>Final Payment</KeyLabel>
              <div
                className="mt-1"
                style={{
                  fontFamily: 'var(--ff-display)',
                  fontWeight: 700,
                  fontSize: 28,
                  color: '#5B3FF8',
                  lineHeight: 1.1,
                }}
              >
                {fmtPKR(breakdown.finalPayment)}
              </div>
              {statusInfo && breakdown.source === 'payroll' && (
                <div className="mt-2">
                  <Pill bg={statusInfo.bg} color={statusInfo.text}>{statusInfo.label}</Pill>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PayslipCard;
