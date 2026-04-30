import { Fragment, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { CalendarCheck, Plus, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';
import AttendanceUploadFlow from '@/components/attendance/AttendanceUploadFlow';

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
  employee_name?: string | null;
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

const Attendance = () => {
  const { employee } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState<string>(MONTHS[now.getMonth()]);
  const [year, setYear] = useState<string>(String(now.getFullYear()));
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  // TODO: Remove before production
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [shiftDuration, setShiftDuration] = useState<number>(9.0);

  useEffect(() => {
    if (!employee?.company_id) return;
    (async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time')
        .eq('company_id', employee.company_id)
        .maybeSingle();
      const start = parseHHmm(data?.shift_start_time);
      const end = parseHHmm(data?.shift_end_time);
      if (start != null && end != null && end > start) {
        setShiftDuration(end - start);
      }
    })();
  }, [employee?.company_id]);

  const isAuthorised = useMemo(() => {
    const roles = employee?.roles ?? [];
    return roles.includes('hr_manager') || roles.includes('ceo');
  }, [employee]);

  // TODO: Remove before production
  const isCeo = useMemo(() => (employee?.roles ?? []).includes('ceo'), [employee]);

  const yearOptions = useMemo(() => {
    const y = now.getFullYear();
    return [String(y), String(y - 1), String(y - 2)];
  }, [now]);

  const monthYearLabel = `${month} ${year}`;

  const fetchRecords = async () => {
    if (!employee?.company_id) return;
    setLoading(true);
    try {
      const monthIndex = MONTHS.indexOf(month);
      const startDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      const endDateObj = new Date(parseInt(year, 10), monthIndex + 1, 0);
      const endDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('attendance_records')
        .select('id, employee_code, employee_id, date, check_in, check_out, working_hours, notes')
        .eq('company_id', employee.company_id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .limit(5000);
      if (error) throw error;

      const rows = (data ?? []) as AttendanceRow[];

      // Resolve employee names for matched rows
      const empIds = Array.from(new Set(rows.map(r => r.employee_id).filter(Boolean))) as string[];
      const idToName = new Map<string, string>();
      if (empIds.length > 0) {
        const { data: emps } = await supabase
          .from('employees')
          .select('id, full_name')
          .in('id', empIds);
        (emps ?? []).forEach(e => idToName.set(e.id, e.full_name));
      }

      setRecords(rows.map(r => ({
        ...r,
        employee_name: r.employee_id ? idToName.get(r.employee_id) ?? null : null,
      })));
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, employee?.company_id]);

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

  const formatGroupDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00${KARACHI_OFFSET}`);
    return format(d, 'EEEE, dd MMM yyyy');
  };

  // TODO: Remove before production
  const handleClearMonth = async () => {
    if (!employee?.company_id) return;
    setClearing(true);
    try {
      const monthIndex = MONTHS.indexOf(month);
      const mm = String(monthIndex + 1).padStart(2, '0');
      const startDate = `${year}-${mm}-01`;
      const endDateObj = new Date(parseInt(year, 10), monthIndex + 1, 0);
      const endDate = `${year}-${mm}-${String(endDateObj.getDate()).padStart(2, '0')}`;
      const monthYear = `${year}-${mm}`;

      const { error: recErr } = await supabase
        .from('attendance_records')
        .delete()
        .eq('company_id', employee.company_id)
        .gte('date', startDate)
        .lte('date', endDate);
      if (recErr) throw recErr;

      const { error: impErr } = await supabase
        .from('attendance_imports')
        .delete()
        .eq('company_id', employee.company_id)
        .eq('month_year', monthYear);
      if (impErr) throw impErr;

      toast.success(`Attendance data cleared for ${month} ${year}`);
      setClearOpen(false);
      await fetchRecords();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Failed to clear attendance data');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TODO: Remove before production */}
          {isCeo && (
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="inline-flex items-center gap-2 px-3 h-9 text-sm font-medium bg-white hover:bg-red-50 transition-colors"
              style={{
                color: '#991B1B',
                border: '1px solid rgba(232, 69, 69, 0.3)',
                borderRadius: '10px',
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear Month Data
            </button>
          )}
          {isAuthorised && (
            <Button onClick={() => setUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Attendance
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading attendance records…</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <CalendarCheck className="mb-3" style={{ width: 48, height: 48, color: '#9490B4' }} />
            <p className="text-sm font-medium text-foreground">
              No attendance records for {monthYearLabel}
            </p>
            {isAuthorised && (
              <p className="text-xs text-muted-foreground mt-1">
                Click 'Add Attendance' to import an attendance file
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-right">Working Hrs</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedRecords.map(group => (
                  <Fragment key={group.date}>
                    <TableRow className="border-b-0 hover:bg-transparent">
                      <TableCell colSpan={6} className="p-0 border-b-0">
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
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{r.employee_code ?? '—'}</TableCell>
                          <TableCell className="text-sm">
                            {r.employee_name ?? (isUnmatched ? <span className="text-muted-foreground italic">unmatched</span> : '—')}
                          </TableCell>
                          <TableCell>
                            {r.check_in ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-mono">
                                {formatTime12h(r.check_in)}
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {r.check_out ? (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-mono">
                                {formatTime12h(r.check_out)}
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#120E36' }}>
                              {formatWorkingHours(r.working_hours)}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.notes ?? ''}</TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

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
              fetchRecords();
            }}
          />
        </DialogContent>
      </Dialog>

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
