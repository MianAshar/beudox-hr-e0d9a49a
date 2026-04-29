import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign } from 'lucide-react';

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

const statusStyles: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  approved: { bg: '#D1FAE5', text: '#065F46' },
  paid: { bg: '#EBE6FF', text: '#2B1899' },
};

const Row = ({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) => (
  <div className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{label}</span>
    <span className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
  </div>
);

const PayrollTab = ({ employeeId }: { employeeId: string }) => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));
  const monthYear = `${year}-${month}`;
  const monthLabel = MONTHS.find(m => m.value === month)?.label || '';

  const { data: record, isLoading } = useQuery({
    queryKey: ['employee-payslip', employeeId, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*, companies:company_id(id)')
        .eq('employee_id', employeeId)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });

  const { data: settings } = useQuery({
    queryKey: ['company-payroll-settings', record?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('enable_ot_adjustment')
        .eq('company_id', (record as any)!.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!record?.company_id,
  });

  const enableOt = (settings as any)?.enable_ot_adjustment ?? true;
  const style = record ? (statusStyles[record.status] || statusStyles.draft) : null;

  // Derive short time and overtime from attendance for this period
  const { data: attBreakdown } = useQuery({
    queryKey: ['payslip-att-breakdown', employeeId, monthYear, enableOt],
    queryFn: async () => {
      const [y, m] = monthYear.split('-').map(Number);
      const last = new Date(y, m, 0).getDate();
      const { data } = await supabase
        .from('attendance_records')
        .select('regular_ot_hours')
        .eq('employee_id', employeeId)
        .gte('date', `${monthYear}-01`)
        .lte('date', `${monthYear}-${String(last).padStart(2, '0')}`);
      let shortTime = 0, overtime = 0;
      for (const r of data ?? []) {
        const v = Number(r.regular_ot_hours || 0);
        if (v < 0) shortTime += v;
        else if (v > 0) overtime += v;
      }
      return { shortTime, overtime };
    },
    enabled: !!employeeId && enableOt,
  });

  const shortTime = attBreakdown?.shortTime ?? 0;
  const overtime = attBreakdown?.overtime ?? 0;

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

      {isLoading ? (
        <div className="space-y-3 max-w-lg">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}</div>
      ) : !record ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <DollarSign className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium" style={{ fontFamily: 'var(--ff-display)' }}>No payslip available</p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>Payroll for this month has not been generated yet.</p>
        </div>
      ) : (
        <Card className="max-w-lg">
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>{monthLabel} {year}</h3>
              {style && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: style.bg, color: style.text }}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              )}
            </div>
            <Row label="Basic Salary" value={`PKR ${Number(record.basic_salary).toLocaleString()}`} mono={false} />
            <Row label="Allowance" value={`PKR ${Number(record.allowance).toLocaleString()}`} mono={false} />
            {enableOt && (
              <>
                <div className="flex justify-between py-2.5 border-b border-border/50">
                  <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>Short Time</span>
                  <span className={`text-sm font-medium font-mono ${shortTime < 0 ? 'text-destructive' : ''}`}>
                    {Math.abs(shortTime).toFixed(2)} hrs
                  </span>
                </div>
                <Row label="Overtime" value={`${overtime.toFixed(2)} hrs`} />
                <Row label="Net Regular OT" value={`${Number(record.regular_ot_hours).toFixed(2)} hrs`} />
                <Row label="Regular OT Amount" value={`PKR ${Math.round(Number(record.regular_ot_amount)).toLocaleString()}`} mono={false} />
                <Row label="Holiday OT" value={`${Number(record.holiday_ot_hours).toFixed(2)} hrs`} />
                <Row label="Holiday OT Amount" value={`PKR ${Math.round(Number(record.holiday_ot_amount)).toLocaleString()}`} mono={false} />
                <Row label="Total OT" value={`PKR ${Math.round(Number(record.regular_ot_amount) + Number(record.holiday_ot_amount)).toLocaleString()}`} mono={false} />
              </>
            )}
            {Number(record.bonus) > 0 && <Row label="Bonus" value={`PKR ${Number(record.bonus).toLocaleString()}`} mono={false} />}
            {Number(record.loan_deduction) > 0 && <Row label="Loan Deduction" value={`- PKR ${Number(record.loan_deduction).toLocaleString()}`} mono={false} />}
            <div className="pt-3 mt-3 border-t-2 border-border">
              <Row label="Total Salary" value={`PKR ${Math.round(Number(record.total_salary)).toLocaleString()}`} mono={false} />
              <div className="flex justify-between py-2.5">
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--ff-body)' }}>Final Payment</span>
                <span className="text-base font-bold font-mono">PKR {Number(record.final_payment).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayrollTab;
