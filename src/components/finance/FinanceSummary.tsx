import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from 'recharts';

interface FinanceSummaryProps {
  companyId: string;
  selectedMonth: string; // '01'..'12'
  selectedYear: string; // 'YYYY'
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const fmtPKR = (v: number) => `PKR ${Math.round(v).toLocaleString()}`;

const buildMonthRange = (year: number, monthIdx: number, count: number) => {
  const months: { key: string; label: string; year: number; monthIdx: number }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(year, monthIdx - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const key = `${y}-${String(m + 1).padStart(2, '0')}`;
    months.push({ key, label: `${MONTH_LABELS[m]} ${String(y).slice(2)}`, year: y, monthIdx: m });
  }
  return months;
};

export const FinanceSummary = ({ companyId, selectedMonth, selectedYear }: FinanceSummaryProps) => {
  const monthIdx = parseInt(selectedMonth, 10) - 1;
  const year = parseInt(selectedYear, 10);

  const months = useMemo(() => buildMonthRange(year, monthIdx, 6), [year, monthIdx]);
  const previousMonthKey = useMemo(() => {
    const d = new Date(year, monthIdx - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, [year, monthIdx]);
  const selectedKey = `${selectedYear}-${selectedMonth}`;

  const rangeKeys = useMemo(() => {
    const set = new Set(months.map(m => m.key));
    set.add(previousMonthKey);
    return Array.from(set);
  }, [months, previousMonthKey]);

  const { data, isLoading } = useQuery({
    queryKey: ['finance-summary', companyId, rangeKeys.join(',')],
    queryFn: async () => {
      const [payrollRes, expensesRes] = await Promise.all([
        supabase
          .from('payroll_records')
          .select('month_year, final_payment, regular_ot_amount, holiday_ot_amount, bonus, loan_deduction')
          .eq('company_id', companyId)
          .eq('superseded', false)
          .in('month_year', rangeKeys),
        supabase
          .from('monthly_expenses')
          .select('month_year, amount')
          .eq('company_id', companyId)
          .in('month_year', rangeKeys),
      ]);
      if (payrollRes.error) throw payrollRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const payrollByMonth: Record<string, number> = {};
      const otByMonth: Record<string, number> = {};
      const bonusByMonth: Record<string, number> = {};
      const loanByMonth: Record<string, number> = {};
      (payrollRes.data ?? []).forEach((r: any) => {
        payrollByMonth[r.month_year] = (payrollByMonth[r.month_year] || 0) + Number(r.final_payment || 0);
        otByMonth[r.month_year] = (otByMonth[r.month_year] || 0) + Number(r.regular_ot_amount || 0) + Number(r.holiday_ot_amount || 0);
        bonusByMonth[r.month_year] = (bonusByMonth[r.month_year] || 0) + Number(r.bonus || 0);
        loanByMonth[r.month_year] = (loanByMonth[r.month_year] || 0) + Number(r.loan_deduction || 0);
      });
      const expensesByMonth: Record<string, number> = {};
      (expensesRes.data ?? []).forEach((r: any) => {
        expensesByMonth[r.month_year] = (expensesByMonth[r.month_year] || 0) + Number(r.amount || 0);
      });
      return { payrollByMonth, otByMonth, bonusByMonth, loanByMonth, expensesByMonth };
    },
    enabled: !!companyId,
  });

  const payrollByMonth = data?.payrollByMonth ?? {};
  const expensesByMonth = data?.expensesByMonth ?? {};
  const otByMonth = data?.otByMonth ?? {};
  const bonusByMonth = data?.bonusByMonth ?? {};
  const loanByMonth = data?.loanByMonth ?? {};

  const totalPayroll = payrollByMonth[selectedKey] ?? 0;
  const totalOT = otByMonth[selectedKey] ?? 0;
  const totalBonus = bonusByMonth[selectedKey] ?? 0;
  const totalLoan = loanByMonth[selectedKey] ?? 0;
  const totalExpenses = expensesByMonth[selectedKey] ?? 0;
  const grandTotal = totalPayroll + totalExpenses;
  const prevGrand = (payrollByMonth[previousMonthKey] ?? 0) + (expensesByMonth[previousMonthKey] ?? 0);

  const hasPrev = prevGrand > 0;
  const pctChange = hasPrev ? ((grandTotal - prevGrand) / prevGrand) * 100 : 0;
  const isLower = pctChange < 0;
  const isHigher = pctChange > 0;

  const chartData = months.map(m => ({
    label: m.label,
    key: m.key,
    payroll: payrollByMonth[m.key] ?? 0,
    expenses: expensesByMonth[m.key] ?? 0,
    grand: (payrollByMonth[m.key] ?? 0) + (expensesByMonth[m.key] ?? 0),
  }));

  const monthsWithData = chartData.filter(p => p.payroll > 0 || p.expenses > 0).length;
  const hasEnoughData = monthsWithData >= 2;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[110px] rounded-[14px]" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[110px] rounded-[14px]" />)}
        </div>
        <Skeleton className="h-[280px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1 — Payroll breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Payroll" value={fmtPKR(totalPayroll)} accent="#5B3FF8" />
        <StatCard label="Total OT Amount" value={fmtPKR(totalOT)} accent="#7C3AED" />
        <StatCard label="Total Bonus" value={fmtPKR(totalBonus)} accent="#10B981" />
        <StatCard label="Total Loan Deductions" value={fmtPKR(totalLoan)} accent="#EF4444" />
      </div>

      {/* Row 2 — Overall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Expenses" value={fmtPKR(totalExpenses)} accent="#F5A623" />
        <StatCard label="Grand Total" value={fmtPKR(grandTotal)} accent="#1A1240" />
        <div
          className="rounded-[14px] border bg-card p-5 flex flex-col gap-1"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            vs Last Month
          </div>
          {!hasPrev ? (
            <div className="text-[15px] font-medium text-muted-foreground mt-1">No prior data</div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {isLower && <ArrowDownRight className="h-5 w-5" style={{ color: '#10B981' }} />}
              {isHigher && <ArrowUpRight className="h-5 w-5" style={{ color: '#EF4444' }} />}
              {!isLower && !isHigher && <Minus className="h-5 w-5 text-muted-foreground" />}
              <span
                className="text-[22px] font-semibold tabular-nums"
                style={{
                  fontFamily: 'var(--ff-display)',
                  color: isLower ? '#10B981' : isHigher ? '#EF4444' : 'hsl(var(--foreground))',
                }}
              >
                {pctChange === 0 ? '0%' : `${isLower ? '' : '+'}${pctChange.toFixed(1)}%`}
              </span>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-auto pt-1">
            Lower spend is better
          </div>
        </div>
      </div>

      {/* Trend graph */}
      <div
        className="rounded-[14px] border bg-card"
        style={{ borderColor: 'hsl(var(--border))', padding: 24 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>
            6-Month Trend
          </h3>
        </div>

        {!hasEnoughData ? (
          <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
            Not enough data yet
          </div>
        ) : (
          <>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    tickFormatter={(v) => {
                      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                      if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                      return String(v);
                    }}
                  />
                  <RTooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="payroll"
                    name="Payroll"
                    stroke="#5B3FF8"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#5B3FF8' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#F5A623"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#F5A623' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 pl-2">
              <LegendDot color="#5B3FF8" label="Payroll" />
              <LegendDot color="#F5A623" label="Expenses" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div
    className="rounded-[14px] border bg-card p-5 flex flex-col gap-2 relative overflow-hidden"
    style={{ borderColor: 'hsl(var(--border))' }}
  >
    <div className="absolute top-0 left-0 h-1 w-full" style={{ background: accent }} />
    <div
      className="text-xs uppercase tracking-wider text-muted-foreground"
      style={{ fontFamily: 'var(--ff-body)' }}
    >
      {label}
    </div>
    <div
      className="text-[22px] font-semibold tabular-nums mt-1"
      style={{ fontFamily: 'var(--ff-display)', color: 'hsl(var(--foreground))' }}
    >
      {value}
    </div>
  </div>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
    <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
      {label}
    </span>
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div
      className="rounded-md border bg-popover px-3 py-2 shadow-md text-xs"
      style={{ borderColor: 'hsl(var(--border))', minWidth: 160 }}
    >
      <div className="font-semibold mb-1.5" style={{ fontFamily: 'var(--ff-display)' }}>
        {label}
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#5B3FF8' }} />
          Payroll
        </span>
        <span className="font-mono">{fmtPKR(point.payroll)}</span>
      </div>
      <div className="flex items-center justify-between gap-6 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#F5A623' }} />
          Expenses
        </span>
        <span className="font-mono">{fmtPKR(point.expenses)}</span>
      </div>
      <div className="flex items-center justify-between gap-6 mt-1.5 pt-1.5 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
        <span className="font-semibold">Grand Total</span>
        <span className="font-mono font-semibold">{fmtPKR(point.grand)}</span>
      </div>
    </div>
  );
};
