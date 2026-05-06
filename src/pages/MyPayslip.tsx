import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/format-date';
import PayslipCard from '@/components/payroll/PayslipCard';

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

  // Pull record only for the print template (PayslipCard handles its own data)
  const { data: record } = useQuery({
    queryKey: ['my-payslip-print', employee?.employee_id, monthYear],
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

  const { data: settings } = useQuery({
    queryKey: ['my-company-payroll-settings', employee?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_settings')
        .select('enable_ot_adjustment')
        .eq('company_id', employee!.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!employee?.company_id,
  });

  const enableOt = (settings as any)?.enable_ot_adjustment ?? true;
  const style = record ? (statusStyles[record.status] || statusStyles.draft) : null;
  const handleDownload = () => window.print();

  const buildRows = () => {
    if (!record) return [] as { label: string; value: number; isDeduction?: boolean }[];
    const rows: { label: string; value: number; isDeduction?: boolean }[] = [
      { label: 'Basic Salary', value: Number(record.basic_salary) },
      { label: 'Allowance', value: Number(record.allowance) },
    ];
    if (enableOt) {
      rows.push(
        { label: `Net Regular OT (${Number(record.regular_ot_hours).toFixed(2)} hrs)`, value: Number(record.regular_ot_amount) },
        { label: `Holiday OT (${Number(record.holiday_ot_hours).toFixed(2)} hrs)`, value: Number(record.holiday_ot_amount) },
      );
    }
    if (Number(record.bonus) > 0) rows.push({ label: 'Bonus', value: Number(record.bonus) });
    if (Number(record.loan_deduction) > 0) rows.push({ label: 'Loan Deduction', value: Number(record.loan_deduction), isDeduction: true });
    return rows;
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 24px; }
          body * { visibility: hidden !important; }
          #payslip-print, #payslip-print * { visibility: visible !important; }
          #payslip-print {
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 100% !important; padding: 24px !important; background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:flex-wrap no-print">
          <div className="flex gap-3 flex-wrap">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="flex-1 sm:w-[160px] sm:flex-initial"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="flex-1 sm:w-[120px] sm:flex-initial"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {employee?.employee_id && (
          <div className="no-print">
            <PayslipCard
              employeeId={employee.employee_id}
              monthYear={monthYear}
              onDownload={record ? handleDownload : undefined}
            />
          </div>
        )}

        {/* Print-only branded payslip (kept intact for PDF) */}
        {record && (
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
                .ps-table td:last-child { text-align: right; font-family: 'DM Sans', sans-serif; font-weight: 500; }
                .ps-table tr:nth-child(even) td { background: #F6F5FF; }
                .ps-table .ps-deduction td:last-child { color: #DC2626; }
                .ps-total-row td { background: #F6F5FF !important; font-weight: 700; font-size: 14px; border-top: 2px solid #ddd; }
                .ps-final-row td { background: #5B3FF8 !important; color: #fff !important; font-weight: 800; font-size: 16px; font-family: 'Outfit', sans-serif; }
                .ps-footer { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 12px; border-top: 2px solid #5B3FF8; font-size: 11px; color: #999; }
              }
            `}</style>
            <div className="ps-header">
              {employee?.company_logo_url && (
                <img src={employee.company_logo_url} alt="Company Logo" className="ps-logo" />
              )}
              <p className="ps-company">{employee?.company_name}</p>
              <p className="ps-title">PAYSLIP</p>
              <p className="ps-month">{monthLabel} {selectedYear}</p>
            </div>
            <hr className="ps-divider" />
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
            <table className="ps-table">
              <thead>
                <tr><th>Description</th><th>Amount</th></tr>
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
            <div className="ps-footer">
              <span>Generated by Beudox</span>
              <span>{formatDate(new Date())}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPayslip;
