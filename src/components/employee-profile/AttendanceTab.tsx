import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CalendarX2, AlertTriangle, Pencil } from 'lucide-react';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';
import MissingEntryModal, { MissingEntryTarget } from '@/components/attendance/MissingEntryModal';

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

const SummaryCard = ({ label, value, accent }: { label: string; value: string | number; accent?: string }) => (
  <div className="bg-card rounded-[12px] border p-4">
    <p className="text-[11px] text-muted-foreground mb-1" style={{ fontFamily: 'var(--ff-body)' }}>{label}</p>
    <p className={`text-[22px] font-bold ${accent || 'text-foreground'}`} style={{ fontFamily: 'var(--ff-display)' }}>{value}</p>
  </div>
);

const AttendanceTab = ({ employeeId }: { employeeId: string }) => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [editTarget, setEditTarget] = useState<MissingEntryTarget | null>(null);

  const { employee: authEmp } = useAuth();
  const isCeo = (authEmp?.roles ?? []).includes('ceo');
  const companyId = authEmp?.company_id;
  const qc = useQueryClient();

  const startDate = `${year}-${month}-01`;
  const endDate = (() => {
    const d = new Date(Number(year), Number(month), 0);
    return `${year}-${month}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const monthYear = `${year}-${month}`;

  // Payroll lock check
  const { data: attendanceLocked } = useQuery({
    queryKey: ['att-tab-payroll-lock', companyId, monthYear],
    queryFn: async () => {
      const { data } = await supabase
        .from('payroll_records')
        .select('status')
        .eq('company_id', companyId!)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .in('status', ['approved', 'paid'])
        .limit(1);
      return (data?.length ?? 0) > 0;
    },
    enabled: !!companyId,
  });

  // Fetch employee info needed for modal (code + name)
  const { data: empInfo } = useQuery({
    queryKey: ['att-tab-emp-info', employeeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('employee_code, full_name')
        .eq('id', employeeId)
        .maybeSingle();
      return data;
    },
    enabled: !!employeeId,
  });

  // Company settings for shift calculations
  const { data: settings } = useQuery({
    queryKey: ['att-tab-settings', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time, lunch_break_hours')
        .eq('company_id', companyId!)
        .maybeSingle();
      return data;
    },
    enabled: !!companyId,
  });

  const shiftStart = settings?.shift_start_time ?? '09:00:00';
  const shiftEnd = settings?.shift_end_time ?? '18:00:00';
  const lunchBreakHours = Number(settings?.lunch_break_hours ?? 1);
  const parseT = (t: string) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };
  const shiftDuration = Math.max(0, parseT(shiftEnd) - parseT(shiftStart) - lunchBreakHours);

  const { data: records, isLoading } = useQuery({
    queryKey: ['employee-attendance', employeeId, year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!employeeId,
  });

  const { data: leaveData } = useQuery({
    queryKey: ['employee-attendance-leaves', employeeId, year, month],
    queryFn: async () => {
      const { data } = await supabase
        .from('leave_requests')
        .select('status, days_requested, approved_days, start_date, end_date, leave_types(name)')
        .eq('employee_id', employeeId)
        .in('status', ['approved', 'partially_approved'])
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
        .order('start_date');
      return data || [];
    },
    enabled: !!employeeId,
  });

  const paidLeaveDays = useMemo(() => {
    return (leaveData || []).reduce((sum, lr: any) => {
      if (lr.status === 'partially_approved') {
        return sum + Number(lr.approved_days || 0);
      }
      // For fully approved — count days that overlap with this month only
      const s = new Date(Math.max(new Date(lr.start_date).getTime(), new Date(startDate).getTime()));
      const e = new Date(Math.min(new Date(lr.end_date).getTime(), new Date(endDate).getTime()));
      let count = 0;
      const cur = new Date(s);
      while (cur <= e) {
        const dow = cur.getDay();
        if (dow !== 0 && dow !== 6) count++; // exclude weekends
        cur.setDate(cur.getDate() + 1);
      }
      return sum + count;
    }, 0);
  }, [leaveData, startDate, endDate]);

  const summary = useMemo(() => {
    const list = records || [];
    return {
      present: list.filter(r => !r.is_absent && !r.is_weekend && !r.is_holiday).length,
      absent: list.filter(r => r.is_absent).length,
      late: list.filter(r => r.is_late).length,
      ot: list.reduce((s, r) => s + Number(r.regular_ot_hours || 0) + Number(r.holiday_ot_hours || 0), 0),
    };
  }, [records]);

  const fmtTime = (t: string | null) => t ? formatTime12h(parseISO(t)) : '—';

  return (
    <div className="space-y-6">
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

      {isCeo && attendanceLocked && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #F5C6A0' }}>
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Attendance is locked for this month — payroll has been approved.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard label="Present Days" value={summary.present} accent="text-[hsl(var(--bx-success-text))]" />
        <SummaryCard label="Absent Days" value={summary.absent} accent="text-[hsl(var(--bx-danger-text))]" />
        <SummaryCard label="Late Arrivals" value={summary.late} accent="text-[hsl(var(--bx-warning-text))]" />
        <SummaryCard label="Total OT Hours" value={summary.ot.toFixed(1)} />
        <SummaryCard label="Paid Leaves" value={paidLeaveDays} accent="text-primary" />
      </div>

      <div className="bg-card rounded-[14px] border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : (records || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CalendarX2 className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-[13px]" style={{ fontFamily: 'var(--ff-body)' }}>No attendance records for this month.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Working Hrs</TableHead>
                <TableHead>OT Hrs</TableHead>
                <TableHead>Status</TableHead>
                {isCeo && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records!.map(r => {
                const d = parseISO(r.date);
                const ot = Number(r.regular_ot_hours || 0) + Number(r.holiday_ot_hours || 0);
                let status = 'Present';
                let cls = 'bg-bx-success-bg text-[hsl(var(--bx-success-text))]';
                if (r.is_absent) { status = 'Absent'; cls = 'bg-bx-danger-bg text-[hsl(var(--bx-danger-text))]'; }
                else if (r.is_holiday) { status = 'Holiday'; cls = 'bg-bx-violet-light text-primary'; }
                else if (r.is_weekend) { status = 'Weekend'; cls = 'bg-muted text-muted-foreground'; }
                else if (r.is_late) { status = 'Late'; cls = 'bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]'; }
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-[13px]">{format(d, 'd MMM yyyy')}</TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">{format(d, 'EEEE')}</TableCell>
                    <TableCell className="text-[13px] font-mono">{fmtTime(r.check_in)}</TableCell>
                    <TableCell className="text-[13px] font-mono">{fmtTime(r.check_out)}</TableCell>
                    <TableCell className="text-[13px] font-mono">{r.working_hours == null ? '—' : formatWorkingHours(Number(r.working_hours))}</TableCell>
                    <TableCell className="text-[13px] font-mono">{ot.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] border-0 ${cls}`}>{status}</Badge>
                    </TableCell>
                    {isCeo && (
                      <TableCell>
                        {!r.is_weekend && !r.is_holiday && !attendanceLocked && (
                          <button
                            type="button"
                            onClick={() => setEditTarget({
                              recordId: r.id,
                              employeeId,
                              employeeName: empInfo?.full_name ?? null,
                              employeeCode: empInfo?.employee_code ?? null,
                              date: r.date,
                              field: 'both',
                              mode: r.is_absent ? 'insert' : 'update',
                              existingCheckIn: r.check_in,
                              existingCheckOut: r.check_out,
                            })}
                            className="inline-flex items-center gap-1 px-2 h-6 text-[11px] font-medium rounded border transition-colors hover:bg-muted"
                            style={{ borderColor: 'rgba(91,63,248,0.3)', color: '#5B3FF8' }}
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <MissingEntryModal
        open={!!editTarget}
        target={editTarget}
        shiftStart={shiftStart}
        shiftEnd={shiftEnd}
        shiftDuration={shiftDuration}
        lateThresholdMin={0}
        lunchBreakHours={lunchBreakHours}
        onClose={() => setEditTarget(null)}
        onSaved={() => {
          setEditTarget(null);
          qc.invalidateQueries({ queryKey: ['employee-attendance', employeeId, year, month] });
        }}
      />
    </div>
  );
};

export default AttendanceTab;
