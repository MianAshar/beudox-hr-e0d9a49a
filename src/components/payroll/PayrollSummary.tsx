import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownRight, ArrowUpRight, Search, Wallet, Gift, Clock, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from 'recharts';

interface PayrollSummaryProps {
  companyId: string;
  selectedMonth: string;
  selectedYear: string;
  records: any[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtPKR = (v: number) => `PKR ${Math.round(v).toLocaleString()}`;
const fmtPKRShort = (v: number) => {
  if (v >= 1_000_000) return `PKR ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `PKR ${(v / 1_000).toFixed(0)}k`;
  return `PKR ${Math.round(v)}`;
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  paid: { bg: '#EBE6FF', text: '#2B1899' },
};

type ChartRange = '1m' | '6m' | '12m';

const buildMonthRange = (year: number, monthIdx: number, count: number) => {
  const months: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(year, monthIdx - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    months.push({
      key: `${y}-${String(m + 1).padStart(2, '0')}`,
      label: `${MONTH_LABELS[m]} ${String(y).slice(2)}`,
    });
  }
  return months;
};

export const PayrollSummary = ({ companyId, selectedMonth, selectedYear, records }: PayrollSummaryProps) => {
  const monthIdx = parseInt(selectedMonth, 10) - 1;
  const year = parseInt(selectedYear, 10);

  const [chartRange, setChartRange] = useState<ChartRange>('12m');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const previousMonthKey = useMemo(() => {
    const d = new Date(year, monthIdx - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, [year, monthIdx]);

  const trendMonths = useMemo(() => {
    const count = chartRange === '1m' ? 1 : chartRange === '6m' ? 6 : 12;
    return buildMonthRange(year, monthIdx, count);
  }, [year, monthIdx, chartRange]);

  // Trend data fetch (12 months max for reuse across ranges)
  const allRangeKeys = useMemo(() => {
    const set = new Set<string>();
    buildMonthRange(year, monthIdx, 12).forEach(m => set.add(m.key));
    set.add(previousMonthKey);
    return Array.from(set);
  }, [year, monthIdx, previousMonthKey]);

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ['payroll-summary-trend', companyId, allRangeKeys.join(',')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('month_year, final_payment, allowance, regular_ot_amount, holiday_ot_amount, bonus, basic_salary, loan_deduction')
        .eq('company_id', companyId)
        .eq('superseded', false)
        .in('month_year', allRangeKeys);
      if (error) throw error;

      const salaryByMonth: Record<string, number> = {};
      const allowanceByMonth: Record<string, number> = {};
      const otByMonth: Record<string, number> = {};
      const bonusByMonth: Record<string, number> = {};
      const basicByMonth: Record<string, number> = {};
      const loanByMonth: Record<string, number> = {};
      (data ?? []).forEach((r: any) => {
        const my = r.month_year;
        salaryByMonth[my] = (salaryByMonth[my] || 0) + Number(r.final_payment || 0);
        allowanceByMonth[my] = (allowanceByMonth[my] || 0) + Number(r.allowance || 0);
        otByMonth[my] = (otByMonth[my] || 0) + Number(r.regular_ot_amount || 0) + Number(r.holiday_ot_amount || 0);
        bonusByMonth[my] = (bonusByMonth[my] || 0) + Number(r.bonus || 0);
        basicByMonth[my] = (basicByMonth[my] || 0) + Number(r.basic_salary || 0);
        loanByMonth[my] = (loanByMonth[my] || 0) + Number(r.loan_deduction || 0);
      });
      return { salaryByMonth, allowanceByMonth, otByMonth, bonusByMonth, basicByMonth, loanByMonth };
    },
    enabled: !!companyId,
  });

  const selectedKey = `${selectedYear}-${selectedMonth}`;
  const salaryByMonth = trend?.salaryByMonth ?? {};
  const allowanceByMonth = trend?.allowanceByMonth ?? {};
  const otByMonth = trend?.otByMonth ?? {};
  const bonusByMonth = trend?.bonusByMonth ?? {};
  const basicByMonth = trend?.basicByMonth ?? {};
  const loanByMonth = trend?.loanByMonth ?? {};

  const totalSalary = salaryByMonth[selectedKey] ?? 0;
  const totalAllowances = allowanceByMonth[selectedKey] ?? 0;
  const totalOT = otByMonth[selectedKey] ?? 0;
  const totalBonus = bonusByMonth[selectedKey] ?? 0;
  const totalBasic = basicByMonth[selectedKey] ?? 0;
  const totalLoan = loanByMonth[selectedKey] ?? 0;

  const prevSalary = salaryByMonth[previousMonthKey] ?? 0;
  const prevAllowances = allowanceByMonth[previousMonthKey] ?? 0;
  const prevOT = otByMonth[previousMonthKey] ?? 0;
  const prevBonus = bonusByMonth[previousMonthKey] ?? 0;

  const pct = (curr: number, prev: number) => {
    if (prev <= 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  const chartData = trendMonths.map(m => ({
    label: m.label,
    salary: salaryByMonth[m.key] ?? 0,
    ot: otByMonth[m.key] ?? 0,
    bonus: bonusByMonth[m.key] ?? 0,
  }));

  // Breakdown
  const breakdownTotal = totalBasic + totalAllowances + totalOT + totalBonus + totalLoan;
  const segments = breakdownTotal > 0
    ? [
        { key: 'basic', label: 'Basic Salary', value: totalBasic, color: '#5B3FF8' },
        { key: 'allow', label: 'Allowances', value: totalAllowances, color: '#7C6BFF' },
        { key: 'ot', label: 'Overtime', value: totalOT, color: '#F5A623' },
        { key: 'bonus', label: 'Bonuses', value: totalBonus, color: '#1DC97A' },
        { key: 'ded', label: 'Deductions', value: totalLoan, color: '#EF4444' },
      ]
    : [];

  // Payroll list — read-only, derived from passed-in records
  const departments = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => set.add((r.employees as any)?.department || 'Uncategorized'));
    return Array.from(set).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...records]
      .filter(r => {
        const emp = r.employees as any;
        const name = (emp?.full_name || '').toLowerCase();
        const code = (emp?.employee_code || '').toLowerCase();
        if (q && !name.includes(q) && !code.includes(q)) return false;
        if (deptFilter !== 'all' && (emp?.department || 'Uncategorized') !== deptFilter) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const da = ((a.employees as any)?.department || 'Uncategorized');
        const db = ((b.employees as any)?.department || 'Uncategorized');
        if (da !== db) return da.localeCompare(db);
        const na = ((a.employees as any)?.full_name || '');
        const nb = ((b.employees as any)?.full_name || '');
        return na.localeCompare(nb);
      });
  }, [records, search, deptFilter, statusFilter]);

  const initials = (name: string) =>
    name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?';

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Salary"
          value={fmtPKR(totalSalary)}
          delta={pct(totalSalary, prevSalary)}
          icon={Wallet}
          loading={trendLoading}
        />
        <StatCard
          label="Total Allowances"
          value={fmtPKR(totalAllowances)}
          delta={pct(totalAllowances, prevAllowances)}
          icon={Gift}
          loading={trendLoading}
        />
        <StatCard
          label="Total Overtime"
          value={fmtPKR(totalOT)}
          delta={pct(totalOT, prevOT)}
          icon={Clock}
          loading={trendLoading}
        />
        <StatCard
          label="Total Bonuses"
          value={fmtPKR(totalBonus)}
          delta={pct(totalBonus, prevBonus)}
          icon={Sparkles}
          loading={trendLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Payroll Overview Chart */}
        <div
          className="lg:col-span-3 rounded-[14px] border bg-card"
          style={{ borderColor: 'rgba(91,63,248,0.15)', padding: 24 }}
        >
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--ff-display)', color: '#120E36' }}>
              Payroll Overview
            </h3>
            <Select value={chartRange} onValueChange={(v: ChartRange) => setChartRange(v)}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">This Month</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="12m">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {trendLoading ? (
            <Skeleton className="h-[260px] w-full rounded-md" />
          ) : (
            <>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
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
                    <RTooltip content={<OverviewTooltip />} />
                    <Line type="monotone" dataKey="salary" name="Salary" stroke="#5B3FF8" strokeWidth={2} dot={{ r: 3, fill: '#5B3FF8' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="ot" name="Overtime" stroke="#F5A623" strokeWidth={2} dot={{ r: 3, fill: '#F5A623' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="bonus" name="Bonuses" stroke="#1DC97A" strokeWidth={2} dot={{ r: 3, fill: '#1DC97A' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-5 mt-3 pl-1 flex-wrap">
                <LegendDot color="#5B3FF8" label="Total Salary" />
                <LegendDot color="#F5A623" label="Total OT" />
                <LegendDot color="#1DC97A" label="Total Bonuses" />
              </div>
            </>
          )}
        </div>

        {/* Payroll Breakdown */}
        <div
          className="lg:col-span-2 rounded-[14px] border bg-card"
          style={{ borderColor: 'rgba(91,63,248,0.15)', padding: 24 }}
        >
          <h3 className="text-[15px] font-semibold mb-1" style={{ fontFamily: 'var(--ff-display)', color: '#120E36' }}>
            Payroll Breakdown
          </h3>
          <div className="text-xs text-muted-foreground mb-3">Total Pay This Month</div>
          <div
            className="tabular-nums mb-4"
            style={{ fontFamily: 'var(--ff-display)', fontSize: 26, fontWeight: 700, color: '#120E36' }}
          >
            {fmtPKR(totalSalary)}
          </div>

          {trendLoading ? (
            <Skeleton className="h-[180px] w-full rounded-md" />
          ) : breakdownTotal === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
              No data for this month
            </div>
          ) : (
            <>
              {/* Stacked bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: 'hsl(var(--muted))' }}>
                {segments.map(s => {
                  const pctVal = (s.value / breakdownTotal) * 100;
                  if (pctVal <= 0) return null;
                  return (
                    <div
                      key={s.key}
                      title={`${s.label}: ${fmtPKR(s.value)} (${pctVal.toFixed(1)}%)`}
                      style={{ width: `${pctVal}%`, background: s.color }}
                    />
                  );
                })}
              </div>

              {/* Legend list */}
              <div className="mt-4 space-y-2.5">
                {segments.map(s => {
                  const pctVal = breakdownTotal > 0 ? (s.value / breakdownTotal) * 100 : 0;
                  return (
                    <div key={s.key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="truncate" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>{s.label}</span>
                        <span className="text-muted-foreground text-xs shrink-0">— {pctVal.toFixed(1)}%</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground shrink-0 ml-2">{fmtPKRShort(s.value)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payroll List */}
      <div
        className="rounded-[14px] border bg-card overflow-hidden"
        style={{ borderColor: 'rgba(91,63,248,0.15)' }}
      >
        <div className="p-4 flex items-center justify-between gap-3 flex-wrap border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--ff-display)', color: '#120E36' }}>
            Payroll List
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employee or code…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9 w-[220px] text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">Allowance</TableHead>
                <TableHead className="text-right">OT</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Loan Ded.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No employees match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map(rec => {
                  const emp = rec.employees as any;
                  const style = statusStyles[rec.status] || statusStyles.draft;
                  const otAmount = Number(rec.regular_ot_amount) + Number(rec.holiday_ot_amount);
                  return (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp?.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px]" style={{ background: '#EBE6FF', color: '#2B1899' }}>
                              {initials(emp?.full_name || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: '#120E36' }}>
                              {emp?.full_name || '—'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {emp?.designation || emp?.department || '—'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{Number(rec.basic_salary).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{Number(rec.allowance).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{otAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{Number(rec.bonus).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{Number(rec.loan_deduction).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">{Number(rec.final_payment).toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  delta,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  delta: number | null;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  loading?: boolean;
}) => {
  if (loading) return <Skeleton className="h-[110px] rounded-[14px]" />;
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;
  return (
    <div
      className="rounded-[14px] bg-card p-4 flex items-start justify-between gap-3"
      style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(91,63,248,0.15)' }}
    >
      <div className="flex flex-col min-w-0">
        <div
          className="uppercase text-muted-foreground"
          style={{ fontFamily: 'var(--ff-body)', fontSize: 11, letterSpacing: '0.04em' }}
        >
          {label}
        </div>
        <div
          className="tabular-nums truncate mt-1"
          style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 700, color: '#120E36' }}
        >
          {value}
        </div>
        {delta === null ? (
          <div className="text-[11px] text-muted-foreground mt-1.5">No prior data</div>
        ) : (
          <div className="flex items-center gap-1 mt-1.5 text-[11px] font-medium">
            {isUp && <ArrowUpRight className="h-3 w-3" style={{ color: '#1DC97A' }} />}
            {isDown && <ArrowDownRight className="h-3 w-3" style={{ color: '#EF4444' }} />}
            <span style={{ color: isUp ? '#1DC97A' : isDown ? '#EF4444' : 'hsl(var(--muted-foreground))' }}>
              {delta === 0 ? '0%' : `${isUp ? '+' : ''}${delta.toFixed(1)}%`}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'rgba(91,63,248,0.08)' }}
      >
        <Icon className="h-4 w-4" style={{ color: '#5B3FF8' }} />
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
    <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{label}</span>
  </div>
);

const OverviewTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div
      className="rounded-md border bg-popover px-3 py-2 shadow-md text-xs"
      style={{ borderColor: 'hsl(var(--border))', minWidth: 180 }}
    >
      <div className="font-semibold mb-1.5" style={{ fontFamily: 'var(--ff-display)' }}>{label}</div>
      <Row color="#5B3FF8" label="Salary" value={fmtPKR(p.salary)} />
      <Row color="#F5A623" label="Overtime" value={fmtPKR(p.ot)} />
      <Row color="#1DC97A" label="Bonuses" value={fmtPKR(p.bonus)} />
    </div>
  );
};

const Row = ({ color, label, value }: { color: string; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-6 mt-1">
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
    <span className="font-mono">{value}</span>
  </div>
);
