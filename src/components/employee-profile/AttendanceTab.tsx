import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CalendarX2 } from 'lucide-react';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';

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

  const startDate = `${year}-${month}-01`;
  const endDate = (() => {
    const d = new Date(Number(year), Number(month), 0);
    return `${year}-${month}-${String(d.getDate()).padStart(2, '0')}`;
  })();

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Present Days" value={summary.present} accent="text-[hsl(var(--bx-success-text))]" />
        <SummaryCard label="Absent Days" value={summary.absent} accent="text-[hsl(var(--bx-danger-text))]" />
        <SummaryCard label="Late Arrivals" value={summary.late} accent="text-[hsl(var(--bx-warning-text))]" />
        <SummaryCard label="Total OT Hours" value={summary.ot.toFixed(1)} />
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
                {/* header already says Working Hrs */}
                <TableHead>Status</TableHead>
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
                    <TableCell className="text-[13px] font-mono">{Number(r.working_hours || 0).toFixed(1)}</TableCell>
                    <TableCell className="text-[13px] font-mono">{ot.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] border-0 ${cls}`}>{status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AttendanceTab;
