import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

interface Props {
  employeeId: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]',
  approved: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]',
};

const SalaryHistoryTab = ({ employeeId }: Props) => {
  const { data: rows, isLoading } = useQuery({
    queryKey: ['salary-history', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_history' as any)
        .select('*, approver:approved_by ( full_name ), proposer:proposed_by ( full_name )')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-[14px] border p-6">
        <div className="bx-skeleton h-6 w-40 mb-4" />
        <div className="bx-skeleton h-32 w-full" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-card rounded-[14px] border p-12 text-center">
        <p className="text-muted-foreground text-[14px]">No salary history yet.</p>
        <p className="text-muted-foreground text-[12px] mt-1">Increments and adjustments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[14px] border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Change Type</TableHead>
            <TableHead className="text-right">Previous Salary</TableHead>
            <TableHead className="text-right">New Salary</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approved By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any) => {
            const prev = Number(row.previous_salary || 0);
            const next = Number(row.new_salary || 0);
            const delta = next - prev;
            const arrears = Number(row.arrears_amount || 0);
            return (
              <TableRow key={row.id}>
                <TableCell className="text-[13px]">{formatDate(row.created_at)}</TableCell>
                <TableCell className="text-[13px] capitalize">{row.change_type}</TableCell>
                <TableCell className="text-right font-mono-bx text-[13px]">PKR {prev.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono-bx text-[13px] font-semibold">PKR {next.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono-bx text-[13px]">
                  {delta !== 0 ? (
                    <span className={`inline-flex items-center gap-1 font-medium ${delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {delta > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      PKR {Math.abs(delta).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-[13px]">{format(parseISO(row.effective_date), 'd MMM yyyy')}</TableCell>
                <TableCell>
                  <Badge className={`capitalize border-0 ${STATUS_STYLES[row.status] || ''}`}>
                    {row.status}
                  </Badge>
                  {row.status === 'approved' && arrears > 0 && (
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Arrears: PKR {arrears.toLocaleString()} ({row.arrears_paid ? 'paid' : 'pending'})
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-[13px]">
                  {row.status === 'approved' ? (row.approver?.full_name || '—') :
                   row.status === 'rejected' ? <span className="text-muted-foreground italic">Rejected</span> :
                   <span className="text-muted-foreground">Pending</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryHistoryTab;
