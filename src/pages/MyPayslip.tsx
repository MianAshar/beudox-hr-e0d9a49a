import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

const MyPayslip = () => {
  const { employee } = useAuth();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const monthYear = `${selectedYear}-${selectedMonth}`;

  const { data: record, isLoading } = useQuery({
    queryKey: ['my-payslip', employee?.employee_id, monthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('employee_id', employee!.employee_id)
        .eq('month_year', monthYear)
        .eq('superseded', false)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!employee?.employee_id,
  });

  const style = record ? (statusStyles[record.status] || statusStyles.draft) : null;

  const Row = ({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) => (
    <div className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono' : ''}`} style={{ fontFamily: mono ? undefined : 'var(--ff-body)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : !record ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <DollarSign className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium" style={{ fontFamily: 'var(--ff-display)' }}>
            No payslip available
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
            Payroll for this month has not been generated yet.
          </p>
        </div>
      ) : (
        <Card className="max-w-lg">
          <CardContent className="pt-6 space-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>
                {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </h3>
              {style && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              )}
            </div>

            <Row label="Basic Salary" value={Number(record.basic_salary)} />
            <Row label="Allowance" value={Number(record.allowance)} />
            <Row label="Regular OT Hours" value={Number(record.regular_ot_hours).toFixed(1)} />
            <Row label="Regular OT Amount" value={Number(record.regular_ot_amount)} />
            <Row label="Holiday OT Hours" value={Number(record.holiday_ot_hours).toFixed(1)} />
            <Row label="Holiday OT Amount" value={Number(record.holiday_ot_amount)} />
            <Row label="Bonus" value={Number(record.bonus)} />
            <Row label="Dinner Expense" value={Number(record.dinner_expense)} />
            <Row label="Loan Deduction" value={Number(record.loan_deduction)} />

            <div className="pt-3 mt-3 border-t-2 border-border">
              <Row label="Total Salary" value={Number(record.total_salary)} />
              <div className="flex justify-between py-2.5">
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--ff-body)' }}>Final Payment</span>
                <span className="text-base font-bold font-mono">
                  PKR {Number(record.final_payment).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPayslip;
