import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { AlertTriangle, ChevronLeft, ChevronRight, Download, Monitor, Smartphone, Tablet, Globe, Users, MapPin, LogIn } from 'lucide-react';

const PAGE_SIZE = 50;

interface LoginLogRow {
  id: string;
  employee_id: string | null;
  logged_in_at: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  ip_address: string | null;
  employees: { full_name: string; avatar_url: string | null; designation: string | null } | null;
}

const DeviceIcon = ({ type }: { type: string | null }) => {
  if (type === 'Mobile') return <Smartphone className="h-3.5 w-3.5" />;
  if (type === 'Tablet') return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
};

const LoginLogsTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [page, setPage] = useState(0);

  // Active employees for filter dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ['employees-for-login-logs', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, avatar_url, designation')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      return data ?? [];
    },
    enabled: !!companyId,
  });

  // Distinct countries from this company's login_logs
  const { data: countries = [] } = useQuery({
    queryKey: ['login-log-countries', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('login_logs')
        .select('country')
        .eq('company_id', companyId!)
        .not('country', 'is', null);
      const set = new Set<string>();
      (data ?? []).forEach(r => { if (r.country) set.add(r.country); });
      return Array.from(set).sort();
    },
    enabled: !!companyId,
  });

  // Main login logs query (filtered + paginated)
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['login-logs', companyId, employeeFilter, deviceFilter, countryFilter, fromDate, toDate, page],
    queryFn: async () => {
      let q = supabase
        .from('login_logs')
        .select('id, employee_id, logged_in_at, device_type, browser, os, city, region, country, ip_address, employees!login_logs_employee_id_fkey(full_name, avatar_url, designation)', { count: 'exact' })
        .eq('company_id', companyId!)
        .order('logged_in_at', { ascending: false });

      if (employeeFilter !== 'all') q = q.eq('employee_id', employeeFilter);
      if (deviceFilter !== 'all') q = q.eq('device_type', deviceFilter);
      if (countryFilter !== 'all') q = q.eq('country', countryFilter);
      if (fromDate) q = q.gte('logged_in_at', `${fromDate}T00:00:00`);
      if (toDate) q = q.lte('logged_in_at', `${toDate}T23:59:59`);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count } = await q.range(from, to);
      return { rows: (data ?? []) as unknown as LoginLogRow[], total: count ?? 0 };
    },
    enabled: !!companyId,
  });

  // Per-employee most-frequent country (used for "unusual location" flag)
  const { data: employeeFrequentCountry = {} } = useQuery({
    queryKey: ['login-frequent-country', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('login_logs')
        .select('employee_id, country')
        .eq('company_id', companyId!)
        .not('country', 'is', null)
        .not('employee_id', 'is', null);
      const counts: Record<string, Record<string, number>> = {};
      (data ?? []).forEach(r => {
        if (!r.employee_id || !r.country) return;
        counts[r.employee_id] ??= {};
        counts[r.employee_id][r.country] = (counts[r.employee_id][r.country] ?? 0) + 1;
      });
      const top: Record<string, string> = {};
      Object.entries(counts).forEach(([emp, c]) => {
        const sorted = Object.entries(c).sort((a, b) => b[1] - a[1]);
        if (sorted[0]) top[emp] = sorted[0][0];
      });
      return top;
    },
    enabled: !!companyId,
  });

  // Summary cards data — this calendar month
  const monthStart = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  }, []);

  const { data: summary } = useQuery({
    queryKey: ['login-logs-summary', companyId, monthStart],
    queryFn: async () => {
      const { data } = await supabase
        .from('login_logs')
        .select('employee_id, device_type, country')
        .eq('company_id', companyId!)
        .gte('logged_in_at', monthStart);
      const rows = data ?? [];
      const uniqueEmps = new Set(rows.map(r => r.employee_id).filter(Boolean));
      const deviceCounts: Record<string, number> = {};
      rows.forEach(r => {
        if (r.device_type) deviceCounts[r.device_type] = (deviceCounts[r.device_type] ?? 0) + 1;
      });
      const mostActive = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
      return {
        totalLogins: rows.length,
        uniqueEmployees: uniqueEmps.size,
        mostActiveDevice: mostActive,
      };
    },
    enabled: !!companyId,
  });

  const isUnusual = (row: LoginLogRow) => {
    if (!row.employee_id || !row.country) return false;
    const freq = employeeFrequentCountry[row.employee_id];
    return !!freq && freq !== row.country;
  };

  const flaggedThisMonth = useMemo(() => {
    if (!logsData) return 0;
    return logsData.rows.filter(r => {
      if (!r.logged_in_at) return false;
      return new Date(r.logged_in_at) >= new Date(monthStart) && isUnusual(r);
    }).length;
  }, [logsData, employeeFrequentCountry, monthStart]);

  const exportCsv = () => {
    if (!logsData) return;
    const header = ['Employee', 'Date & Time', 'Device', 'Browser', 'OS', 'Location', 'IP Address', 'Unusual Location'];
    const rows = logsData.rows.map(r => [
      r.employees?.full_name ?? '—',
      r.logged_in_at ? format(new Date(r.logged_in_at), 'yyyy-MM-dd HH:mm') : '',
      r.device_type ?? '',
      r.browser ?? '',
      r.os ?? '',
      [r.city, r.country].filter(Boolean).join(', '),
      r.ip_address ?? '',
      isUnusual(r) ? 'Yes' : 'No',
    ]);
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login-logs-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil((logsData?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <SummaryCard icon={<LogIn className="h-4 w-4" />} label="Total Logins This Month" value={summary?.totalLogins ?? '—'} />
        <SummaryCard icon={<Users className="h-4 w-4" />} label="Unique Employees" value={summary?.uniqueEmployees ?? '—'} />
        <SummaryCard icon={<MapPin className="h-4 w-4" />} label="Logins from New Locations" value={flaggedThisMonth} />
        <SummaryCard icon={<Globe className="h-4 w-4" />} label="Most Active Device" value={summary?.mostActiveDevice ?? '—'} />
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4 space-y-3" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Employee</Label>
            <SearchableEmployeeSelect
              employees={employees}
              value={employeeFilter}
              onValueChange={(v) => { setEmployeeFilter(v || 'all'); setPage(0); }}
              allowAll
              allLabel="All Employees"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
            <Input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(0); }} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
            <Input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(0); }} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Device</Label>
            <Select value={deviceFilter} onValueChange={(v) => { setDeviceFilter(v); setPage(0); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Country</Label>
            <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v); setPage(0); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!logsData?.rows?.length}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium">Employee</th>
                <th className="text-left px-4 py-2.5 font-medium">Date & Time</th>
                <th className="text-left px-4 py-2.5 font-medium">Device</th>
                <th className="text-left px-4 py-2.5 font-medium">Browser</th>
                <th className="text-left px-4 py-2.5 font-medium">OS</th>
                <th className="text-left px-4 py-2.5 font-medium">Location</th>
                <th className="text-left px-4 py-2.5 font-medium">IP Address</th>
                <th className="text-left px-4 py-2.5 font-medium w-10">Flag</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                    <td colSpan={8} className="px-4 py-2.5"><Skeleton className="h-5 w-full" /></td>
                  </tr>
                ))
              ) : !logsData?.rows.length ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">No login logs found.</td></tr>
              ) : logsData.rows.map(r => {
                const unusual = isUnusual(r);
                return (
                  <tr key={r.id} className="border-t hover:bg-muted/30" style={{ borderColor: 'hsl(var(--border))' }}>
                    <td className="px-4 py-2.5 text-foreground">{r.employees?.full_name ?? '—'}</td>
                    <td className="px-4 py-2.5 text-foreground">{r.logged_in_at ? format(new Date(r.logged_in_at), 'MMM d, yyyy HH:mm') : '—'}</td>
                    <td className="px-4 py-2.5 text-foreground">
                      <span className="inline-flex items-center gap-1.5"><DeviceIcon type={r.device_type} />{r.device_type ?? '—'}</span>
                    </td>
                    <td className="px-4 py-2.5 text-foreground">{r.browser ?? '—'}</td>
                    <td className="px-4 py-2.5 text-foreground">{r.os ?? '—'}</td>
                    <td className="px-4 py-2.5 text-foreground">{[r.city, r.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{r.ip_address ?? '—'}</td>
                    <td className="px-4 py-2.5">
                      {unusual && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>Login from unusual location</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logsData && logsData.total > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground" style={{ borderColor: 'hsl(var(--border))' }}>
            <span>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, logsData.total)} of {logsData.total}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span>Page {page + 1} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="rounded-lg border bg-card p-4" style={{ borderColor: 'hsl(var(--border))' }}>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
      {icon}<span>{label}</span>
    </div>
    <div className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>{value}</div>
  </div>
);

export default LoginLogsTab;
