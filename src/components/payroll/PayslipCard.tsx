import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Download, DollarSign, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MONTHS_LBL: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};
const MONTHS_FULL: Record<string, string> = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June',
  '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December',
};

const fmtPKR = (n: number) =>
  `PKR ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const parseTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h + (m || 0) / 60;
};

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E', label: 'Draft' },
  approved: { bg: '#EBE6FF', text: '#2B1899', label: 'Approved' },
  paid: { bg: '#D1FAE5', text: '#065F46', label: 'Paid' },
};

const Pill = ({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) => (
  <span
    className="inline-flex items-center text-xs font-medium"
    style={{ backgroundColor: bg, color, padding: '4px 12px', borderRadius: 9999, fontFamily: 'var(--ff-body)' }}
  >
    {children}
  </span>
);

const KeyLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-[11px] uppercase font-medium"
    style={{ color: '#9490B4', letterSpacing: '0.06em', fontFamily: 'var(--ff-body)' }}
  >
    {children}
  </div>
);

// ─── Three-column table block ─────────────────────────────────────────────
interface TableSpec {
  title: string;
  rows: { label: string; value: React.ReactNode; bold?: boolean; valueColor?: string; note?: boolean }[];
}


const PayslipTable = ({ spec }: { spec: TableSpec }) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        background: '#1A1240',
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center',
        padding: '10px 16px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: 'var(--ff-body)',
      }}
    >
      {spec.title}
    </div>
    <div
      style={{
        background: '#F6F5FF',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontSize: 12,
        fontWeight: 500,
        color: '#4B4468',
        padding: '8px 16px',
        fontFamily: 'var(--ff-body)',
      }}
    >
      <span>Description</span>
      <span style={{ textAlign: 'right' }}>Value</span>
    </div>
    {spec.rows.map((r, i) => (
      <div
        key={i}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: r.note ? '4px 16px 8px' : '10px 16px',
          fontSize: r.note ? 11 : 13,
          background: i % 2 === 1 ? '#F6F5FF' : '#fff',
          borderBottom: r.note ? 'none' : '0.5px solid rgba(91,63,248,0.15)',
          fontFamily: 'var(--ff-body)',
          fontStyle: r.note ? 'italic' : 'normal',
        }}
      >
        <span style={{ color: r.note ? '#9490B4' : '#4B4468', fontWeight: r.bold ? 600 : 400 }}>{r.label}</span>
        <span
          style={{
            color: r.note ? '#9490B4' : (r.valueColor || '#120E36'),
            fontWeight: r.bold ? 700 : 500,
            textAlign: 'right',
          }}
        >
          {r.value}
        </span>
      </div>
    ))}

  </div>
);

interface PayslipCardProps {
  employeeId: string;
  monthYear: string; // YYYY-MM
}

const PayslipCard = ({ employeeId, monthYear }: PayslipCardProps) => {
  const { employee: authEmp } = useAuth();
  const roles = authEmp?.roles ?? [];
  const isCeo = roles.includes('ceo');
  const isFinance = roles.includes('finance_manager');
  const isHR = roles.includes('hr_manager');
  const isSelf = authEmp?.employee_id === employeeId;

  // Visibility: own payslip always shows everything. For viewing others, only CEO/Finance/HR can see salary.
  const canSeeSalary = isSelf || isCeo || isFinance || isHR;

  const [downloading, setDownloading] = useState(false);

  const [year, month] = monthYear.split('-');
  const monthLabelShort = `${MONTHS_LBL[month]}-${year}`;
  const monthLabelFull = `${MONTHS_FULL[month]} ${year}`;

  const { data: emp, isLoading: empLoading } = useQuery({
    queryKey: ['payslip-emp', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, designation, department, employee_code, avatar_url, basic_salary, allowance, company_id, joining_date')
        .eq('id', employeeId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  const { data: company } = useQuery({
    queryKey: ['payslip-company', emp?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('companies')
        .select('name, logo_url')
        .eq('id', emp!.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!emp?.company_id,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['payslip-settings', emp?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('shift_start_time, shift_end_time, lunch_break_hours, ot_divisor, enable_ot_adjustment, working_days')
        .eq('company_id', emp!.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!emp?.company_id,
  });

  const { data: holidays } = useQuery({
    queryKey: ['payslip-holidays', emp?.company_id, monthYear],
    queryFn: async () => {
      const { data } = await supabase
        .from('public_holidays' as any)
        .select('date, end_date, is_recurring')
        .eq('company_id', emp!.company_id);
      return data ?? [];
    },
    enabled: !!emp?.company_id,
  });

  const { data: record } = useQuery({
    queryKey: ['payslip-record', employeeId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  const { data: attendance } = useQuery({
    queryKey: ['payslip-attendance', employeeId, monthYear],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('attendance_records')
        .select('date, regular_ot_hours, holiday_ot_hours, status, is_late')
        .eq('employee_id', employeeId)
        .gte('date', `${monthYear}-01`)
        .lte('date', `${monthYear}-${String(last).padStart(2, '0')}`);
      return data ?? [];
    },
    enabled: !!employeeId,
  });

  const { data: leaves } = useQuery({
    queryKey: ['payslip-leaves', employeeId, monthYear],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('leave_requests')
        .select('days_requested, start_date, end_date')
        .eq('employee_id', employeeId)
        .eq('status', 'approved')
        .lte('start_date', `${monthYear}-${String(last).padStart(2, '0')}`)
        .gte('end_date', `${monthYear}-01`);
      return data ?? [];
    },
    enabled: !!employeeId,
  });

  const { data: loanDeduction } = useQuery({
    queryKey: ['payslip-loan', employeeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('loans')
        .select('monthly_deduction, remaining_balance, status')
        .eq('employee_id', employeeId)
        .eq('status', 'active');
      return (data ?? []).reduce(
        (s: number, l: any) =>
          s + Math.min(Number(l.monthly_deduction || 0), Number(l.remaining_balance || 0)),
        0
      );
    },
    enabled: !!employeeId,
  });

  const rates = useMemo(() => {
    if (!emp || !settings) return null;
    const shiftDuration = Math.max(0, parseTime(settings.shift_end_time) - parseTime(settings.shift_start_time));
    const lunch = Number(settings.lunch_break_hours || 0);
    const workingPerDay = Math.max(0.0001, shiftDuration - lunch);
    const perDay = Number(emp.basic_salary || 0) / Number(settings.ot_divisor || 26);
    const perHour = perDay / workingPerDay;
    return { perDay, perHour };
  }, [emp, settings]);

  const attStats = useMemo(() => {
    let present = 0, late = 0, otSum = 0, holOt = 0, shortTime = 0, overtime = 0;
    const attendedDates = new Set<string>();
    for (const r of attendance ?? []) {
      const st = String(r.status || '').toLowerCase();
      if (st === 'present' || st === 'late') present++;
      if (r.is_late) late++;
      const v = Number(r.regular_ot_hours || 0);
      otSum += v;
      if (v < 0) shortTime += v;
      else if (v > 0) overtime += v;
      holOt += Number(r.holiday_ot_hours || 0);
      if ((r as any).date) attendedDates.add(String((r as any).date));
    }

    const [y, m] = monthYear.split('-').map(Number);
    const startDate = `${monthYear}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const endDate = `${monthYear}-${String(lastDay).padStart(2, '0')}`;
    const fmtDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // Expand leaves into a date set (any day; weekend/holiday filter applied below)
    const leaveDateSet = new Set<string>();
    (leaves ?? []).forEach((l: any) => {
      const ls = new Date(l.start_date + 'T00:00:00');
      const le = new Date(l.end_date + 'T00:00:00');
      const start = ls.getTime() < new Date(startDate + 'T00:00:00').getTime() ? new Date(startDate + 'T00:00:00') : ls;
      const end = le.getTime() > new Date(endDate + 'T00:00:00').getTime() ? new Date(endDate + 'T00:00:00') : le;
      const cur = new Date(start);
      while (cur <= end) {
        leaveDateSet.add(fmtDate(cur));
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Working day config and holiday set
    const workingDays: number[] = Array.isArray((settings as any)?.working_days)
      ? (settings as any).working_days
      : [1, 2, 3, 4, 5];
    const holidaySet = new Set<string>();
    (holidays ?? []).forEach((h: any) => {
      const hStart = h.is_recurring
        ? `${monthYear.split('-')[0]}-${(h.date as string).slice(5)}`
        : (h.date as string);
      const hEnd = h.end_date
        ? (h.is_recurring
          ? `${monthYear.split('-')[0]}-${(h.end_date as string).slice(5)}`
          : (h.end_date as string))
        : hStart;
      const cur = new Date(hStart + 'T00:00:00');
      const stop = new Date(hEnd + 'T00:00:00');
      while (cur <= stop) {
        const ds = fmtDate(cur);
        if (ds >= startDate && ds <= endDate) holidaySet.add(ds);
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Count leave days restricted to working days within window
    let leaveDays = 0;
    leaveDateSet.forEach(ds => {
      const dow = new Date(ds + 'T00:00:00').getDay();
      if (workingDays.includes(dow) && !holidaySet.has(ds)) leaveDays++;
    });

    // Compute absent days: working days with no attendance and no leave
    let absent = 0;
    const cur = new Date(startDate + 'T00:00:00');
    const stop = new Date(endDate + 'T00:00:00');
    while (cur <= stop) {
      const ds = fmtDate(cur);
      const dow = cur.getDay();
      if (
        workingDays.includes(dow)
        && !holidaySet.has(ds)
        && !attendedDates.has(ds)
        && !leaveDateSet.has(ds)
      ) {
        absent++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return { present, late, leaveDays, otSum, holOt, shortTime, overtime, absent };
  }, [attendance, leaves, monthYear, settings, holidays]);

  const breakdown = useMemo(() => {
    if (!emp || !rates) return null;
    if (record) {
      let st = 0, ot = 0;
      for (const r of attendance ?? []) {
        const v = Number(r.regular_ot_hours || 0);
        if (v < 0) st += v;
        else if (v > 0) ot += v;
      }
      const forgone = !!(record as any).forgo_ot;
      const regularOtAmount = forgone ? 0 : Number(record.regular_ot_amount || 0);
      const holidayOtAmount = Number(record.holiday_ot_amount || 0);
      return {
        source: 'payroll' as const,
        basic: Number(record.basic_salary || 0),
        allowance: Number(record.allowance || 0),
        shortTime: st,
        overtime: ot,
        regularOtAmount,
        holidayOtAmount,
        totalOt: regularOtAmount + holidayOtAmount,
        loan: Number(record.loan_deduction || 0),
        totalSalary: Number(record.total_salary || 0),
        finalPayment: Number(record.final_payment || 0),
        status: String(record.status || 'draft'),
        paymentDate: (record as any).payment_date || null,
        forgone,
      };

    }
    if ((attendance?.length ?? 0) === 0) return null;
    const regularOtAmount = attStats.otSum * rates.perHour;
    const holidayOtAmount = attStats.holOt * rates.perHour * 1.5;
    const totalOt = regularOtAmount + holidayOtAmount;
    const basic = Number(emp.basic_salary || 0);
    const allowance = Number(emp.allowance || 0);
    const total = basic + allowance + totalOt;
    return {
      source: 'estimated' as const,
      basic,
      allowance,
      shortTime: attStats.shortTime,
      overtime: attStats.overtime,
      regularOtAmount,
      holidayOtAmount,
      totalOt,
      loan: Number(loanDeduction || 0),
      totalSalary: total,
      finalPayment: total - Number(loanDeduction || 0),
      status: 'draft',
      paymentDate: null as string | null,
      forgone: false,
    };
  }, [emp, rates, record, attendance, attStats, loanDeduction]);

  const loading = empLoading || settingsLoading;
  const mask = (v: string) => (canSeeSalary ? v : '—');

  if (loading) {
    return <Skeleton className="w-full h-[520px] rounded-[14px]" />;
  }

  if (!emp) {
    return (
      <div
        className="w-full bg-white rounded-[14px] border p-12 text-center text-muted-foreground"
        style={{ borderColor: 'rgba(91,63,248,0.15)' }}
      >
        Employee not found.
      </div>
    );
  }

  const noData = !breakdown;
  const statusInfo = breakdown ? STATUS_BADGE[breakdown.status] || STATUS_BADGE.draft : null;

  // Three table specs
  const attTable: TableSpec = {
    title: 'Attendance Summary',
    rows: [
      { label: 'Present Days', value: attStats.present },
      { label: 'Absents', value: attStats.absent, valueColor: attStats.absent > 0 ? '#E84545' : undefined },
      { label: 'Leaves Taken', value: attStats.leaveDays },
      { label: 'Late Arrivals', value: attStats.late },
      { label: 'Short Time', value: `${Math.abs(attStats.shortTime).toFixed(2)} hrs` },
      { label: 'Overtime', value: `${attStats.overtime.toFixed(2)} hrs` },
    ],
  };
  const salaryTable: TableSpec = breakdown
    ? {
        title: 'Salary Breakdown',
        rows: [
          { label: 'Basic Salary', value: mask(fmtPKR(breakdown.basic)) },
          { label: 'Allowance', value: fmtPKR(breakdown.allowance) },
          { label: 'Per Day Salary', value: rates ? mask(fmtPKR(rates.perDay)) : '—' },
          { label: 'Per Hour Salary', value: rates ? mask(fmtPKR(rates.perHour)) : '—' },
        ],
      }
    : { title: 'Salary Breakdown', rows: [] };
  const otTable: TableSpec = breakdown
    ? {
        title: 'Overtime Summary',
        rows: [
          { label: 'Regular Overtime', value: fmtPKR(breakdown.regularOtAmount) },
          ...(breakdown.forgone
            ? [{ label: 'OT deduction forgone', value: '', note: true }]
            : []),
          { label: 'Holiday Overtime', value: fmtPKR(breakdown.holidayOtAmount) },
          {
            label: 'Total Overtime',
            value: fmtPKR(breakdown.totalOt),
            bold: true,
            valueColor: '#1DC97A',
          },
        ],
      }
    : { title: 'Overtime Summary', rows: [] };

  const pdfFilename = `${emp?.full_name || 'Payslip'} - ${monthLabelFull} - Payslip.pdf`;

  const handleDownload = async () => {
    const el = document.getElementById(`payslip-print-${employeeId}`);
    if (!el) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (imgHeight <= pageHeight - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
      } else {
        // Multi-page
        let heightLeft = imgHeight;
        let position = margin;
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
          heightLeft -= (pageHeight - margin * 2);
        }
      }
      pdf.save(pdfFilename);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const formatJoiningDate = (d: string) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    const day = String(dt.getDate()).padStart(2, '0');
    const month = dt.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month} ${dt.getFullYear()}`;
  };

  // Avatar URL with cache-busting param stripped issues — html2canvas needs CORS image
  const avatarSrc = emp?.avatar_url ? `${emp.avatar_url}${emp.avatar_url.includes('?') ? '&' : '?'}cors=1` : null;
  const logoSrc = company?.logo_url ? `${company.logo_url}${company.logo_url.includes('?') ? '&' : '?'}cors=1` : null;

  return (
    <>
      {/* Hide print-only render off-screen so html2canvas can capture it */}
      <style>{`
        #payslip-print-${employeeId} {
          position: fixed;
          left: -10000px;
          top: 0;
          width: 794px;
          background: white;
        }
      `}</style>

      {/* ─── On-screen card ─── */}
      <div
        className="w-full bg-white overflow-hidden no-print"
        style={{ borderRadius: 14, border: '0.5px solid rgba(91,63,248,0.15)' }}
      >
        <div style={{ height: 4, backgroundColor: '#5B3FF8' }} />

        {/* Header */}
        <div className="px-7 py-5" style={{ borderBottom: '0.5px solid rgba(91,63,248,0.15)' }}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[18px] font-bold" style={{ color: '#120E36', fontFamily: 'var(--ff-display)' }}>
              Salary Slip
            </h2>
            <div className="flex items-center gap-3">
              <Pill bg="#F6F5FF" color="#4B4468">{monthLabelShort}</Pill>
              {breakdown && (
                <Button onClick={handleDownload} variant="ghost" size="sm" className="h-8" disabled={downloading}>
                  {downloading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
                  {downloading ? 'Generating…' : 'Download PDF'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={emp.avatar_url || undefined} />
                <AvatarFallback className="text-sm">{initials(emp.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-[15px] font-medium" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                  {emp.full_name}
                </div>
                <div className="text-xs" style={{ color: '#9490B4', fontFamily: 'var(--ff-body)' }}>
                  {emp.designation || '—'}
                  {emp.employee_code ? ` · ${emp.employee_code}` : ''}
                </div>
              </div>
            </div>
            <div className="flex gap-8 text-xs" style={{ fontFamily: 'var(--ff-body)' }}>
              <div>
                <div style={{ color: '#9490B4' }}>Employee ID</div>
                <div style={{ color: '#120E36' }} className="font-medium mt-0.5">{emp.employee_code || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#9490B4' }}>Department</div>
                <div style={{ color: '#120E36' }} className="font-medium mt-0.5">{emp.department || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {noData ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <DollarSign className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-base font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
              No payslip data for {monthLabelFull}
            </p>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
              Payroll has not been generated and no attendance is available.
            </p>
          </div>
        ) : (
          <>
            {/* Key figures */}
            <div className="grid grid-cols-3">
              <div className="px-6 py-4">
                <KeyLabel>Basic salary</KeyLabel>
                <div className="text-[15px] font-medium mt-1.5" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                  {mask(fmtPKR(breakdown.basic))}
                </div>
              </div>
              <div
                className="px-6 py-4"
                style={{
                  borderLeft: '0.5px solid rgba(91,63,248,0.15)',
                  borderRight: '0.5px solid rgba(91,63,248,0.15)',
                }}
              >
                <KeyLabel>Allowance</KeyLabel>
                <div className="text-[15px] font-medium mt-1.5" style={{ color: '#120E36', fontFamily: 'var(--ff-body)' }}>
                  {fmtPKR(breakdown.allowance)}
                </div>
              </div>
              <div className="px-6 py-4">
                <KeyLabel>Overtime</KeyLabel>
                <div
                  className="text-[15px] font-medium mt-1.5"
                  style={{
                    color: breakdown.totalOt > 0 ? '#1DC97A' : breakdown.totalOt < 0 ? '#E84545' : '#9490B4',
                    fontFamily: 'var(--ff-body)',
                  }}
                >
                  {fmtPKR(breakdown.totalOt)}
                </div>
              </div>
            </div>

            {breakdown.source === 'estimated' && (
              <div
                className="mx-7 mt-4 flex items-center gap-2 px-3 py-2 text-xs"
                style={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  borderLeft: '3px solid #F5A623',
                  borderRadius: 4,
                }}
              >
                <AlertTriangle size={14} />
                Estimated — payroll not yet generated for this month
              </div>
            )}

            {/* Three side-by-side tables */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 mt-4"
              style={{ borderTop: '0.5px solid rgba(91,63,248,0.15)' }}
            >
              <div>
                <PayslipTable spec={attTable} />
              </div>
              <div style={{ borderLeft: '0.5px solid rgba(91,63,248,0.15)', borderRight: '0.5px solid rgba(91,63,248,0.15)' }}>
                <PayslipTable spec={salaryTable} />
              </div>
              <div>
                <PayslipTable spec={otTable} />
              </div>
            </div>

            {/* Footer */}
            <div
              className="grid grid-cols-2"
              style={{
                backgroundColor: '#F6F5FF',
                borderTop: '0.5px solid rgba(91,63,248,0.15)',
                borderBottomLeftRadius: 14,
                borderBottomRightRadius: 14,
              }}
            >
              <div className="px-7 py-[18px]">
                <KeyLabel>Total Salary</KeyLabel>
                <div
                  className="mt-1"
                  style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 24, color: '#120E36' }}
                >
                  {fmtPKR(breakdown.totalSalary)}
                </div>
              </div>
              <div className="px-7 py-[18px]" style={{ borderLeft: '0.5px solid rgba(91,63,248,0.15)' }}>
                <KeyLabel>Final Payment</KeyLabel>
                <div
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--ff-display)',
                    fontWeight: 700,
                    fontSize: 28,
                    color: '#5B3FF8',
                    lineHeight: 1.1,
                  }}
                >
                  {fmtPKR(breakdown.finalPayment)}
                </div>
                {statusInfo && breakdown.source === 'payroll' && (
                  <div className="mt-2">
                    <Pill bg={statusInfo.bg} color={statusInfo.text}>{statusInfo.label}</Pill>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Print-only PDF view ─── */}
      {breakdown && (
        <div
          id={`payslip-print-${employeeId}`}
          style={{ fontFamily: "'DM Sans', sans-serif", color: '#120E36', fontSize: 11 }}
        >
          {/* 1. Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
            <tbody>
              <tr>
                <td style={{ width: '30%', verticalAlign: 'middle' }}>
                  {logoSrc ? (
                    <img src={logoSrc} crossOrigin="anonymous" alt="logo" style={{ height: 40, maxWidth: 150, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{company?.name || ''}</div>
                  )}
                </td>
                <td style={{ width: '40%', textAlign: 'center', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: 2, verticalAlign: 'middle' }}>
                  SALARY SLIP
                </td>
                <td style={{ width: '30%', textAlign: 'right', verticalAlign: 'middle' }}>
                  <span style={{ display: 'inline-block', background: '#1A1240', color: '#fff', padding: '6px 12px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
                    {monthLabelShort}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 2. Employee info box */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E1FA', borderRadius: 8, marginBottom: 14, fontSize: 11 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: 12, verticalAlign: 'top', lineHeight: 1.7 }}>
                  <table style={{ borderCollapse: 'collapse' }}><tbody><tr>
                    <td style={{ verticalAlign: 'top', paddingRight: 12 }}>
                      {avatarSrc ? (
                        <img src={avatarSrc} crossOrigin="anonymous" alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#5B3FF8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                          {initials(emp.full_name)}
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div><span style={{ color: '#9490B4' }}>Employee ID: </span><strong>{emp.employee_code || '—'}</strong></div>
                      <div><span style={{ color: '#9490B4' }}>Employee Name: </span><strong>{emp.full_name}</strong></div>
                      <div><span style={{ color: '#9490B4' }}>Designation: </span><strong>{emp.designation || '—'}</strong></div>
                      <div><span style={{ color: '#9490B4' }}>Department: </span><strong>{emp.department || '—'}</strong></div>
                      <div><span style={{ color: '#9490B4' }}>Joining Date: </span><strong>{emp.joining_date ? formatJoiningDate(emp.joining_date) : '—'}</strong></div>
                    </td>
                  </tr></tbody></table>
                </td>
                <td style={{ width: '50%', padding: 12, borderLeft: '1px solid #E5E1FA', verticalAlign: 'top', lineHeight: 1.7 }}>
                  <div><span style={{ color: '#9490B4' }}>Salary Month: </span><strong>{monthLabelFull}</strong></div>
                  <div><span style={{ color: '#9490B4' }}>Basic Salary: </span><strong>{mask(fmtPKR(breakdown.basic))}</strong></div>
                  <div><span style={{ color: '#9490B4' }}>Allowance: </span><strong>{fmtPKR(breakdown.allowance)}</strong></div>
                  <div><span style={{ color: '#9490B4' }}>Total Salary: </span><strong>{fmtPKR(breakdown.totalSalary)}</strong></div>
                  <div><span style={{ color: '#9490B4' }}>Payment Date: </span><strong>{breakdown.paymentDate ? formatJoiningDate(breakdown.paymentDate) : '-'}</strong></div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 3. Three tables in a 3-column grid using a table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E1FA', marginBottom: 14, tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                {[attTable, salaryTable, otTable].map((spec, idx) => (
                  <td key={idx} style={{ width: '33.33%', verticalAlign: 'top', padding: 0, borderLeft: idx > 0 ? '1px solid #E5E1FA' : 'none' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                      <thead>
                        <tr>
                          <th colSpan={2} style={{ background: '#1A1240', color: '#fff', fontSize: 10, fontWeight: 600, padding: '8px 10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {spec.title}
                          </th>
                        </tr>
                        <tr style={{ background: '#F6F5FF', color: '#4B4468' }}>
                          <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 500, fontSize: 10 }}>Description</th>
                          <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 500, fontSize: 10 }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spec.rows.map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 1 ? '#F6F5FF' : '#fff', borderBottom: '0.5px solid rgba(91,63,248,0.15)' }}>
                            <td style={{ padding: '6px 10px', textAlign: 'left', color: '#4B4468', fontWeight: r.bold ? 600 : 400, whiteSpace: 'nowrap', fontSize: 10 }}>{r.label}</td>
                            <td style={{ padding: '6px 10px', textAlign: 'right', color: r.valueColor || '#120E36', fontWeight: r.bold ? 700 : 500, whiteSpace: 'nowrap', fontSize: 10 }}>{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* 4. Footer bar */}
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#F6F5FF', borderRadius: 8, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '12px 16px', verticalAlign: 'top' }}>
                  <div style={{ fontSize: 10, color: '#9490B4', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Total Salary</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: '#120E36', marginTop: 4 }}>
                    {fmtPKR(breakdown.totalSalary)}
                  </div>
                </td>
                <td style={{ width: '50%', padding: '12px 16px', borderLeft: '1px solid #E5E1FA', verticalAlign: 'top' }}>
                  <div style={{ fontSize: 10, color: '#9490B4', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Total Payment</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: '#1DC97A', marginTop: 4 }}>
                    {fmtPKR(breakdown.finalPayment)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 5. Footer note */}
          <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 10, color: '#9490B4' }}>
            This is a computer generated slip. No signature required.
          </div>
        </div>
      )}
    </>
  );
};

export default PayslipCard;
