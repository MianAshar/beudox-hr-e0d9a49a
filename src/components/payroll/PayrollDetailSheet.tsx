import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const statusStyles: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  paid: { bg: '#EBE6FF', text: '#2B1899' },
};

const initials = (name: string) =>
  (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const fmtPKR = (n: number) =>
  `PKR ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtHrs = (n: number) =>
  `${Number(n || 0).toFixed(2)} hrs`;

interface Props {
  record: any | null;
  open: boolean;
  onClose: () => void;
  monthLabel: string;
  hideSalary?: boolean;
}

const Row = ({
  label, value, valueColor, bold,
}: { label: string; value: string; valueColor?: string; bold?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span
      className={`font-mono tabular-nums ${bold ? 'font-semibold' : ''} text-sm`}
      style={{ color: valueColor }}
    >
      {value}
    </span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4
    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-5 mb-1"
    style={{ fontFamily: 'var(--ff-body)' }}
  >
    {children}
  </h4>
);

const PayrollDetailSheet = ({ record, open, onClose, monthLabel, hideSalary }: Props) => {
  const emp = record?.employees as any;
  const monthYear: string | undefined = record?.month_year;
  const employeeId: string | undefined = record?.employee_id;

  const { data: attendance } = useQuery({
    queryKey: ['payroll-detail-attendance', employeeId, monthYear],
    queryFn: async () => {
      if (!employeeId || !monthYear) return [];
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('attendance_records')
        .select('regular_ot_hours')
        .eq('employee_id', employeeId)
        .gte('date', `${monthYear}-01`)
        .lte('date', `${monthYear}-${String(last).padStart(2, '0')}`);
      return data ?? [];
    },
    enabled: !!employeeId && !!monthYear && open,
  });

  if (!record) return null;
  const isDirector = emp?.employment_type === 'director';
  const status: string = record.status || 'draft';
  const statusStyle = statusStyles[status] || statusStyles.draft;

  const basic = Number(record.basic_salary || 0);
  const allowance = Number(record.allowance || 0);
  const bonus = Number(record.bonus || 0);
  const dinner = Number(record.dinner_expense || 0);
  const loan = Number(record.loan_deduction || 0);
  const regOtAmt = Number(record.regular_ot_amount || 0);
  const holOtAmt = Number(record.holiday_ot_amount || 0);
  const totalOtAmt = regOtAmt + holOtAmt;
  const totalSalary = Number(record.total_salary || 0);
  const finalPayment = Number(record.final_payment || 0);

  const regOtHours = Number(record.regular_ot_hours || 0);
  const holOtHours = Number(record.holiday_ot_hours || 0);

  let shortHours = 0;
  let overtimeHours = 0;
  if (attendance && attendance.length > 0) {
    for (const r of attendance) {
      const v = Number(r.regular_ot_hours || 0);
      if (v < 0) shortHours += Math.abs(v);
      else if (v > 0) overtimeHours += v;
    }
  } else {
    // Fallback: derive from net sign only
    shortHours = regOtHours < 0 ? Math.abs(regOtHours) : 0;
    overtimeHours = regOtHours > 0 ? regOtHours : 0;
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent
        side="right"
        className="w-[400px] sm:max-w-[400px] p-0 overflow-y-auto"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <SheetTitle asChild>
            <div className="flex items-center gap-3">
              <Avatar className="h-[52px] w-[52px]">
                <AvatarImage src={emp?.avatar_url || ''} />
                <AvatarFallback className="bg-secondary text-sm">
                  {initials(emp?.full_name || '—')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p
                  className="truncate text-foreground"
                  style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}
                >
                  {emp?.full_name || '—'}
                </p>
                {emp?.designation && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{emp.designation}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{monthLabel}</p>
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
              {!isDirector && (
                <>
                  <SectionTitle>Overtime &amp; Short Time</SectionTitle>
                  <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
                    <Row
                      label="Short Time"
                      value={fmtHrs(shortHours)}
                      valueColor={shortHours > 0 ? '#E84545' : undefined}
                    />
                    <Row
                      label="Overtime"
                      value={fmtHrs(overtimeHours)}
                      valueColor={overtimeHours > 0 ? '#0F8C52' : undefined}
                    />
                    <Row label="Net Regular OT" value={fmtHrs(regOtHours)} />
                    <Row label="Holiday OT" value={fmtHrs(holOtHours)} />
                  </div>

                  <SectionTitle>OT Amounts</SectionTitle>
                  <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
                    <Row label="Regular OT Amount" value={fmtPKR(regOtAmt)} />
                    <Row label="Holiday OT Amount" value={fmtPKR(holOtAmt)} />
                    <Row label="Total OT" value={fmtPKR(totalOtAmt)} bold />
                  </div>
                </>
              )}

              <SectionTitle>Salary Breakdown</SectionTitle>
              <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
                <Row label="Basic Salary" value={fmtPKR(basic)} />
                <Row label="Allowance" value={fmtPKR(allowance)} />
                {bonus > 0 && <Row label="Bonus" value={fmtPKR(bonus)} />}
                {loan > 0 && <Row label="Loan Deduction" value={`- ${fmtPKR(loan)}`} valueColor="#E84545" />}
                {dinner > 0 && <Row label="Dinner Expense" value={fmtPKR(dinner)} />}
              </div>

              <SectionTitle>Final</SectionTitle>
              <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
                <Row label="Total Salary" value={fmtPKR(totalSalary)} bold />
              </div>

              <div
                className="mt-4 rounded-xl p-4 flex items-center justify-between"
                style={{ backgroundColor: 'rgba(91, 63, 248, 0.08)' }}
              >
                <span className="text-sm font-medium" style={{ color: '#5B3FF8' }}>
                  Final Payment
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{ color: '#5B3FF8', fontFamily: 'var(--ff-display)', fontSize: '22px', fontWeight: 700 }}
                >
                  {fmtPKR(finalPayment)}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PayrollDetailSheet;
