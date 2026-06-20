import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CalendarCheck, Loader2, TrendingUp, Clock, AlertTriangle,
  Users, Percent, UserX, Timer,
} from 'lucide-react';
import { formatTime12h } from '@/lib/attendance-format';

interface Props {
  companyId: string;
  startDate: string;
  endDate: string;
  monthYearLabel: string;
  year: number;
  monthIndex: number; // 0-based
}

interface AttendanceRow {
  id: string;
  employee_id: string | null;
  employee_code: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  regular_ot_hours: number | null;
  holiday_ot_hours: number | null;
  is_late: boolean | null;
  is_absent: boolean | null;
  is_weekend: boolean | null;
  is_holiday: boolean | null;
}

interface EmployeeLite {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface HolidayRow {
  date: string;
  end_date: string | null;
  is_recurring: boolean;
  year: number | null;
}

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const fmtNum = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtHours = (n: number) => `${n.toFixed(2)} hrs`;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function eachDate(start: string, end: string): string[] {
  const out: string[] = [];
  const s = new Date(`${start}T00:00:00Z`);
  const e = new Date(`${end}T00:00:00Z`);
  for (let d = new Date(s); d <= e; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function StatCard({
  icon: Icon, label, value, accent, sub,
}: {
  icon: any; label: string; value: string; accent?: 'violet' | 'green' | 'amber' | 'default';
  sub?: string;
}) {
  const colors = {
    violet: { bg: 'rgba(91, 63, 248, 0.08)', fg: '#5B3FF8' },
    green: { bg: 'rgba(29, 201, 122, 0.10)', fg: '#0F8C52' },
    amber: { bg: 'rgba(245, 158, 11, 0.10)', fg: '#B45309' },
    default: { bg: 'hsl(var(--secondary))', fg: 'hsl(var(--foreground))' },
  }[accent ?? 'default'];

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-semibold" style={{ fontFamily: 'var(--ff-display)', color: colors.fg }}>
            {value}
          </p>
          {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
          <Icon className="h-4 w-4" style={{ color: colors.fg }} />
        </div>
      </div>
    </Card>
  );
}

function AnomalyRow({
  emp, count, label, tone,
}: {
  emp: EmployeeLite; count: number; label: string; tone: 'orange' | 'violet';
}) {
  const fg = tone === 'orange' ? '#B45309' : '#5B3FF8';
  const bg = tone === 'orange' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(91, 63, 248, 0.08)';
  return (
    <div className="flex items-center gap-3 p-2 rounded-md" style={{ backgroundColor: bg }}>
      <Avatar className="h-7 w-7">
        <AvatarImage src={emp.avatar_url || ''} />
        <AvatarFallback className="text-[9px] bg-secondary">{initials(emp.full_name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">{emp.full_name}</p>
      </div>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: fg }}>
        {count} {label}
      </span>
    </div>
  );
}

const AttendanceSummary = ({
  companyId, startDate, endDate, monthYearLabel, year, monthIndex,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [employees, setEmployees] = useState<Map<string, EmployeeLite>>(new Map());
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());
  const [leaveDatesByEmp, setLeaveDatesByEmp] = useState<Map<string, Set<string>>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [recRes, empRes, holRes, leaveRes] = await Promise.all([
          supabase
            .from('attendance_records')
            .select('id, employee_id, employee_code, date, check_in, check_out, working_hours, regular_ot_hours, holiday_ot_hours, is_late, is_absent, is_weekend, is_holiday')
            .eq('company_id', companyId)
            .gte('date', startDate)
            .lte('date', endDate)
            .limit(10000),
          supabase
            .from('employees')
            .select('id, full_name, avatar_url, status')
            .eq('company_id', companyId),
          supabase
            .from('public_holidays')
            .select('date, end_date, is_recurring, year')
            .eq('company_id', companyId),
          supabase
            .from('leave_requests')
            .select('employee_id, start_date, end_date')
            .eq('company_id', companyId)
            .eq('status', 'approved')
            .lte('start_date', endDate)
            .gte('end_date', startDate),
        ]);

        if (cancelled) return;

        const rows = (recRes.data ?? []) as AttendanceRow[];
        const empRows = (empRes.data ?? []) as Array<EmployeeLite & { status: string }>;
        const holRows = (holRes.data ?? []) as HolidayRow[];

        const empMap = new Map<string, EmployeeLite>();
        let activeCount = 0;
        empRows.forEach(e => {
          empMap.set(e.id, { id: e.id, full_name: e.full_name, avatar_url: e.avatar_url });
          if (e.status === 'active') activeCount++;
        });

        // Build holiday date set scoped to selected month
        const holSet = new Set<string>();
        holRows.forEach(h => {
          const expand = (startISO: string, endISO: string | null) => {
            const dates = eachDate(startISO, endISO ?? startISO);
            dates.forEach(d => {
              if (d >= startDate && d <= endDate) holSet.add(d);
            });
          };
          if (h.is_recurring) {
            const orig = new Date(`${h.date}T00:00:00Z`);
            const mm = String(orig.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(orig.getUTCDate()).padStart(2, '0');
            const recurStart = `${year}-${mm}-${dd}`;
            let recurEnd = recurStart;
            if (h.end_date) {
              const ed = new Date(`${h.end_date}T00:00:00Z`);
              const em = String(ed.getUTCMonth() + 1).padStart(2, '0');
              const edd = String(ed.getUTCDate()).padStart(2, '0');
              recurEnd = `${year}-${em}-${edd}`;
            }
            expand(recurStart, recurEnd);
          } else {
            expand(h.date, h.end_date);
          }
        });

        // Build per-employee leave date set within the month window
        const leaveMap = new Map<string, Set<string>>();
        (leaveRes.data ?? []).forEach((lr: any) => {
          if (!lr.employee_id) return;
          const dates = eachDate(lr.start_date, lr.end_date);
          dates.forEach(d => {
            if (d < startDate || d > endDate) return;
            if (!leaveMap.has(lr.employee_id)) leaveMap.set(lr.employee_id, new Set());
            leaveMap.get(lr.employee_id)!.add(d);
          });
        });

        setRecords(rows);
        setEmployees(empMap);
        setActiveEmployeeCount(activeCount);
        setHolidayDates(holSet);
        setLeaveDatesByEmp(leaveMap);
      } catch (err) {
        console.error('Summary load failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [companyId, startDate, endDate, year]);

  const metrics = useMemo(() => {
    // Working days = weekdays (Mon-Fri) in the month minus public holidays
    const allDates = eachDate(startDate, endDate);
    const workingDays = allDates.filter(d => {
      const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
      const isWeekday = dow >= 1 && dow <= 5;
      return isWeekday && !holidayDates.has(d);
    });
    const workingDaysCount = workingDays.length;
    const workingDaySet = new Set(workingDays);

    // Present = has a record AND not absent AND has check_in
    const presentRecords = records.filter(r => !r.is_absent && r.check_in);
    const presentCount = presentRecords.length;

    // Absences from records
    const absentRecords = records.filter(r => r.is_absent);

    // Per-employee map of working days they had a record for
    const empRecordedDays = new Map<string, Set<string>>();
    records.forEach(r => {
      if (!r.employee_id) return;
      if (!empRecordedDays.has(r.employee_id)) empRecordedDays.set(r.employee_id, new Set());
      empRecordedDays.get(r.employee_id)!.add(r.date);
    });

    // Implicit absences: active employees with no record AND no approved leave on a working day
    let implicitAbsences = 0;
    employees.forEach((_emp, empId) => {
      const seen = empRecordedDays.get(empId) ?? new Set<string>();
      const leaves = leaveDatesByEmp.get(empId) ?? new Set<string>();
      workingDaySet.forEach(d => { if (!seen.has(d) && !leaves.has(d)) implicitAbsences++; });
    });
    const totalAbsences = absentRecords.length + implicitAbsences;

    const lateCount = records.filter(r => r.is_late).length;

    const attendanceRate = activeEmployeeCount > 0 && workingDaysCount > 0
      ? (presentCount / (activeEmployeeCount * workingDaysCount)) * 100
      : 0;

    // Overtime
    const totalRegOT = records.reduce((s, r) => s + Math.max(0, Number(r.regular_ot_hours ?? 0)), 0);
    const totalHolOT = records.reduce((s, r) => s + Number(r.holiday_ot_hours ?? 0), 0);
    const totalOT = totalRegOT + totalHolOT;

    // Top OT employees
    const otByEmp = new Map<string, number>();
    records.forEach(r => {
      if (!r.employee_id) return;
      const ot = Math.max(0, Number(r.regular_ot_hours ?? 0)) + Number(r.holiday_ot_hours ?? 0);
      if (ot <= 0) return;
      otByEmp.set(r.employee_id, (otByEmp.get(r.employee_id) ?? 0) + ot);
    });
    const topOT = Array.from(otByEmp.entries())
      .map(([id, hours]) => ({ emp: employees.get(id), hours }))
      .filter(x => x.emp)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    // Late rate
    const lateRate = presentCount > 0 ? (lateCount / presentCount) * 100 : 0;

    // Most late day of week
    const lateByDow = new Array(7).fill(0);
    records.filter(r => r.is_late).forEach(r => {
      const dow = new Date(`${r.date}T00:00:00Z`).getUTCDay();
      lateByDow[dow]++;
    });
    let mostLateIdx = -1;
    let mostLateCount = 0;
    lateByDow.forEach((c, i) => { if (c > mostLateCount) { mostLateCount = c; mostLateIdx = i; } });

    // Avg check-in time across present weekday records
    let totalMinutes = 0;
    let checkInCount = 0;
    presentRecords.forEach(r => {
      const dow = new Date(`${r.date}T00:00:00Z`).getUTCDay();
      if (dow < 1 || dow > 5) return;
      if (!r.check_in) return;
      const d = new Date(r.check_in);
      if (Number.isNaN(d.getTime())) return;
      totalMinutes += d.getHours() * 60 + d.getMinutes();
      checkInCount++;
    });
    const avgCheckInMinutes = checkInCount > 0 ? totalMinutes / checkInCount : null;
    let avgCheckInLabel = '—';
    if (avgCheckInMinutes != null) {
      const h = Math.floor(avgCheckInMinutes / 60);
      const m = Math.round(avgCheckInMinutes % 60);
      avgCheckInLabel = formatTime12h(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }

    // Anomalies
    // Absences per employee (records-based + implicit)
    const absencesByEmp = new Map<string, number>();
    absentRecords.forEach(r => {
      if (!r.employee_id) return;
      absencesByEmp.set(r.employee_id, (absencesByEmp.get(r.employee_id) ?? 0) + 1);
    });
    employees.forEach((_e, empId) => {
      const seen = empRecordedDays.get(empId) ?? new Set<string>();
      const leaves = leaveDatesByEmp.get(empId) ?? new Set<string>();
      let missed = 0;
      workingDaySet.forEach(d => { if (!seen.has(d) && !leaves.has(d)) missed++; });
      if (missed > 0) absencesByEmp.set(empId, (absencesByEmp.get(empId) ?? 0) + missed);
    });
    const highAbsence = Array.from(absencesByEmp.entries())
      .filter(([, c]) => c >= 3)
      .map(([id, c]) => ({ emp: employees.get(id), count: c }))
      .filter(x => x.emp)
      .sort((a, b) => b.count - a.count);

    // Single punch records (one of check_in/check_out missing)
    const singlePunchByEmp = new Map<string, number>();
    records.forEach(r => {
      const single = (!r.check_in && r.check_out) || (r.check_in && !r.check_out);
      if (!single || !r.employee_id) return;
      singlePunchByEmp.set(r.employee_id, (singlePunchByEmp.get(r.employee_id) ?? 0) + 1);
    });
    const singlePunch = Array.from(singlePunchByEmp.entries())
      .map(([id, c]) => ({ emp: employees.get(id), count: c }))
      .filter(x => x.emp)
      .sort((a, b) => b.count - a.count);

    // Weekend workers (worked on a weekend day or holiday)
    const weekendByEmp = new Map<string, Set<string>>();
    records.forEach(r => {
      if (!r.employee_id || !r.check_in) return;
      const dow = new Date(`${r.date}T00:00:00Z`).getUTCDay();
      const isWE = dow === 0 || dow === 6 || holidayDates.has(r.date);
      if (!isWE) return;
      if (!weekendByEmp.has(r.employee_id)) weekendByEmp.set(r.employee_id, new Set());
      weekendByEmp.get(r.employee_id)!.add(r.date);
    });
    const weekendWorkers = Array.from(weekendByEmp.entries())
      .map(([id, days]) => ({ emp: employees.get(id), count: days.size }))
      .filter(x => x.emp)
      .sort((a, b) => b.count - a.count);

    return {
      workingDaysCount,
      attendanceRate,
      totalAbsences,
      lateCount,
      totalOT,
      totalHolOT,
      topOT,
      lateRate,
      mostLateLabel: mostLateIdx >= 0 ? `${DAY_NAMES[mostLateIdx]} — ${mostLateCount} late${mostLateCount === 1 ? '' : 's'}` : '—',
      avgCheckInLabel,
      highAbsence,
      singlePunch,
      weekendWorkers,
    };
  }, [records, employees, activeEmployeeCount, holidayDates, leaveDatesByEmp, startDate, endDate]);

  if (loading) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading attendance summary…</p>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <CalendarCheck className="mb-3" style={{ width: 48, height: 48, color: '#9490B4' }} />
        <p className="text-sm font-medium text-foreground">No attendance data for {monthYearLabel}</p>
        <p className="text-xs text-muted-foreground mt-1">Import attendance records to see insights.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1 — Attendance Overview */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Attendance Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Working Days" value={fmtNum(metrics.workingDaysCount)}
            sub={`Mon-Fri in ${monthYearLabel}`} />
          <StatCard icon={Percent} label="Attendance Rate" value={fmtPct(metrics.attendanceRate)}
            accent="violet" sub={`${activeEmployeeCount} active employees`} />
          <StatCard icon={UserX} label="Total Absences" value={fmtNum(metrics.totalAbsences)} accent="amber" />
          <StatCard icon={Clock} label="Late Arrivals" value={fmtNum(metrics.lateCount)} accent="amber" />
        </div>
      </div>

      {/* Section 2 — Overtime Insights */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Overtime Insights
        </h3>
        <Card className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(29, 201, 122, 0.08)' }}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Overtime Hours</p>
              <p className="mt-1.5 text-2xl font-semibold" style={{ fontFamily: 'var(--ff-display)', color: '#0F8C52' }}>
                {fmtHours(metrics.totalOT)}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(91, 63, 248, 0.08)' }}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekend / Holiday OT</p>
              <p className="mt-1.5 text-2xl font-semibold" style={{ fontFamily: 'var(--ff-display)', color: '#5B3FF8' }}>
                {fmtHours(metrics.totalHolOT)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Top 5 Overtime Employees
            </p>
            {metrics.topOT.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">No overtime recorded this month</p>
            ) : (
              <div className="space-y-2">
                {metrics.topOT.map((row, i) => (
                  <div key={row.emp!.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/40 transition-colors">
                    <span className="w-5 text-xs font-semibold text-muted-foreground text-center">{i + 1}</span>
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={row.emp!.avatar_url || ''} />
                      <AvatarFallback className="text-[9px] bg-secondary">{initials(row.emp!.full_name)}</AvatarFallback>
                    </Avatar>
                    <p className="flex-1 text-sm font-medium text-foreground truncate">{row.emp!.full_name}</p>
                    <span className="text-sm font-mono tabular-nums" style={{ color: '#0F8C52' }}>
                      {fmtHours(row.hours)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Section 3 — Punctuality & Anomalies */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Punctuality & Anomalies
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left — Punctuality */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4" style={{ color: '#5B3FF8' }} />
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                Punctuality
              </p>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Late Arrival Rate</span>
              <span className="text-sm font-semibold text-foreground">{fmtPct(metrics.lateRate)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Most Late Day</span>
              <span className="text-sm font-semibold text-foreground">{metrics.mostLateLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" /> Avg Check-in Time
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">{metrics.avgCheckInLabel}</span>
            </div>
          </Card>

          {/* Right — Anomalies */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4" style={{ color: '#B45309' }} />
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                Anomalies
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Frequent absences (3+)
              </p>
              {metrics.highAbsence.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">None</p>
              ) : (
                <div className="space-y-1.5">
                  {metrics.highAbsence.map(x => (
                    <AnomalyRow key={`abs-${x.emp!.id}`} emp={x.emp!} count={x.count} label="absences" tone="orange" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Incomplete records
              </p>
              {metrics.singlePunch.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">None</p>
              ) : (
                <div className="space-y-1.5">
                  {metrics.singlePunch.map(x => (
                    <AnomalyRow key={`sp-${x.emp!.id}`} emp={x.emp!} count={x.count} label="incomplete records" tone="orange" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Worked on weekends / holidays
              </p>
              {metrics.weekendWorkers.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">None</p>
              ) : (
                <div className="space-y-1.5">
                  {metrics.weekendWorkers.map(x => (
                    <AnomalyRow key={`we-${x.emp!.id}`} emp={x.emp!} count={x.count} label="weekend days" tone="violet" />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
