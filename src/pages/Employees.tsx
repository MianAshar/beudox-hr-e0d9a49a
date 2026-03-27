import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Users } from 'lucide-react';
import { format } from 'date-fns';

const DEPARTMENTS = ['GC Team', 'MEP Team', 'Admin', 'Director'];
const STATUS_OPTIONS = ['active', 'inactive', 'resigned'];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatRoleName = (role: string | null | undefined): string => {
  if (!role) return '—';
  const map: Record<string, string> = {
    ceo: 'CEO',
    hr_manager: 'HR Manager',
    finance_manager: 'Finance Manager',
    team_lead: 'Team Lead',
    employee: 'Employee',
  };
  return map[role] || role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusVariant = (status: string | null) => {
  switch (status) {
    case 'active':
      return 'bg-bx-success-bg text-[hsl(var(--bx-success-text))]';
    case 'inactive':
      return 'bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]';
    case 'resigned':
      return 'bg-bx-danger-bg text-[hsl(var(--bx-danger-text))]';
    default:
      return '';
  }
};

const Employees = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const canAdd = role === 'hr_manager' || role === 'ceo';

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees-list', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id, full_name, designation, department, employee_code,
          joining_date, status, avatar_url,
          employee_roles (
            roles ( name )
          )
        `)
        .eq('company_id', companyId!)
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const filtered = (employees || []).filter((emp) => {
    const matchesSearch =
      !search ||
      emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.employee_code || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getRoleName = (emp: any) => {
    const er = emp.employee_roles;
    if (er && er.length > 0 && er[0].roles) {
      return er[0].roles.name;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-muted-foreground text-[13px]"
            style={{ fontFamily: 'var(--ff-body)' }}
          >
            Manage your team members and their information
          </p>
        </div>
        {canAdd && (
          <Button onClick={() => navigate('/employees/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            style={{ strokeWidth: 1.5 }}
          />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-[14px] border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bx-skeleton h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="bx-skeleton h-4 w-48" />
                  <div className="bx-skeleton h-3 w-32" />
                </div>
                <div className="bx-skeleton h-4 w-20" />
                <div className="bx-skeleton h-4 w-24" />
                <div className="bx-skeleton h-4 w-20" />
                <div className="bx-skeleton h-4 w-16" />
                <div className="bx-skeleton h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'hsl(var(--bx-violet-light))' }}
            >
              <Users className="h-8 w-8 text-primary" style={{ strokeWidth: 1.5 }} />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              No employees found
            </h3>
            <p
              className="text-muted-foreground text-[13px] mt-1 max-w-sm"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {search || deptFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Add your first employee to get started.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => {
                const roleName = getRoleName(emp);
                return (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {emp.avatar_url ? (
                            <AvatarImage src={emp.avatar_url} alt={emp.full_name} />
                          ) : null}
                          <AvatarFallback
                            className="text-xs font-medium"
                            style={{
                              background: 'hsl(var(--bx-violet-light))',
                              color: 'hsl(var(--primary))',
                              fontFamily: 'var(--ff-display)',
                            }}
                          >
                            {getInitials(emp.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[13px] text-foreground">
                            {emp.full_name}
                          </p>
                          <p
                            className="text-[11px] text-muted-foreground"
                            style={{ fontFamily: 'var(--ff-body)' }}
                          >
                            {emp.designation || '—'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {emp.employee_code ? (
                        <span
                          className="font-mono-bx text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: 'hsl(var(--bx-violet-light))',
                            color: 'hsl(var(--bx-violet-dark))',
                          }}
                        >
                          {emp.employee_code}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px]">{emp.department || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px]">
                        {emp.joining_date
                          ? format(new Date(emp.joining_date), 'dd MMM yyyy')
                          : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px]">
                        {formatRoleName(roleName)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium capitalize border-0 ${statusVariant(
                          emp.status
                        )}`}
                      >
                        {emp.status || 'active'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Employees;
