import { Fragment, useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  Loader2, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, X, RotateCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { formatTime12h, formatWorkingHours } from '@/lib/attendance-format';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHEETJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

// Asia/Karachi is UTC+05:00 year-round (no DST)
const KARACHI_OFFSET = '+05:00';

// ---------------- Types ----------------

interface ParsedRecord {
  employee_code: string;
  name: string | null;
  date: string;
  check_in: string | null;   // HH:mm:ss
  check_out: string | null;  // HH:mm:ss
  notes?: string | null;
}

interface ParseResponse {
  records: ParsedRecord[];
  warnings: string[];
}

interface CompanySettings {
  shift_start_time: string; // HH:mm:ss
  shift_end_time: string;   // HH:mm:ss
  late_threshold: number;   // minutes
}

interface ImportSummary {
  imported: number;
  updated: number;
  skipped: number;
  unmatched: string[];
}

// Decision per unmatched code: import the rows anyway (with employee_id = null)
// or skip them entirely.
type UnmatchedDecision = 'import' | 'skip';

interface UnmatchedEntry {
  employee_code: string;
  name: string | null;
  count: number;
  decision: UnmatchedDecision;
}

// ---------------- Helpers ----------------

declare global {
  interface Window {
    XLSX?: any;
  }
}

function loadSheetJs(): Promise<any> {
  if (typeof window !== 'undefined' && window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SHEETJS_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.XLSX));
      existing.addEventListener('error', () => reject(new Error('Failed to load SheetJS')));
      return;
    }
    const s = document.createElement('script');
    s.src = SHEETJS_CDN;
    s.async = true;
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('Failed to load SheetJS'));
    document.head.appendChild(s);
  });
}

async function fileToCsv(file: File): Promise<string> {
  const XLSX = await loadSheetJs();
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true, cellText: false });
  // Concatenate all sheets so we don't lose data spread across tabs.
  const parts: string[] = [];
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    if (csv && csv.trim()) {
      parts.push(`# Sheet: ${name}\n${csv}`);
    }
  }
  return parts.join('\n\n');
}

function timeToMinutes(t: string | null | undefined): number | null {
  if (!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function isoTimestampKarachi(date: string, time: string | null): string | null {
  if (!time) return null;
  // Ensure HH:mm:ss
  const m = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = m[1].padStart(2, '0');
  const mm = m[2];
  const ss = (m[3] ?? '00').padStart(2, '0');
  return `${date}T${hh}:${mm}:${ss}${KARACHI_OFFSET}`;
}

function workingHours(checkIn: string | null, checkOut: string | null): number | null {
  const inM = timeToMinutes(checkIn);
  const outM = timeToMinutes(checkOut);
  if (inM == null || outM == null) return null;
  if (outM <= inM) return null;
  return Math.round(((outM - inM) / 60) * 100) / 100;
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(`${dateStr}T00:00:00${KARACHI_OFFSET}`);
  const day = d.getUTCDay(); // since we anchored to Karachi offset, getUTCDay gives the local day
  return day === 0 || day === 6;
}

// ---------------- Page ----------------

type Step = 'select' | 'parsing' | 'preview' | 'importing' | 'done';

const AttendanceUpload = () => {
  const { employee } = useAuth();
  const { toast } = useToast();

  const isAuthorised = useMemo(() => {
    const roles = employee?.roles ?? [];
    return roles.includes('hr_manager') || roles.includes('ceo');
  }, [employee]);

  const now = new Date();
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [step, setStep] = useState<Step>('select');
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParseResponse | null>(null);
  // Mirror parsed records in a ref so re-renders never lose preview data.
  // Source of truth for confirmImport reads from this ref as a fallback.
  const parsedRef = useRef<ParseResponse | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [shiftHours, setShiftHours] = useState<number>(8);
  const [unmatchedEntries, setUnmatchedEntries] = useState<UnmatchedEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper: keep state and ref in lock-step so the preview persists
  // until the user explicitly cancels or confirms.
  const setParsedBoth = (next: ParseResponse | null) => {
    parsedRef.current = next;
    setParsed(next);
  };

  // Preload SheetJS as soon as the page mounts so the first upload is instant.
  useEffect(() => { loadSheetJs().catch(() => {}); }, []);

  const yearOptions = useMemo(() => {
    const y = now.getFullYear();
    return [String(y), String(y - 1)];
  }, [now]);

  const reset = () => {
    setStep('select');
    setMonth('');
    setYear('');
    setParseError(null);
    setFileName(null);
    setParsedBoth(null);
    setSummary(null);
    setUnmatchedEntries([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelPreview = () => {
    setParsedBoth(null);
    setParseError(null);
    setFileName(null);
    setUnmatchedEntries([]);
    setStep('select');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.xls') && !lower.endsWith('.xlsx')) {
      toast({
        title: 'Unsupported file',
        description: 'Please upload an .xls or .xlsx file.',
        variant: 'destructive',
      });
      return;
    }
    setFileName(file.name);
    setParseError(null);
    setStep('parsing');
    try {
      const csv = await fileToCsv(file);
      if (!csv.trim()) throw new Error('The file appears to be empty.');
      const { data, error } = await supabase.functions.invoke('parse-attendance-ai', {
        body: { csv_content: csv },
      });
      if (error) throw new Error(error.message);
      const resp = data as ParseResponse;
      if (!resp || !Array.isArray(resp.records)) {
        throw new Error('AI returned an unexpected response.');
      }
      // The Edge Function's parsed records array is the SOLE source of truth.
      // Suppress noisy parser warnings about column shape / inconsistencies —
      // those reflect raw-CSV structure, not a data problem in the normalised
      // records we actually render.
      const filteredWarnings = (resp.warnings ?? []).filter(w => {
        const s = String(w).toLowerCase();
        return !s.includes('column') && !s.includes('inconsist');
      });
      const cleaned: ParseResponse = { records: resp.records, warnings: filteredWarnings };
      if (resp.records.length === 0) {
        setParsedBoth(cleaned);
        setParseError('AI parser found 0 records in this file. Please check the file format.');
        setStep('preview');
        return;
      }
      setParsedBoth(cleaned);
      // Fetch shift duration + employee codes for preview highlighting
      // and unmatched-code detection.
      try {
        if (employee?.company_id) {
          const [{ data: settingsRow }, { data: empRows }] = await Promise.all([
            supabase
              .from('company_settings')
              .select('shift_start_time, shift_end_time')
              .eq('company_id', employee.company_id)
              .maybeSingle(),
            supabase
              .from('employees')
              .select('employee_code')
              .eq('company_id', employee.company_id),
          ]);
          const sStart = timeToMinutes(settingsRow?.shift_start_time ?? '09:00:00') ?? 9 * 60;
          const sEnd = timeToMinutes(settingsRow?.shift_end_time ?? '18:00:00') ?? 18 * 60;
          setShiftHours(Math.max(0, (sEnd - sStart) / 60));

          const knownCodes = new Set(
            (empRows ?? [])
              .map(e => (e.employee_code ?? '').trim())
              .filter(Boolean),
          );
          // Group parsed records by employee_code; flag those whose code is
          // not present in the company's employees table.
          const grouped = new Map<string, { name: string | null; count: number }>();
          for (const r of cleaned.records) {
            const code = r.employee_code.trim();
            if (!code || knownCodes.has(code)) continue;
            const cur = grouped.get(code);
            if (cur) {
              cur.count += 1;
              if (!cur.name && r.name) cur.name = r.name;
            } else {
              grouped.set(code, { name: r.name ?? null, count: 1 });
            }
          }
          const entries: UnmatchedEntry[] = Array.from(grouped.entries())
            .map(([employee_code, v]) => ({
              employee_code,
              name: v.name,
              count: v.count,
              decision: 'skip' as UnmatchedDecision,
            }))
            .sort((a, b) => a.employee_code.localeCompare(b.employee_code));
          setUnmatchedEntries(entries);
        }
      } catch {
        setShiftHours(8);
        setUnmatchedEntries([]);
      }
      setStep('preview');
    } catch (err) {
      console.error(err);
      setParseError((err as Error).message ?? 'Failed to parse file');
      setStep('select');
      toast({
        title: 'Parsing failed',
        description: (err as Error).message ?? 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const confirmImport = async () => {
    const source = parsed ?? parsedRef.current;
    if (!source || !employee?.company_id) return;
    setStep('importing');

    try {
      const companyId = employee.company_id;

      // 1. Fetch company settings
      const { data: settingsRow } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time, late_threshold')
        .eq('company_id', companyId)
        .maybeSingle();

      const settings: CompanySettings = settingsRow ?? {
        shift_start_time: '09:00:00',
        shift_end_time: '18:00:00',
        late_threshold: 0,
      };

      const startMin = timeToMinutes(settings.shift_start_time) ?? 9 * 60;
      const endMin = timeToMinutes(settings.shift_end_time) ?? 18 * 60;
      const lateCutoff = startMin + (settings.late_threshold ?? 0);
      const shiftHours = Math.max(0, (endMin - startMin) / 60);

      // 2. Fetch all employees for this company (for code → id mapping)
      const { data: empRows, error: empErr } = await supabase
        .from('employees')
        .select('id, employee_code')
        .eq('company_id', companyId);
      if (empErr) throw empErr;
      const codeToId = new Map<string, string>();
      (empRows ?? []).forEach(e => {
        if (e.employee_code) codeToId.set(e.employee_code.trim(), e.id);
      });

      // 3. Fetch all dates already imported for this company within the parsed range
      //    (so we can early-skip duplicates without round-tripping per row)
      const dates = Array.from(new Set(source.records.map(r => r.date))).sort();
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('employee_id, date')
        .eq('company_id', companyId)
        .gte('date', minDate)
        .lte('date', maxDate);
      const existingKey = new Set(
        (existing ?? []).map(r => `${r.employee_id}|${r.date}`),
      );

      // 4. Fetch holidays for this company in the range
      const { data: holidays } = await supabase
        .from('public_holidays')
        .select('date')
        .eq('company_id', companyId)
        .gte('date', minDate)
        .lte('date', maxDate);
      const holidaySet = new Set((holidays ?? []).map(h => h.date));

      // 5. Insert the import batch row first to get its id
      const monthYearFinal = `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}`;

      // Get current user's employee id for uploaded_by
      const uploaderEmployeeId = (await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .eq('company_id', companyId)
        .maybeSingle()).data?.id;

      if (!uploaderEmployeeId) {
        throw new Error('Could not resolve current employee for uploaded_by.');
      }

      const { data: importRow, error: importErr } = await supabase
        .from('attendance_imports')
        .insert({
          company_id: companyId,
          uploaded_by: uploaderEmployeeId,
          month_year: monthYearFinal,
          file_name: fileName ?? 'attendance.xlsx',
          status: 'processing',
          records_imported: 0,
          records_skipped: 0,
        })
        .select('id')
        .single();
      if (importErr || !importRow) throw importErr ?? new Error('Failed to create import batch.');

      // 6. Build attendance rows
      const unmatched = new Set<string>();
      let skipped = 0;
      const toInsert: any[] = [];

      for (const r of source.records) {
        const empId = codeToId.get(r.employee_code.trim());
        if (!empId) {
          unmatched.add(r.employee_code.trim());
          skipped++;
          continue;
        }
        const dupKey = `${empId}|${r.date}`;
        if (existingKey.has(dupKey)) {
          skipped++;
          continue;
        }
        existingKey.add(dupKey); // protect against duplicates inside the same file

        const weekend = isWeekend(r.date);
        const holiday = holidaySet.has(r.date);
        const wh = workingHours(r.check_in, r.check_out);
        const inMin = timeToMinutes(r.check_in);
        const isLate = inMin != null && inMin > lateCutoff;

        const regularOt = !weekend && !holiday && wh != null
          ? Math.max(0, Math.round((wh - shiftHours) * 100) / 100)
          : 0;
        const holidayOt = (weekend || holiday) && wh != null ? wh : 0;

        toInsert.push({
          company_id: companyId,
          employee_id: empId,
          employee_code: r.employee_code.trim(),
          date: r.date,
          check_in: isoTimestampKarachi(r.date, r.check_in),
          check_out: isoTimestampKarachi(r.date, r.check_out),
          working_hours: wh,
          is_late: isLate,
          is_absent: false,
          is_weekend: weekend,
          is_holiday: holiday,
          regular_ot_hours: regularOt,
          holiday_ot_hours: holidayOt,
          status: isLate ? 'late' : 'present',
          source: 'machine_import',
          import_batch_id: importRow.id,
          notes: r.notes ?? null,
        });
      }

      // 7. Insert in chunks
      let imported = 0;
      const CHUNK = 500;
      for (let i = 0; i < toInsert.length; i += CHUNK) {
        const slice = toInsert.slice(i, i + CHUNK);
        const { error: insErr, count } = await supabase
          .from('attendance_records')
          .insert(slice, { count: 'exact' });
        if (insErr) {
          // If a chunk fails entirely, treat its rows as skipped and keep going
          console.error('Chunk insert failed', insErr);
          skipped += slice.length;
          continue;
        }
        imported += count ?? slice.length;
      }

      // 8. Finalise the import row
      await supabase
        .from('attendance_imports')
        .update({
          status: 'completed',
          records_imported: imported,
          records_skipped: skipped,
        })
        .eq('id', importRow.id);

      setSummary({ imported, skipped, unmatched: Array.from(unmatched) });
      setStep('done');
      toast({
        title: 'Import complete',
        description: `${imported} record(s) imported, ${skipped} skipped.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Import failed',
        description: (err as Error).message ?? 'Unknown error',
        variant: 'destructive',
      });
      setStep('preview');
    }
  };

  // Group records by date asc, then by check-in time asc within each date.
  const groupedRecords = useMemo(() => {
    if (!parsed?.records?.length) return [] as { date: string; rows: ParsedRecord[] }[];
    const map = new Map<string, ParsedRecord[]>();
    for (const r of parsed.records) {
      if (!map.has(r.date)) map.set(r.date, []);
      map.get(r.date)!.push(r);
    }
    const dates = Array.from(map.keys()).sort();
    return dates.map(date => {
      const rows = map.get(date)!.slice().sort((a, b) => {
        const am = timeToMinutes(a.check_in);
        const bm = timeToMinutes(b.check_in);
        if (am == null && bm == null) return 0;
        if (am == null) return 1;
        if (bm == null) return -1;
        return am - bm;
      });
      return { date, rows };
    });
  }, [parsed]);

  // ---------------- Render ----------------

  if (!isAuthorised) {
    return (
      <div className="p-8 text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
        You don't have permission to access attendance upload.
      </div>
    );
  }

  const completeCount = parsed?.records.filter(r => r.check_in && r.check_out).length ?? 0;
  const incompleteCount = (parsed?.records.length ?? 0) - completeCount;
  const employeeCount = new Set(parsed?.records.map(r => r.employee_code) ?? []).size;

  const formatGroupDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00${KARACHI_OFFSET}`);
    return format(d, 'EEEE, dd MMM yyyy');
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      {/* Step 1: Select month/year + upload */}
      {(step === 'select' || step === 'parsing') && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
              Upload attendance file
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pick the period the file covers, then upload a ZKTeco-style .xls or .xlsx export.
              Our AI parser will normalise the data before you confirm the import.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={month} onValueChange={setMonth} disabled={step === 'parsing'}>
                <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear} disabled={step === 'parsing'}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {month && year && (
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center"
              style={{ borderColor: 'hsl(var(--border))' }}>
              {step === 'parsing' ? (
                <>
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                  <p className="text-sm font-medium text-foreground">AI is parsing your file…</p>
                  {fileName && <p className="text-xs text-muted-foreground mt-1">{fileName}</p>}
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">Choose an .xls or .xlsx file</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Period: {month} {year}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Choose file
                  </Button>
                  {parseError && (
                    <p className="text-xs text-destructive mt-3 max-w-md">{parseError}</p>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && parsed && (
        <Card className="p-6 flex flex-col gap-4 h-[calc(100vh-7rem)]">
          <div className="flex items-start justify-between gap-4 flex-wrap shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                Preview parsed records
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review the data carefully. Nothing is saved until you click <strong>Confirm Import</strong>.
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">{employeeCount} employees</Badge>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{completeCount} complete</Badge>
              {incompleteCount > 0 && (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{incompleteCount} incomplete</Badge>
              )}
            </div>
          </div>

          {parsed.warnings && parsed.warnings.length > 0 && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900 shrink-0">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertTriangle className="h-4 w-4" /> Parser warnings
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                {parsed.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {parsed.records.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center flex-1">
              No records to preview.
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 z-20 bg-secondary">
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead className="text-right">Hrs</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedRecords.map(group => (
                    <Fragment key={group.date}>
                      <TableRow className="border-b-0 hover:bg-transparent">
                        <TableCell
                          colSpan={6}
                          className="sticky top-10 z-10 backdrop-blur-sm p-0 border-b-0"
                        >
                          <div
                            className="flex items-center gap-2 h-9 pl-4 pr-4"
                            style={{
                              backgroundColor: 'rgba(91, 63, 248, 0.08)',
                              borderLeft: '3px solid #5B3FF8',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#5B3FF8',
                              }}
                            >
                              {formatGroupDate(group.date)}
                            </span>
                            <span
                              style={{
                                backgroundColor: 'rgba(91, 63, 248, 0.12)',
                                color: '#5B3FF8',
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                lineHeight: 1.4,
                              }}
                            >
                              {group.rows.length} record{group.rows.length === 1 ? '' : 's'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {group.rows.map((r, idx) => {
                        const wh = workingHours(r.check_in, r.check_out);
                        const isShort = wh != null && wh < shiftHours - 0.1;
                        const isOT = wh != null && wh > shiftHours + 0.1;
                        const otAmount = isOT && wh != null ? Math.round((wh - shiftHours) * 100) / 100 : 0;
                        const rowStyle = isShort
                          ? { backgroundColor: 'rgba(239, 68, 68, 0.04)' }
                          : undefined;
                        return (
                          <TableRow key={`${group.date}-${idx}`} style={rowStyle}>
                            <TableCell className="font-mono text-xs">{r.employee_code}</TableCell>
                            <TableCell className="text-sm">{r.name ?? '—'}</TableCell>
                            <TableCell>
                              {r.check_in ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-mono">
                                  {r.check_in.slice(0, 5)}
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {r.check_out ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-mono">
                                  {r.check_out.slice(0, 5)}
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">missing</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                              {wh == null ? (
                                <span className="text-muted-foreground">—</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 justify-end">
                                  <span
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: 500,
                                      color: isShort ? '#E84545' : '#120E36',
                                    }}
                                  >
                                    {wh.toFixed(2)}h
                                  </span>
                                  {isOT && (
                                    <span
                                      style={{
                                        backgroundColor: 'rgba(91, 63, 248, 0.15)',
                                        color: '#5B3FF8',
                                        fontSize: '10px',
                                        padding: '1px 6px',
                                        borderRadius: '9999px',
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      +{otAmount}h OT
                                    </span>
                                  )}
                                </span>
                              )}
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

          <div className="flex justify-end gap-2 pt-2 shrink-0 border-t mt-0">
            <Button variant="outline" onClick={cancelPreview}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={confirmImport} disabled={parsed.records.length === 0}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Import
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Importing */}
      {step === 'importing' && (
        <Card className="p-10 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-foreground">Saving records to the database…</p>
          <p className="text-xs text-muted-foreground mt-1">Please don't close this tab.</p>
        </Card>
      )}

      {/* Step 5: Done */}
      {step === 'done' && summary && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                Import complete
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'PPpp')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <p className="text-xs text-muted-foreground">Records imported</p>
              <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                {summary.imported}
              </p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-xs text-muted-foreground">Records skipped</p>
              <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
                {summary.skipped}
              </p>
            </div>
          </div>

          {summary.unmatched.length > 0 && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertTriangle className="h-4 w-4" /> Unmatched employee codes
              </div>
              <p className="text-xs mb-2">
                The following employee codes from the file were not found in your employee directory.
                Please make sure these codes match exactly what is set on each employee profile, then re-upload.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.unmatched.map(code => (
                  <Badge key={code} variant="outline" className="font-mono text-xs">{code}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={reset}>
              <RotateCw className="h-4 w-4 mr-2" /> Done
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceUpload;
