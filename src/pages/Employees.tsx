import { useState } from 'react';
import { formatRole } from '@/lib/format-role';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SortableHeader } from '@/components/ui/sortable-header';
import { useSort } from '@/hooks/useSort';
import { Search, Plus, Users, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { canManageEmployee } from '@/lib/role-hierarchy';
import { toast } from 'sonner';

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
  const roles = employee?.roles ?? [];
  const canAdd = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const isCeo = roles.includes('ceo');
  const isManager = isCeo || roles.includes('hr_manager');
  const queryClient = useQueryClient();

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees-list', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id, full_name, designation, department, employee_code,
          joining_date, status, avatar_url, employment_type,
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

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-employee', {
        body: { employee_id: deleteTarget.id },
      });
      if (error) throw error;
      toast.success('Employee permanently deleted.');
      setDeleteTarget(null);
      setDeleteConfirmText('');
      queryClient.invalidateQueries({ queryKey: ['employees-list', companyId] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

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

  const { sorted, sort, toggleSort } = useSort(filtered, {
    name: (r: any) => r.full_name,
    code: (r: any) => r.employee_code,
    department: (r: any) => r.department,
    joining_date: (r: any) => r.joining_date,
    role: (r: any) => getRoleName(r),
    status: (r: any) => r.status,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p
            className="text-muted-foreground text-[13px]"
            style={{ fontFamily: 'var(--ff-body)' }}
          >
            Manage your team members and their information
          </p>
        </div>
        {canAdd && (
          <Button onClick={() => navigate('/employees/new')} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-sm">
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
        <div className="flex gap-3">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="flex-1 sm:w-[160px]">
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
          <SelectTrigger className="flex-1 sm:w-[140px]">
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
          <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader column="name" sort={sort} onSort={toggleSort}>Employee</SortableHeader>
                <SortableHeader column="code" sort={sort} onSort={toggleSort} className="hidden md:table-cell">Employee Code</SortableHeader>
                <SortableHeader column="department" sort={sort} onSort={toggleSort} className="hidden md:table-cell">Department</SortableHeader>
                <SortableHeader column="joining_date" sort={sort} onSort={toggleSort} className="hidden lg:table-cell">Joining Date</SortableHeader>
                <SortableHeader column="role" sort={sort} onSort={toggleSort} className="hidden lg:table-cell">Role</SortableHeader>
                <SortableHeader column="status" sort={sort} onSort={toggleSort}>Status</SortableHeader>
                {isManager && <TableHead className="w-[80px] text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((emp) => {
                const roleName = getRoleName(emp);
                const isSelf = employee?.employee_id === emp.id;
                const canDelete = canManageEmployee(roles, emp) && !(isSelf && !isCeo);
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
                    <TableCell className="hidden md:table-cell">
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
                    <TableCell className="hidden md:table-cell">
                      <span className="text-[13px]">{emp.department || '—'}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-[13px]">
                        {emp.joining_date
                          ? formatDate(emp.joining_date)
                          : '—'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-[13px]">
                        {formatRole(roleName)}
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
                    {isManager && (
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {canDelete ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setDeleteTarget(emp);
                              setDeleteConfirmText('');
                            }}
                            aria-label={`Delete ${emp.full_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
