import { Fragment, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { CalendarCheck, Plus, Loader2, Trash2, Pencil, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';
import AttendanceUploadFlow from '@/components/attendance/AttendanceUploadFlow';
import MissingEntryModal, { MissingEntryTarget } from '@/components/attendance/MissingEntryModal';
import AttendanceSummary from '@/components/attendance/AttendanceSummary';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const KARACHI_OFFSET = '+05:00';

interface AttendanceRow {
  id: string;
  employee_code: string | null;
  employee_id: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  notes: string | null;
  is_late: boolean | null;
  regular_ot_hours: number | null;
  holiday_ot_hours: number | null;
  status: string | null;
  employee_name?: string | null;
}

interface CompanySettings {
  shift_start_time: string;
  shift_end_time: string;
  late_threshold: number;
  lunch_break_hours: number;
  working_days: number[];
}

function parseHHmm(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60;
}

function formatDeviation(deviation: number): string {
  const abs = Math.abs(deviation);
  const h = Math.floor(abs);
  const mins = Math.round((abs - h) * 60);
  return `${h}h ${mins}m`;
}

function formatGroupDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00${KARACHI_OFFSET}`);
  return format(d, 'EEEE, dd MMM yyyy');
}

interface RecordsTableProps {
  records: AttendanceRow[];
  loading: boolean;
  shiftDuration: number;
  monthYearLabel: string;
  emptyHint?: string;
  showCodeAndName?: boolean;
  canEdit: (row: AttendanceRow) => boolean;
  onRequestEdit: (row: AttendanceRow, field: 'check_in' | 'check_out') => void;
}

function RecordsTable({
  records, loading, shiftDuration, monthYearLabel, emptyHint,
  showCodeAndName = true, canEdit, onRequestEdit,
}: RecordsTableProps) {
  const groupedRecords = useMemo(() => {
    const map = new Map<string, AttendanceRow[]>();
    for (const r of records) {
      if (!map.has(r.date)) map.set(r.date, []);
      map.get(r.date)!.push(r);
    }
    const dates = Array.from(map.keys()).sort();
    return dates.map(date => {
      const rows = map.get(date)!.slice().sort((a, b) => {
        const at = a.check_in ? new Date(a.check_in).getTime() : Number.POSITIVE_INFINITY;
        const bt = b.check_in ? new Date(b.check_in).getTime() : Number.POSITIVE_INFINITY;
        return at - bt;
      });
      return { date, rows };
    });
  }, [records]);

  const colSpan = showCodeAndName ? 7 : 5;

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading attendance records…</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <CalendarCheck className="mb-3" style={{ width: 48, height: 48, color: '#9490B4' }} />
        <p className="text-sm font-medium text-foreground">
          No attendance records for {monthYearLabel}
        </p>
        {emptyHint && <p className="text-xs text-muted-foreground mt-1">{emptyHint}</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            {showCodeAndName && <TableHead className="hidden md:table-cell">Code</TableHead>}
            {showCodeAndName && <TableHead>Name</TableHead>}
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead className="text-right">Working Hrs</TableHead>
            <TableHead className="hidden lg:table-cell">Notes</TableHead>
            <TableHead className="text-right hidden md:table-cell">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedRecords.map(group => (
            <Fragment key={group.date}>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell colSpan={colSpan} className="p-0 border-b-0">
                  <div className="flex items-center gap-2 h-9 pl-4 pr-4"
                    style={{ backgroundColor: 'rgba(91, 63, 248, 0.08)', borderLeft: '3px solid #5B3FF8' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 600, color: '#5B3FF8' }}>
                      {formatGroupDate(group.date)}
                    </span>
                    <span style={{
                      backgroundColor: 'rgba(91, 63, 248, 0.12)', color: '#5B3FF8',
                      fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                    }}>
                      {group.rows.length} record{group.rows.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              {group.rows.map(r => {
                const isUnmatched = !r.employee_id;
                const isOnLeave = r.status === 'on_leave';
                const isAbsent = r.status === 'absent';
                const missingField: 'check_in' | 'check_out' | null =
                  !r.check_in ? 'check_in' : !r.check_out ? 'check_out' : null;
                const editable = !isOnLeave && !isAbsent && missingField && canEdit(r);
                return (
                  <TableRow key={r.id}>
                    {showCodeAndName && (
                      <TableCell className="font-mono text-xs hidden md:table-cell">{r.employee_code ?? '—'}</TableCell>
                    )}
                    {showCodeAndName && (
                      <TableCell className="text-sm">
                        {r.employee_name ?? (isUnmatched ? <span className="text-muted-foreground italic">unmatched</span> : '—')}
                      </TableCell>
                    )}
                    <TableCell>
                      {isOnLeave || isAbsent ? (
                        <span className="text-muted-foreground">—</span>
                      ) : r.check_in ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-mono">
                          {formatTime12h(r.check_in)}
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isOnLeave || isAbsent ? (
                        <span className="text-muted-foreground">—</span>
                      ) : r.check_out ? (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-mono">
                          {formatTime12h(r.check_out)}
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                      {isOnLeave ? (
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#60A5FA' }}>On Leave</span>
                      ) : isAbsent ? (
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#E84545' }}>Absent</span>
                      ) : (
                        <div className="flex flex-col items-end leading-tight">
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#120E36' }}>
                            {formatWorkingHours(r.working_hours)}
                          </span>
                          {r.working_hours != null && (() => {
                            const dev = r.working_hours - shiftDuration;
                            if (Math.abs(dev) < 1 / 120) return null;
                            if (dev > 0) {
                              return (
                                <span style={{ fontSize: '11px', color: '#1DC97A' }}>
                                  +{formatDeviation(dev)} OT
                                </span>
                              );
                            }
                            return (
                              <span style={{ fontSize: '11px', color: '#E84545' }}>
                                -{formatDeviation(dev)} Short
                              </span>
                            );
                          })()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isOnLeave ? (
                          <span style={{
                            backgroundColor: '#DBEAFE', color: '#1E40AF',
                            fontSize: '11px', fontWeight: 500,
                            padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                          }}>
                            {r.notes || 'On Leave'}
                          </span>
                        ) : isAbsent ? (
                          <span style={{
                            backgroundColor: '#FEE2E2', color: '#991B1B',
                            fontSize: '11px', fontWeight: 600,
                            padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                          }}>
                            Absent
                          </span>
                        ) : (
                          <>
                            {r.is_late && (
                              <span style={{
                                backgroundColor: '#FEF3C7', color: '#92400E',
                                fontSize: '11px', fontWeight: 500,
                                padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                              }}>
                                Late
                              </span>
                            )}
                            {(r.regular_ot_hours ?? 0) > 0 && (
                              <span style={{
                                backgroundColor: 'rgba(29, 201, 122, 0.12)', color: '#0F8C52',
                                fontSize: '11px', fontWeight: 500,
                                padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                              }}>
                                OT +{formatDeviation(r.regular_ot_hours!)}
                              </span>
                            )}
                            {(r.holiday_ot_hours ?? 0) > 0 && (
                              <span style={{
                                backgroundColor: 'rgba(91, 63, 248, 0.12)', color: '#5B3FF8',
                                fontSize: '11px', fontWeight: 500,
                                padding: '2px 8px', borderRadius: '9999px', lineHeight: 1.4,
                              }}>
                                Holiday OT +{formatDeviation(r.holiday_ot_hours!)}
                              </span>
                            )}
                            {r.notes && <span>{r.notes}</span>}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {editable && missingField && (
                        <button
                          type="button"
                          onClick={() => onRequestEdit(r, missingField)}
                          className="inline-flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium rounded-md border transition-colors hover:bg-muted"
                          style={{ borderColor: 'rgba(91, 63, 248, 0.3)', color: '#5B3FF8' }}
                        >
                          <Pencil className="h-3 w-3" />
                          {showCodeAndName ? 'Edit' : 'Add Missing Entry'}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const Attendance = () => {
  const { employee } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState<string>(MONTHS[now.getMonth()]);
  const [year, setYear] = useState<string>(String(now.getFullYear()));

  const [myRecords, setMyRecords] = useState<AttendanceRow[]>([]);
  const [companyRecords, setCompanyRecords] = useState<AttendanceRow[]>([]);
  const [loadingMy, setLoadingMy] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  // TODO: Remove before production
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [settings, setSettings] = useState<CompanySettings | null>(null);

  const [missingTarget, setMissingTarget] = useState<MissingEntryTarget | null>(null);
  const [companySearch, setCompanySearch] = useState('');

  const roles = employee?.roles ?? [];
  const isCeo = roles.includes('ceo');
  const isHr = roles.includes('hr_manager');
  const isFinance = roles.includes('finance_manager');
  const isTeamLead = roles.includes('team_lead');
  const isManager = isCeo || isHr;
  const canSeeCompanyTab = isCeo || isHr || isFinance || isTeamLead;

  const tabs = useMemo(() => {
    const list: Array<{ value: string; label: string }> = [];
    if (isManager) list.push({ value: 'summary', label: 'Summary' });
    list.push({ value: 'my', label: 'My Attendance' });
    if (canSeeCompanyTab) list.push({ value: 'company', label: 'Company Attendance' });
    return list;
  }, [isManager, canSeeCompanyTab]);

  const [activeTab, setActiveTab] = useState<string>(isManager ? 'summary' : 'my');
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some(t => t.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [tabs, activeTab]);

  const yearOptions = useMemo(() => {
    const y = now.getFullYear();
    return [String(y), String(y - 1), String(y - 2)];
  }, [now]);

  const monthYearLabel = `${month} ${year}`;

  const shiftDuration = useMemo(() => {
    const start = parseHHmm(settings?.shift_start_time);
    const end = parseHHmm(settings?.shift_end_time);
    if (start != null && end != null && end > start) return end - start;
    return 9.0;
  }, [settings]);

  // Load company settings once per company
  useEffect(() => {
    if (!employee?.company_id) return;
    (async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time, late_threshold, lunch_break_hours, working_days')
        .eq('company_id', employee.company_id)
        .maybeSingle();
      if (data) {
        setSettings({
          shift_start_time: data.shift_start_time,
          shift_end_time: data.shift_end_time,
          late_threshold: data.late_threshold ?? 0,
          lunch_break_hours: Number(data.lunch_break_hours ?? 1),
          working_days: (data as any).working_days ?? [1, 2, 3, 4, 5],
        });
      }
    })();
  }, [employee?.company_id]);

  const dateRange = useMemo(() => {
    const monthIndex = MONTHS.indexOf(month);
    const mm = String(monthIndex + 1).padStart(2, '0');
    const startDate = `${year}-${mm}-01`;
    const endDateObj = new Date(parseInt(year, 10), monthIndex + 1, 0);
    const endDate = `${year}-${mm}-${String(endDateObj.getDate()).padStart(2, '0')}`;
    return { startDate, endDate, monthYear: `${year}-${mm}` };
  }, [month, year]);

  // Fetch approved leaves overlapping the visible month and company holidays/working_days.
  // Returns a map: employeeId -> { dateStr -> leaveTypeName } for working days only.
  const fetchLeaveDayMap = async (employeeIds: string[] | null) => {
    const emptyResult = { leaveMap: new Map<string, Map<string, string>>(), holidaySet: new Set<string>(), workingDays: [1, 2, 3, 4, 5] as number[] };
    if (!employee?.company_id) return emptyResult;
    const { startDate, endDate } = dateRange;

    // Working days config
    const workingDays: number[] = (settings as any) && Array.isArray((settings as any).working_days)
      ? (settings as any).working_days
      : [1, 2, 3, 4, 5];

    // Public holidays overlapping window
    const { data: holidays } = await supabase
      .from('public_holidays' as any)
      .select('date, end_date')
      .eq('company_id', employee.company_id)
      .lte('date', endDate);
    // Local YYYY-MM-DD formatter to avoid UTC drift from toISOString().
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const holidaySet = new Set<string>();
    (holidays || []).forEach((h: any) => {
      const hStart = h.date as string;
      const hEnd = (h.end_date as string | null) ?? hStart;
      if (hEnd < startDate) return;
      const cur = new Date(hStart + 'T00:00:00');
      const end = new Date(hEnd + 'T00:00:00');
      while (cur <= end) {
        const ds = fmt(cur);
        if (ds >= startDate && ds <= endDate) holidaySet.add(ds);
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Approved leave requests overlapping window
    let q = supabase
      .from('leave_requests')
      .select('employee_id, start_date, end_date, leave_types!leave_requests_leave_type_id_fkey(name)')
      .eq('company_id', employee.company_id)
      .eq('status', 'approved')
      .lte('start_date', endDate)
      .gte('end_date', startDate);
    if (employeeIds && employeeIds.length > 0) q = q.in('employee_id', employeeIds);
    const { data: leaves } = await q;

    const map = new Map<string, Map<string, string>>();
    (leaves || []).forEach((lr: any) => {
      const empId = lr.employee_id as string;
      const ltName = lr.leave_types?.name || 'Leave';
      // Iterate every day from start_date to end_date inclusive (local time).
      const cur = new Date((lr.start_date as string) + 'T00:00:00');
      const stop = new Date((lr.end_date as string) + 'T00:00:00');
      let inner = map.get(empId);
      if (!inner) { inner = new Map(); map.set(empId, inner); }
      while (cur <= stop) {
        const ds = fmt(cur);
        // Only include working days within the visible month window.
        if (ds >= startDate && ds <= endDate) {
          const dow = cur.getDay(); // 0 = Sun, 6 = Sat
          const isWeekend = !workingDays.includes(dow);
          if (!isWeekend && !holidaySet.has(ds)) {
            if (!inner.has(ds)) inner.set(ds, ltName);
          }
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return { leaveMap: map, holidaySet, workingDays };
  };

  // Build synthetic on_leave rows for an employee where no attendance record
  // already exists for that date.
  const buildLeaveRows = (
    employeeId: string,
    employeeCode: string | null,
    employeeName: string | null,
    leaveDates: Map<string, string> | undefined,
    existingDates: Set<string>,
  ): AttendanceRow[] => {
    if (!leaveDates) return [];
    const rows: AttendanceRow[] = [];
    leaveDates.forEach((leaveTypeName, ds) => {
      if (existingDates.has(ds)) return;
      rows.push({
        id: `leave-${employeeId}-${ds}`,
        employee_code: employeeCode,
        employee_id: employeeId,
        date: ds,
        check_in: null,
        check_out: null,
        working_hours: null,
        notes: leaveTypeName,
        is_late: false,
        regular_ot_hours: 0,
        holiday_ot_hours: 0,
        status: 'on_leave',
        employee_name: employeeName,
      });
    });
    return rows;
  };

  // Build synthetic absent rows for working days with no attendance record AND no leave.
  const buildAbsentRows = (
    employeeId: string,
    employeeCode: string | null,
    employeeName: string | null,
    holidaySet: Set<string>,
    workingDays: number[],
    attendedDates: Set<string>,
    leaveDates: Set<string>,
  ): AttendanceRow[] => {
    const { startDate, endDate } = dateRange;
    const rows: AttendanceRow[] = [];
    const cur = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    while (cur <= end) {
      const ds = fmt(cur);
      const dow = cur.getDay();
      if (
        workingDays.includes(dow)
        && !holidaySet.has(ds)
        && !attendedDates.has(ds)
        && !leaveDates.has(ds)
      ) {
        rows.push({
          id: `absent-${employeeId}-${ds}`,
          employee_code: employeeCode,
          employee_id: employeeId,
          date: ds,
          check_in: null,
          check_out: null,
          working_hours: null,
          notes: 'Absent',
          is_late: false,
          regular_ot_hours: 0,
          holiday_ot_hours: 0,
          status: 'absent',
          employee_name: employeeName,
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
    return rows;
  };

  const fetchMy = async () => {
    if (!employee?.company_id || !employee?.employee_id) return;
    setLoadingMy(true);
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('id, employee_code, employee_id, date, check_in, check_out, working_hours, notes, is_late, regular_ot_hours, holiday_ot_hours, status')
        .eq('company_id', employee.company_id)
        .eq('employee_id', employee.employee_id)
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate)
        .order('date', { ascending: true })
        .limit(2000);
      if (error) throw error;
      const baseRows = ((data ?? []) as AttendanceRow[]).map(r => ({
        ...r,
        employee_name: employee.full_name,
      }));

      const { leaveMap, holidaySet, workingDays } = await fetchLeaveDayMap([employee.employee_id]);
      const existingDates = new Set(baseRows.map(r => r.date));
      const leaveDateMap = leaveMap.get(employee.employee_id);
      const leaveRows = buildLeaveRows(
        employee.employee_id,
        null,
        employee.full_name ?? null,
        leaveDateMap,
        existingDates,
      );
      const leaveDateSet = new Set<string>(leaveDateMap ? Array.from(leaveDateMap.keys()) : []);
      const absentRows = buildAbsentRows(
        employee.employee_id,
        null,
        employee.full_name ?? null,
        holidaySet,
        workingDays,
        existingDates,
        leaveDateSet,
      );
      setMyRecords([...baseRows, ...leaveRows, ...absentRows]);
    } catch (err) {
      console.error(err);
      setMyRecords([]);
    } finally {
      setLoadingMy(false);
    }
  };

  const fetchCompany = async () => {
    if (!employee?.company_id) return;
    setLoadingCompany(true);
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('id, employee_code, employee_id, date, check_in, check_out, working_hours, notes, is_late, regular_ot_hours, holiday_ot_hours, status')
        .eq('company_id', employee.company_id)
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate)
        .order('date', { ascending: true })
        .limit(5000);
      if (error) throw error;

      const rows = (data ?? []) as AttendanceRow[];

      // Fetch all active employees so we can include leave-only rows for people
      // who have no attendance records yet this month.
      const { data: allEmps } = await supabase
        .from('employees')
        .select('id, full_name, employee_code')
        .eq('company_id', employee.company_id)
        .eq('status', 'active');
      const idToName = new Map<string, string>();
      const idToCode = new Map<string, string | null>();
      (allEmps ?? []).forEach(e => {
        idToName.set(e.id, e.full_name);
        idToCode.set(e.id, (e as any).employee_code ?? null);
      });

      const baseRows: AttendanceRow[] = rows.map(r => ({
        ...r,
        employee_name: r.employee_id ? idToName.get(r.employee_id) ?? null : null,
      }));

      const { leaveMap, holidaySet, workingDays } = await fetchLeaveDayMap(Array.from(idToName.keys()));

      // existing (employee_id, date) pairs
      const existingPairs = new Set<string>();
      const attendedByEmp = new Map<string, Set<string>>();
      baseRows.forEach(r => {
        if (!r.employee_id) return;
        existingPairs.add(`${r.employee_id}|${r.date}`);
        if (!attendedByEmp.has(r.employee_id)) attendedByEmp.set(r.employee_id, new Set());
        attendedByEmp.get(r.employee_id)!.add(r.date);
      });

      const extraLeaveRows: AttendanceRow[] = [];
      leaveMap.forEach((dates, empId) => {
        const empExisting = new Set<string>();
        dates.forEach((_, ds) => {
          if (existingPairs.has(`${empId}|${ds}`)) empExisting.add(ds);
        });
        extraLeaveRows.push(
          ...buildLeaveRows(
            empId,
            idToCode.get(empId) ?? null,
            idToName.get(empId) ?? null,
            dates,
            empExisting,
          ),
        );
      });

      // Synthetic absent rows for every active employee
      const absentRows: AttendanceRow[] = [];
      idToName.forEach((name, empId) => {
        const attended = attendedByEmp.get(empId) ?? new Set<string>();
        const leaveDates = leaveMap.get(empId);
        const leaveSet = new Set<string>(leaveDates ? Array.from(leaveDates.keys()) : []);
        absentRows.push(
          ...buildAbsentRows(
            empId,
            idToCode.get(empId) ?? null,
            name,
            holidaySet,
            workingDays,
            attended,
            leaveSet,
          ),
        );
      });

      setCompanyRecords([...baseRows, ...extraLeaveRows, ...absentRows]);
    } catch (err) {
      console.error(err);
      setCompanyRecords([]);
    } finally {
      setLoadingCompany(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my') fetchMy();
    if (activeTab === 'company') fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, month, year, employee?.company_id, employee?.employee_id, settings, refreshKey]);

  const filteredCompanyRecords = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return companyRecords;
    return companyRecords.filter(r =>
      (r.employee_name ?? '').toLowerCase().includes(q)
      || (r.employee_code ?? '').toLowerCase().includes(q)
    );
  }, [companyRecords, companySearch]);

  // TODO: Remove before production
  const handleClearMonth = async () => {
    if (!employee?.company_id) return;
    setClearing(true);
    try {
      const { error: recErr } = await supabase
        .from('attendance_records')
        .delete()
        .eq('company_id', employee.company_id)
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate);
      if (recErr) throw recErr;

      const { error: manErr } = await supabase
        .from('attendance_manual_logs')
        .delete()
        .eq('company_id', employee.company_id)
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate);
      if (manErr) throw manErr;

      const { error: impErr } = await supabase
        .from('attendance_imports')
        .delete()
        .eq('company_id', employee.company_id)
        .eq('month_year', dateRange.monthYear);
      if (impErr) throw impErr;

      toast.success(`Attendance data cleared for ${month} ${year}`);
      setClearOpen(false);
      setRefreshKey(k => k + 1);
      await Promise.all([fetchMy(), fetchCompany()]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Failed to clear attendance data');
    } finally {
      setClearing(false);
    }
  };

  const handleRequestEdit = (row: AttendanceRow, field: 'check_in' | 'check_out') => {
    setMissingTarget({
      recordId: row.id,
      employeeId: row.employee_id,
      employeeName: row.employee_name ?? null,
      date: row.date,
      field,
      existingCheckIn: row.check_in,
      existingCheckOut: row.check_out,
    });
  };

  const canEditMy = (row: AttendanceRow) => row.employee_id === employee?.employee_id;
  const canEditCompany = () => isManager;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:flex-wrap">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5 flex-1 sm:flex-initial">
            <Label className="text-xs">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1 sm:flex-initial">
            <Label className="text-xs">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full sm:w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* TODO: Remove before production */}
          {isCeo && (
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3 h-10 sm:h-9 text-sm font-medium bg-white hover:bg-red-50 transition-colors w-full sm:w-auto"
              style={{
                color: '#991B1B',
                border: '1px solid rgba(232, 69, 69, 0.3)',
                borderRadius: '10px',
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear Month Data
            </button>
          )}
          {isManager && (
            <Button onClick={() => setUploadOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Attendance
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start overflow-x-auto flex-nowrap" style={{ borderColor: 'hsl(var(--border))' }}>
          {tabs.map(t => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {isManager && (
          <TabsContent value="summary" className="mt-4">
            {employee?.company_id ? (
              <AttendanceSummary
                key={refreshKey}
                companyId={employee.company_id}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                monthYearLabel={monthYearLabel}
                year={parseInt(year, 10)}
                monthIndex={MONTHS.indexOf(month)}
              />
            ) : null}
          </TabsContent>
        )}

        <TabsContent value="my" className="mt-4">
          <Card className="overflow-hidden">
            <RecordsTable
              records={myRecords}
              loading={loadingMy}
              shiftDuration={shiftDuration}
              monthYearLabel={monthYearLabel}
              showCodeAndName={false}
              canEdit={canEditMy}
              onRequestEdit={handleRequestEdit}
            />
          </Card>
        </TabsContent>

        {canSeeCompanyTab && (
          <TabsContent value="company" className="mt-4 space-y-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or employee code..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Card className="overflow-hidden">
              <RecordsTable
                records={filteredCompanyRecords}
                loading={loadingCompany}
                shiftDuration={shiftDuration}
                monthYearLabel={monthYearLabel}
                emptyHint={isManager ? "Click 'Add Attendance' to import an attendance file" : undefined}
                showCodeAndName
                canEdit={canEditCompany}
                onRequestEdit={handleRequestEdit}
              />
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-[1100px] w-[95vw] max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-display)' }}>Import attendance</DialogTitle>
          </DialogHeader>
          <AttendanceUploadFlow
            defaultMonth={month}
            defaultYear={year}
            onCancel={() => setUploadOpen(false)}
            onSuccess={() => {
              setUploadOpen(false);
              setRefreshKey(k => k + 1);
              fetchMy();
              fetchCompany();
            }}
          />
        </DialogContent>
      </Dialog>

      <MissingEntryModal
        open={!!missingTarget}
        target={missingTarget}
        shiftStart={settings?.shift_start_time ?? '09:00:00'}
        shiftEnd={settings?.shift_end_time ?? '18:00:00'}
        shiftDuration={shiftDuration}
        lateThresholdMin={settings?.late_threshold ?? 0}
        lunchBreakHours={settings?.lunch_break_hours ?? 1}
        onClose={() => setMissingTarget(null)}
        onSaved={() => {
          setRefreshKey(k => k + 1);
          if (activeTab === 'my') fetchMy();
          if (activeTab === 'company') fetchCompany();
        }}
      />

      {/* TODO: Remove before production */}
      <Dialog open={clearOpen} onOpenChange={(v) => !clearing && setClearOpen(v)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--ff-display)' }}>Clear Attendance Data?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all attendance records for {month} {year}. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setClearOpen(false)} disabled={clearing}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleClearMonth}
              disabled={clearing}
              className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-md disabled:opacity-60"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            >
              {clearing && <Loader2 className="h-4 w-4 animate-spin" />}
              Clear Data
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
