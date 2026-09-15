import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderKanban, Users } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
        .select('id, project_code, project_name, status, fee, created_at, updated_at, internal_deadline, client_id, clients(id, name), lead:employees!projects_project_lead_id_fkey(id, full_name)')
        .eq('company_id', companyId!)
        .eq('is_active', true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: allEmployees } = useQuery({
    queryKey: ['summary-employees', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, avatar_url, designation, department, employment_type')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: incompleteTasks } = useQuery({
    queryKey: ['summary-incomplete-tasks', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_tasks')
        .select('id, assigned_to, project_id, title, complexity, status, projects!project_tasks_project_id_fkey(id, project_code, project_name)')
        .eq('company_id', companyId!)
        .eq('is_completed', false)
        .not('assigned_to', 'is', null);
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

  const completedSorted = useMemo(
    () => [...stats.completed].sort((a: any, b: any) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [stats.completed]
  );

  const utilisation = useMemo(() => {
    // Exclude CEO, directors, outsourced
    const workforce = (allEmployees || []).filter((e: any) =>
      e.employment_type !== 'director' && e.employment_type !== 'outsourced'
    );

    // Group incomplete tasks by assignee
    const tasksByEmployee = new Map<string, any[]>();
    for (const t of (incompleteTasks || [])) {
      if (!t.assigned_to) continue;
      if (!tasksByEmployee.has(t.assigned_to)) tasksByEmployee.set(t.assigned_to, []);
      tasksByEmployee.get(t.assigned_to)!.push(t);
    }

    const occupied: any[] = [];
    const free: any[] = [];

    for (const emp of workforce) {
      const tasks = tasksByEmployee.get(emp.id) || [];
      // Unique projects from their incomplete tasks
      const projectIds = [...new Set(tasks.map((t: any) => t.project_id))];
      const projectsOnTask = projectIds.map(pid => {
        const t = tasks.find((t: any) => t.project_id === pid);
        return t?.projects;
      }).filter(Boolean);

      if (tasks.length > 0) {
        occupied.push({ ...emp, taskCount: tasks.length, projects: projectsOnTask });
      } else {
        free.push({ ...emp });
      }
    }

    // Sort occupied by taskCount desc
    occupied.sort((a, b) => b.taskCount - a.taskCount);

    return { occupied, free, total: workforce.length };
  }, [allEmployees, incompleteTasks]);

  const clientsTop = clientBreakdown.slice(0, 8);
  const clientsExtra = Math.max(0, clientBreakdown.length - 8);
  const maxClientCount = clientsTop.reduce((m, c) => Math.max(m, c.count), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3"><Skeleton className="h-10 w-40" /><Skeleton className="h-10 w-32" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-24" />)}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="Active Projects" value={stats.active} />
        <StatCard label="Completed This Month" value={stats.completed.length} />
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

      {/* Section 3 — Completed */}
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

      {/* Section 4 — Resource Utilisation */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Resource Utilisation</h3>
          <span className="ml-auto text-xs text-muted-foreground">{utilisation.total} active employees</span>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 mb-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-sm font-semibold text-amber-700">{utilisation.occupied.length}</span>
            <span className="text-xs text-amber-600">Occupied</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
            <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-sm font-semibold text-green-700">{utilisation.free.length}</span>
            <span className="text-xs text-green-600">Free</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupied */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Occupied ({utilisation.occupied.length})
            </p>
            {utilisation.occupied.length === 0 ? (
              <p className="text-sm text-muted-foreground">No one has pending tasks</p>
            ) : (
              <div className="space-y-3">
                {utilisation.occupied.map((emp: any) => (
                  <div key={emp.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarImage src={emp.avatar_url || ''} />
                      <AvatarFallback className="text-[10px]">{getInitials(emp.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{emp.full_name}</p>
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                          {emp.taskCount} task{emp.taskCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {emp.designation && (
                        <p className="text-[11px] text-muted-foreground">{emp.designation}</p>
                      )}
                      {emp.projects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {emp.projects.map((p: any) => (
                            <span
                              key={p.id}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EBE6FF] text-[#5B3FF8]"
                            >
                              {p.project_code}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Free */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Free ({utilisation.free.length})
            </p>
            {utilisation.free.length === 0 ? (
              <p className="text-sm text-muted-foreground">Everyone has pending tasks</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {utilisation.free.map((emp: any) => (
                  <div key={emp.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={emp.avatar_url || ''} />
                      <AvatarFallback className="text-[9px]">{getInitials(emp.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{emp.full_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
