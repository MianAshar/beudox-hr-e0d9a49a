import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, FolderKanban } from 'lucide-react';

const statusColors: Record<string, string> = {
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  invoiced: 'bg-purple-100 text-purple-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const Projects = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', companyId, role],
    queryFn: async () => {
      if (isManager) {
        const { data, error } = await supabase
          .from('projects')
          .select('*, clients(name), project_categories(name), lead:employees!projects_project_lead_id_fkey(full_name)')
          .eq('company_id', companyId!)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        // Employee: only assigned + in_progress
        const { data: assignments, error: aErr } = await supabase
          .from('project_assignments')
          .select('project_id')
          .eq('company_id', companyId!)
          .eq('employee_id', employee?.employee_id!)
          .eq('is_active', true);
        if (aErr) throw aErr;
        const pIds = assignments?.map(a => a.project_id) || [];
        if (pIds.length === 0) return [];
        const { data, error } = await supabase
          .from('projects')
          .select('*, clients(name), project_categories(name), lead:employees!projects_project_lead_id_fkey(full_name)')
          .eq('company_id', companyId!)
          .eq('status', 'in_progress')
          .in('id', pIds)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
    },
    enabled: !!companyId && !!employee,
  });

  // Fetch clients for filter dropdown
  const { data: clients } = useQuery({
    queryKey: ['clients-filter', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId && isManager,
  });

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const filtered = (projects ?? []).filter((p: any) => {
    if (search && !p.project_code.toLowerCase().includes(search.toLowerCase()) && !p.project_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
    if (clientFilter !== 'all' && p.client_id !== clientFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects ? `${projects.length} project${projects.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => navigate('/projects/new')}>
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search code or name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {isManager && (
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {['in_progress', 'completed', 'invoiced', 'on_hold', 'cancelled'].map(s => (
                  <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {['high', 'medium', 'low'].map(p => (
                  <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients && clients.length > 0 && (
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Client" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">{search || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'}</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Internal Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                  <TableCell className="font-mono text-sm">{p.project_code}</TableCell>
                  <TableCell className="font-medium">{p.project_name}</TableCell>
                  <TableCell>{p.clients?.name || '—'}</TableCell>
                  <TableCell>{p.project_categories?.name || '—'}</TableCell>
                  <TableCell>{p.lead?.full_name || '—'}</TableCell>
                  <TableCell>{p.internal_deadline || '—'}</TableCell>
                  <TableCell>
                    {p.priority && <Badge className={priorityColors[p.priority] || ''}>{fmt(p.priority)}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[p.status] || ''}>{fmt(p.status)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Projects;
