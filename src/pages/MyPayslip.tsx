import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DollarSign, Download } from 'lucide-react';
import { format } from 'date-fns';

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

const fmtPKR = (v: number) => `PKR ${v.toLocaleString()}`;

const MyPayslip = () => {
  const { employee } = useAuth();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const monthYear = `${selectedYear}-${selectedMonth}`;
  const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label || '';

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

  const handleDownload = () => window.print();

  // Build earnings/deductions rows for the print table
  const buildRows = () => {
    if (!record) return [];
    const rows: { label: string; value: number; isDeduction?: boolean }[] = [
      { label: 'Basic Salary', value: Number(record.basic_salary) },
      { label: 'Allowance', value: Number(record.allowance) },
      { label: `Regular OT (${Number(record.regular_ot_hours).toFixed(1)} hrs × rate × 1.0)`, value: Number(record.regular_ot_amount) },
      { label: `Holiday OT (${Number(record.holiday_ot_hours).toFixed(1)} hrs × rate × 1.5)`, value: Number(record.holiday_ot_amount) },
    ];
    if (Number(record.bonus) > 0) rows.push({ label: 'Bonus', value: Number(record.bonus) });
    if (Number(record.dinner_expense) > 0) rows.push({ label: 'Dinner Expense', value: Number(record.dinner_expense) });
    if (Number(record.loan_deduction) > 0) rows.push({ label: 'Loan Deduction', value: Number(record.loan_deduction), isDeduction: true });
    return rows;
  };

  const Row = ({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) => (
    <div className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono' : ''}`} style={{ fontFamily: mono ? undefined : 'var(--ff-body)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 24px; }
          body * { visibility: hidden !important; }
          #payslip-print, #payslip-print * { visibility: visible !important; }
          #payslip-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 24px !important;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="p-6 space-y-6">
        {/* Month selector + download button */}
        <div className="flex items-center justify-between flex-wrap gap-4 no-print">
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {record && (
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download Payslip
            </Button>
          )}
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
            <p className="text-lg font-medium" style={{ fontFamily: 'var(--ff-display)' }}>No payslip available</p>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--ff-body)' }}>Payroll for this month has not been generated yet.</p>
          </div>
        ) : (
          <>
            {/* Screen view card */}
            <Card className="max-w-lg no-print">
              <CardContent className="pt-6 space-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--ff-display)' }}>
                    {monthLabel} {selectedYear}
                  </h3>
                  {style && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: style.bg, color: style.text }}>
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
                    <span className="text-base font-bold font-mono">PKR {Number(record.final_payment).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Print-only branded payslip */}
            <div id="payslip-print" style={{ display: 'none', fontFamily: "'DM Sans', sans-serif", color: '#1A1240' }}>
              <style>{`
                @media print {
                  #payslip-print { display: block !important; }
                  .ps-header { text-align: center; margin-bottom: 16px; }
                  .ps-logo { height: 48px; max-width: 160px; object-fit: contain; margin: 0 auto 8px; display: block; }
                  .ps-company { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600; color: #1A1240; margin: 0 0 4px; }
                  .ps-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #5B3FF8; margin: 8px 0 4px; letter-spacing: 2px; }
                  .ps-month { font-size: 14px; color: #666; margin: 0 0 12px; }
                  .ps-divider { height: 3px; background: #5B3FF8; border: none; margin: 0 0 20px; }
                  .ps-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                  .ps-info-col { width: 48%; }
                  .ps-info-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
                  .ps-info-value { font-size: 13px; font-weight: 500; color: #1A1240; margin-bottom: 10px; }
                  .ps-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 99px; }
                  .ps-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
                  .ps-table th { background: #1A1240; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 16px; text-align: left; }
                  .ps-table th:last-child { text-align: right; }
                  .ps-table td { font-size: 13px; padding: 10px 16px; border-bottom: 1px solid #eee; }
                  .ps-table td:last-child { text-align: right; font-family: 'Courier New', monospace; font-weight: 500; }
                  .ps-table tr:nth-child(even) td { background: #F6F5FF; }
                  .ps-table .ps-deduction td:last-child { color: #DC2626; }
                  .ps-total-row td { background: #F6F5FF !important; font-weight: 700; font-size: 14px; border-top: 2px solid #ddd; }
                  .ps-final-row td { background: #5B3FF8 !important; color: #fff !important; font-weight: 800; font-size: 16px; font-family: 'Outfit', sans-serif; }
                  .ps-footer { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 12px; border-top: 2px solid #5B3FF8; font-size: 11px; color: #999; }
                }
              `}</style>

              {/* Header */}
              <div className="ps-header">
                {employee?.company_logo_url && (
                  <img src={employee.company_logo_url} alt="Company Logo" className="ps-logo" />
                )}
                <p className="ps-company">{employee?.company_name}</p>
                <p className="ps-title">PAYSLIP</p>
                <p className="ps-month">{monthLabel} {selectedYear}</p>
              </div>
              <hr className="ps-divider" />

              {/* Employee Info */}
              <div className="ps-info">
                <div className="ps-info-col">
                  <div className="ps-info-label">Employee Name</div>
                  <div className="ps-info-value">{employee?.full_name}</div>
                  <div className="ps-info-label">Designation</div>
                  <div className="ps-info-value">{employee?.designation || '—'}</div>
                  <div className="ps-info-label">Department</div>
                  <div className="ps-info-value">{employee?.department || '—'}</div>
                </div>
                <div className="ps-info-col" style={{ textAlign: 'right' }}>
                  <div className="ps-info-label">Employee Code</div>
                  <div className="ps-info-value">{employee?.employee_code || '—'}</div>
                  <div className="ps-info-label">Month</div>
                  <div className="ps-info-value">{monthLabel} {selectedYear}</div>
                  <div className="ps-info-label">Status</div>
                  <div className="ps-info-value">
                    <span className="ps-badge" style={{ backgroundColor: style?.bg, color: style?.text }}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <table className="ps-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {buildRows().map((row, i) => (
                    <tr key={i} className={row.isDeduction ? 'ps-deduction' : ''}>
                      <td>{row.label}</td>
                      <td>{row.isDeduction ? `- ${fmtPKR(row.value)}` : fmtPKR(row.value)}</td>
                    </tr>
                  ))}
                  <tr className="ps-total-row">
                    <td>Total Salary</td>
                    <td>{fmtPKR(Number(record.total_salary))}</td>
                  </tr>
                  <tr className="ps-final-row">
                    <td>Final Payment</td>
                    <td>{fmtPKR(Number(record.final_payment))}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div className="ps-footer">
                <span>Generated by Beudox</span>
                <span>{format(new Date(), 'dd MMM yyyy')}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyPayslip;
