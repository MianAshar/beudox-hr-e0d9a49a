import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderKanban } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(currentYear - 3 + i));

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n || 0);

const BAR_COLOR = '#5B3FF8';

interface BarRowProps {
  label: string;
  count: number;
  total: number;
  maxCount: number;
  fee: number;
}
const BarRow = ({ label, count, total, maxCount, fee }: BarRowProps) => {
  const pct = maxCount > 0 ? Math.max(6, (count / maxCount) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-40 shrink-0 truncate text-sm text-foreground">{label}</div>
      <div className="flex-1 min-w-0">
        <div className="h-6 rounded-md bg-muted relative overflow-hidden">
          <div
            className="h-full rounded-md flex items-center justify-end pr-2"
            style={{ width: `${pct}%`, backgroundColor: BAR_COLOR }}
          >
            <span className="text-[11px] font-medium text-white">{count}</span>
          </div>
        </div>
      </div>
      <div className="w-32 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        {fee > 0 ? fmtMoney(fee) : '—'}
      </div>
    </div>
  );
};

const EmptyState = ({ monthLabel }: { monthLabel: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
    <FolderKanban className="h-8 w-8 mb-2 opacity-40" />
    <p className="text-sm">No data for {monthLabel}</p>
  </div>
);

export const ProjectsSummary = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));

  const monthLabel = `${MONTHS.find(m => m.value === month)?.label} ${year}`;
  const monthStart = new Date(`${year}-${month}-01T00:00:00`);
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-summary', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_code, project_name, status, fee, sub_series, created_at, updated_at, internal_deadline, client_id, clients(id, name), lead:employees!projects_project_lead_id_fkey(id, full_name)')
        .eq('company_id', companyId!)
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const inMonth = (d?: string | null) => {
    if (!d) return false;
    const t = new Date(d);
    return t >= monthStart && t < monthEnd;
  };

  const stats = useMemo(() => {
    const list = projects ?? [];
    const newThisMonth = list.filter((p: any) => inMonth(p.created_at));
    const completedThisMonth = list.filter((p: any) => p.status === 'completed' && inMonth(p.updated_at));
    const activeThisMonth = list.filter((p: any) =>
      p.status === 'in_progress' && (inMonth(p.created_at) || new Date(p.created_at) < monthEnd)
    );
    const relevantForValue = list.filter((p: any) =>
      inMonth(p.created_at) || (p.status === 'in_progress' && new Date(p.created_at) < monthEnd)
    );
    const totalValue = relevantForValue.reduce((sum: number, p: any) => sum + (Number(p.fee) || 0), 0);
    return {
      active: activeThisMonth.length,
      completed: completedThisMonth,
      newThisMonth,
      totalValue,
    };
  }, [projects, month, year]);

  const monthProjects = useMemo(() => {
    const list = projects ?? [];
    return list.filter((p: any) =>
      inMonth(p.created_at) ||
      (p.status === 'in_progress' && new Date(p.created_at) < monthEnd) ||
      (p.status === 'completed' && inMonth(p.updated_at))
    );
  }, [projects, month, year]);

  const clientBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; count: number; fee: number }>();
    monthProjects.forEach((p: any) => {
      const name = p.clients?.name || 'No Client';
      const key = p.client_id || 'none';
      const c = map.get(key) ?? { name, count: 0, fee: 0 };
      c.count += 1;
      c.fee += Number(p.fee) || 0;
      map.set(key, c);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [monthProjects]);

  const subSeriesBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; count: number; fee: number }>();
    monthProjects.forEach((p: any) => {
      const name = (p.sub_series && String(p.sub_series).trim()) || 'Unspecified';
      const c = map.get(name) ?? { name, count: 0, fee: 0 };
      c.count += 1;
      c.fee += Number(p.fee) || 0;
      map.set(name, c);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [monthProjects]);

  const newProjectsSorted = useMemo(
    () => [...stats.newThisMonth].sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [stats.newThisMonth]
  );
  const completedSorted = useMemo(
    () => [...stats.completed].sort((a: any, b: any) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [stats.completed]
  );

  const clientsTop = clientBreakdown.slice(0, 8);
  const clientsExtra = Math.max(0, clientBreakdown.length - 8);
  const maxClientCount = clientsTop.reduce((m, c) => Math.max(m, c.count), 0);
  const subTop = subSeriesBreakdown.slice(0, 8);
  const subExtra = Math.max(0, subSeriesBreakdown.length - 8);
  const maxSubCount = subTop.reduce((m, c) => Math.max(m, c.count), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3"><Skeleton className="h-10 w-40" /><Skeleton className="h-10 w-32" /></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const StatCard = ({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) => (
    <Card
      className="p-4"
      style={accent ? { backgroundColor: '#F6F5FF', borderLeft: `3px solid ${BAR_COLOR}` } : undefined}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1 tabular-nums" style={accent ? { color: BAR_COLOR } : undefined}>{value}</p>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Month filter */}
      <div className="flex gap-3">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Section 1 — Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard label="Active Projects" value={stats.active} />
        <StatCard label="Completed This Month" value={stats.completed.length} />
        <StatCard label="New Projects This Month" value={stats.newThisMonth.length} />
        <StatCard label="Total Project Value" value={fmtMoney(stats.totalValue)} accent />
      </div>

      {/* Section 2 — By Client */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-3">By Client</h3>
        {clientsTop.length === 0 ? (
          <EmptyState monthLabel={monthLabel} />
        ) : (
          <>
            {clientsTop.map(c => (
              <BarRow key={c.name} label={c.name} count={c.count} total={c.count} maxCount={maxClientCount} fee={c.fee} />
            ))}
            {clientsExtra > 0 && (
              <p className="text-xs text-muted-foreground mt-2">+ {clientsExtra} more</p>
            )}
          </>
        )}
      </Card>

      {/* Section 3 — By Sub-Series */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-3">By Sub-Series</h3>
        {subTop.length === 0 ? (
          <EmptyState monthLabel={monthLabel} />
        ) : (
          <>
            {subTop.map(c => (
              <BarRow key={c.name} label={c.name} count={c.count} total={c.count} maxCount={maxSubCount} fee={c.fee} />
            ))}
            {subExtra > 0 && (
              <p className="text-xs text-muted-foreground mt-2">+ {subExtra} more</p>
            )}
          </>
        )}
      </Card>

      {/* Section 4 — New Projects */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-3">New Projects Added</h3>
        {newProjectsSorted.length === 0 ? (
          <EmptyState monthLabel={monthLabel} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newProjectsSorted.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.project_code}</TableCell>
                  <TableCell>
                    <Link to={`/projects/${p.id}`} className="text-foreground hover:underline">
                      {p.project_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.clients?.name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.lead?.full_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(p.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Section 5 — Completed */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-3">Completed This Month</h3>
        {completedSorted.length === 0 ? (
          <EmptyState monthLabel={monthLabel} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Completed Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedSorted.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.project_code}</TableCell>
                  <TableCell>
                    <Link to={`/projects/${p.id}`} className="text-foreground hover:underline">
                      {p.project_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.clients?.name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.lead?.full_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(p.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
