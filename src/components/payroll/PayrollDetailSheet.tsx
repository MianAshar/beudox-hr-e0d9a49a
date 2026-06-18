import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const RED = '#E84545';
const GREEN = '#1DC97A';
const VIOLET = '#5B3FF8';
const LABEL = '#9490B4';
const VALUE = '#120E36';
const ROW_BORDER = '0.5px solid rgba(91,63,248,0.1)';

const statusStyles: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  paid: { bg: '#EBE6FF', text: '#2B1899' },
};

const initials = (name: string) =>
  (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const fmtPKR = (n: number) =>
  `PKR ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtHrs = (n: number) => `${Number(n || 0).toFixed(2)} hrs`;

interface Props {
  record: any | null;
  open: boolean;
  onClose: () => void;
  monthLabel: string;
  hideSalary?: boolean;
}

const Row = ({
  label,
  value,
  valueColor,
  bold,
  valueSize,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  valueSize?: number;
}) => (
  <div
    className="flex items-center justify-between"
    style={{ padding: '10px 0', borderBottom: ROW_BORDER }}
  >
    <span style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: LABEL }}>
      {label}
    </span>
    <span
      style={{
        fontFamily: 'var(--ff-body)',
        fontWeight: bold ? 700 : 500,
        fontSize: valueSize ?? 13,
        color: valueColor ?? VALUE,
      }}
    >
      {value}
    </span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4
    style={{
      fontFamily: 'var(--ff-body)',
      fontWeight: 600,
      fontSize: 11,
      color: VIOLET,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginTop: 16,
      marginBottom: 4,
    }}
  >
    {children}
  </h4>
);

const PayrollDetailSheet = ({ record, open, onClose, monthLabel, hideSalary }: Props) => {
  const emp = record?.employees as any;
  const monthYear: string | undefined = record?.month_year;
  const employeeId: string | undefined = record?.employee_id;
  const companyId: string | undefined = record?.company_id;

  const { data: extra } = useQuery({
    queryKey: ['payroll-detail', employeeId, monthYear, companyId],
    enabled: !!employeeId && !!monthYear && !!companyId && open,
    queryFn: async () => {
      const [y, m] = monthYear!.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const startDate = `${monthYear}-01`;
      const endDate = `${monthYear}-${String(last).padStart(2, '0')}`;

      const [attRes, leaveRes, csRes] = await Promise.all([
        supabase
          .from('attendance_records')
          .select('regular_ot_hours, is_late, is_absent')
          .eq('employee_id', employeeId!)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('leave_requests')
          .select('start_date, end_date, days_requested')
          .eq('employee_id', employeeId!)
          .eq('status', 'approved')
          .lte('start_date', endDate)
          .gte('end_date', startDate),
        supabase
          .from('company_settings')
          .select('ot_divisor, shift_start_time, shift_end_time, lunch_break_hours')
          .eq('company_id', companyId!)
          .maybeSingle(),
      ]);

      const att = attRes.data ?? [];
      let shortHours = 0;
      let overtimeHours = 0;
      let lateCount = 0;
      let absentCount = 0;
      for (const r of att) {
        const v = Number(r.regular_ot_hours || 0);
        if (v < 0) shortHours += Math.abs(v);
        else if (v > 0) overtimeHours += v;
        if (r.is_late) lateCount++;
        if (r.is_absent) absentCount++;
      }

      // Clip leave days to month
      let leaveDays = 0;
      const startMs = new Date(startDate + 'T00:00:00').getTime();
      const endMs = new Date(endDate + 'T00:00:00').getTime();
      for (const lr of leaveRes.data ?? []) {
        const ls = new Date(lr.start_date + 'T00:00:00').getTime();
        const le = new Date(lr.end_date + 'T00:00:00').getTime();
        const total = (le - ls) / 86400000 + 1;
        const req = Number(lr.days_requested || total);
        const perDay = total > 0 ? req / total : req;
        const clipS = Math.max(ls, startMs);
        const clipE = Math.min(le, endMs);
        const days = clipE >= clipS ? (clipE - clipS) / 86400000 + 1 : 0;
        leaveDays += days * perDay;
      }

      const cs = csRes.data;
      const otDivisor = Number(cs?.ot_divisor) || 26;
      let workingHoursPerDay = 8;
      if (cs?.shift_start_time && cs?.shift_end_time) {
        const toMin = (t: string) => {
          const [h, m] = t.split(':').map(Number);
          return h * 60 + (m || 0);
        };
        const diff = (toMin(cs.shift_end_time) - toMin(cs.shift_start_time)) / 60;
        workingHoursPerDay = Math.max(1, diff - Number(cs.lunch_break_hours || 0));
      }

      return {
        shortHours,
        overtimeHours,
        lateCount,
        absentCount,
        leaveDays,
        otDivisor,
        workingHoursPerDay,
      };
    },
  });

  if (!record) return null;

  const isDirector = emp?.employment_type === 'director';
  const status: string = record.status || 'draft';
  const statusStyle = statusStyles[status] || statusStyles.draft;

  const basic = Number(record.basic_salary || 0);
  const allowance = Number(record.allowance || 0);
  const bonus = Number(record.bonus || 0);
  const loan = Number(record.loan_deduction || 0);
  const rawRegOtAmt = Number(record.regular_ot_amount || 0);
  const regOtAmt = record.forgo_ot ? 0 : rawRegOtAmt;
  const holOtAmt = Number(record.holiday_ot_amount || 0);
  const totalOtAmt = regOtAmt + holOtAmt;
  const totalSalary = Number(record.total_salary || 0);
  const finalPayment = Number(record.final_payment || 0);

  const regOtHours = Number(record.regular_ot_hours || 0);
  const holOtHours = Number(record.holiday_ot_hours || 0);

  const shortHours = extra?.shortHours ?? (regOtHours < 0 ? Math.abs(regOtHours) : 0);
  const overtimeHours = extra?.overtimeHours ?? (regOtHours > 0 ? regOtHours : 0);
  const lateCount = extra?.lateCount ?? 0;
  const absentCount = extra?.absentCount ?? 0;
  const leaveDays = extra?.leaveDays ?? 0;
  const otDivisor = extra?.otDivisor ?? 26;
  const workingHoursPerDay = extra?.workingHoursPerDay ?? 8;

  const perDay = basic / otDivisor;
  const perHour = perDay / workingHoursPerDay;

  const signColor = (n: number) => (n < 0 ? RED : n > 0 ? GREEN : undefined);

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] sm:max-w-[420px] p-0 overflow-y-auto"
        style={{ transitionDuration: '200ms', transitionTimingFunction: 'ease' }}
      >
        <SheetHeader
          className="px-5 pt-5 pb-4"
          style={{ borderBottom: ROW_BORDER }}
        >
          <SheetTitle asChild>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={emp?.avatar_url || ''} />
                <AvatarFallback className="bg-secondary text-sm">
                  {initials(emp?.full_name || '—')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: VALUE, lineHeight: 1.2 }}
                >
                  {emp?.full_name || '—'}
                </p>
                {emp?.designation && (
                  <p
                    className="truncate mt-0.5"
                    style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: LABEL }}
                  >
                    {emp.designation}
                  </p>
                )}
                <span
                  className="inline-block mt-1.5"
                  style={{
                    backgroundColor: 'rgba(91,63,248,0.08)',
                    color: VIOLET,
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontFamily: 'var(--ff-body)',
                    fontWeight: 500,
                  }}
                >
                  {monthLabel}
                </span>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-5 pb-6">
          {hideSalary ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Compensation details are restricted for this employee.
            </div>
          ) : (
            <>
              <SectionTitle>Salary</SectionTitle>
              <div>
                <Row label="Basic Salary" value={fmtPKR(basic)} />
                <Row label="Fuel Allowance" value={fmtPKR(allowance)} />
                <Row label="Total Base Salary" value={fmtPKR(basic + allowance)} bold />
              </div>

              {!isDirector && (
                <>
                  <SectionTitle>Attendance Summary</SectionTitle>
                  <div>
                    <Row label="Leaves" value={`${leaveDays % 1 === 0 ? leaveDays.toFixed(0) : leaveDays.toFixed(1)} days`} />
                    <Row label="Absents" value={`${absentCount} days`} />
                    <Row label="Lates" value={`${lateCount} times`} />
                    <Row
                      label="Short Time"
                      value={fmtHrs(shortHours)}
                      valueColor={shortHours > 0 ? RED : undefined}
                    />
                    <Row
                      label="Overtime"
                      value={fmtHrs(overtimeHours)}
                      valueColor={overtimeHours > 0 ? GREEN : undefined}
                    />
                    <Row
                      label="Regular Days OT"
                      value={fmtHrs(regOtHours)}
                      valueColor={signColor(regOtHours)}
                    />
                    <Row
                      label="Holiday OT"
                      value={fmtHrs(holOtHours)}
                      valueColor={holOtHours > 0 ? GREEN : undefined}
                    />
                  </div>

                  <SectionTitle>Salary Breakdown</SectionTitle>
                  <div>
                    <Row label="Per Day Salary" value={fmtPKR(perDay)} />
                    <Row label="Per Hour Salary" value={fmtPKR(perHour)} />
                    <Row
                      label="Regular OT Salary"
                      value={fmtPKR(regOtAmt)}
                      valueColor={signColor(regOtAmt)}
                    />
                    <Row
                      label="Holiday OT Salary"
                      value={fmtPKR(holOtAmt)}
                      valueColor={holOtAmt > 0 ? GREEN : undefined}
                    />
                    <Row label="Total OT Salary" value={fmtPKR(totalOtAmt)} bold />
                    {loan > 0 && (
                      <Row
                        label="Loan Deduction"
                        value={`- ${fmtPKR(loan)}`}
                        valueColor={RED}
                      />
                    )}
                    {bonus > 0 && (
                      <Row
                        label="Bonus"
                        value={`+ ${fmtPKR(bonus)}`}
                        valueColor={GREEN}
                      />
                    )}
                  </div>
                </>
              )}

              <SectionTitle>Final</SectionTitle>
              <div>
                <Row label="Total Salary" value={fmtPKR(totalSalary)} bold valueSize={15} />
                <div
                  className="flex items-center justify-between"
                  style={{ padding: '10px 0', borderBottom: ROW_BORDER }}
                >
                  <span style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: LABEL }}>
                    Final Payment
                  </span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: VIOLET }}>
                    {fmtPKR(finalPayment)}
                  </span>
                </div>
                {record.forgo_ot && (
                  <Row label="Forgo Applied" value="Yes" valueColor={GREEN} bold />
                )}
                <div
                  className="flex items-center justify-between"
                  style={{ padding: '10px 0' }}
                >
                  <span style={{ fontFamily: 'var(--ff-body)', fontWeight: 400, fontSize: 13, color: LABEL }}>
                    Status
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--ff-body)',
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PayrollDetailSheet;
