import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ClipboardCheck } from 'lucide-react';
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
import { formatTime12h } from '@/lib/attendance-format';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface LogRow {
  id: string;
  date: string;
  field_updated: string;
  old_value: string | null;
  new_value: string | null;
  reason: string | null;
  created_at: string;
  employee: { full_name: string } | null;
  updatedBy: { full_name: string } | null;
}

const FIELD_LABELS: Record<string, string> = {
  check_in: 'Check-in',
  check_out: 'Check-out',
};

const formatField = (field: string): string =>
  FIELD_LABELS[field] ?? field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const ManualAttendanceLogTab = () => {
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
        .from('attendance_manual_logs')
        .select(`
          id, date, field_updated, old_value, new_value, reason, created_at,
          employee:employees!attendance_manual_logs_employee_id_fkey(full_name),
          updatedBy:employees!attendance_manual_logs_updated_by_fkey(full_name)
        `)
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
          Manual Attendance Log
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          History of all manual check-in and check-out changes made to attendance records.
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
              <TableHead>Field Updated</TableHead>
              <TableHead>Old Value</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Changed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No manual attendance entries for {month} {year}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employee?.full_name ?? '—'}</TableCell>
                  <TableCell>{format(new Date(r.date + 'T00:00:00'), 'EEE, dd MMM yyyy')}</TableCell>
                  <TableCell>{formatField(r.field_updated)}</TableCell>
                  <TableCell>
                    {r.old_value == null ? (
                      <span className="text-muted-foreground">None</span>
                    ) : (
                      <span className="font-mono text-xs">{formatTime12h(r.old_value)}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatTime12h(r.new_value)}</TableCell>
                  <TableCell>
                    {r.reason ? (
                      <span
                        className="block max-w-[200px] truncate text-sm"
                        title={r.reason}
                      >
                        {r.reason}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{r.updatedBy?.full_name ?? '—'}</TableCell>
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

export default ManualAttendanceLogTab;
