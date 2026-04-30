import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface LogRow {
  id: string;
  employee_id: string | null;
  leave_type_name: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  working_hours: number | null;
  created_at: string;
  employees: { full_name: string } | null;
}

const LeaveOverwriteLogTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const now = new Date();
  const [month, setMonth] = useState<string>(MONTHS[now.getMonth()]);
  const [year, setYear] = useState<string>(String(now.getFullYear()));
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const yearOptions = useMemo(() => {
    const y = now.getFullYear();
    return [String(y), String(y - 1), String(y - 2)];
  }, []);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const monthIdx = MONTHS.indexOf(month);
      const start = `${year}-${String(monthIdx + 1).padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year, 10), monthIdx + 1, 0);
      const end = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

      const { data, error } = await (supabase as any)
        .from('leave_overwrite_logs')
        .select('id, employee_id, leave_type_name, date, check_in, check_out, working_hours, created_at, employees:employees!leave_overwrite_logs_employee_id_fkey(full_name)')
        .eq('company_id', companyId)
        .gte('date', start)
        .lte('date', end)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data ?? []) as LogRow[]);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [companyId, month, year]);

  return (
    <div className="space-y-4" style={{ fontFamily: 'var(--ff-body)' }}>
      <div>
        <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
          Leave Overwrite Log
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Days where an attendance machine record overrode an approved leave. The leave quota was restored for each entry below.
        </p>
      </div>

      <div className="flex gap-3 items-end max-w-md">
        <div className="space-y-1.5 flex-1">
          <Label className="text-xs">Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex-1">
          <Label className="text-xs">Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Working Hrs</TableHead>
              <TableHead>Overwritten At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                  No leave overwrites for {month} {year}.
                </TableCell>
              </TableRow>
            ) : (
              rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employees?.full_name ?? '—'}</TableCell>
                  <TableCell>{format(new Date(r.date + 'T00:00:00'), 'EEE, dd MMM yyyy')}</TableCell>
                  <TableCell>{r.leave_type_name ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{formatTime12h(r.check_in)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatTime12h(r.check_out)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatWorkingHours(r.working_hours)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(r.created_at), 'dd MMM yyyy, h:mm a')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaveOverwriteLogTab;
