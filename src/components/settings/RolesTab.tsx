import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Loader2, Plus, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRole } from '@/lib/format-role';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const RolesTab = () => {
  const { employee: authEmployee } = useAuth();
  const qc = useQueryClient();
  const companyId = authEmployee?.company_id;

  const { data: roles } = useQuery({
    queryKey: ['company-roles', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .eq('company_id', companyId!)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees-with-roles', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, designation, avatar_url, employee_roles(role_id, roles(id, name))')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const [busyEmployeeId, setBusyEmployeeId] = useState<string | null>(null);

  const addRole = async (employeeId: string, employeeName: string, roleId: string) => {
    setBusyEmployeeId(employeeId);
    try {
      const { error } = await supabase
        .from('employee_roles')
        .insert({ employee_id: employeeId, role_id: roleId });
      if (error) throw error;
      toast.success(`Role added for ${employeeName}`);
      qc.invalidateQueries({ queryKey: ['employees-with-roles'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add role');
    } finally {
      setBusyEmployeeId(null);
    }
  };

  const removeRole = async (employeeId: string, employeeName: string, roleId: string, isLast: boolean) => {
    if (isLast) {
      toast.error('Employee must have at least one role');
      return;
    }
    setBusyEmployeeId(employeeId);
    try {
      const { error } = await supabase
        .from('employee_roles')
        .delete()
        .eq('employee_id', employeeId)
        .eq('role_id', roleId);
      if (error) throw error;
      toast.success(`Role removed for ${employeeName}`);
      qc.invalidateQueries({ queryKey: ['employees-with-roles'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove role');
    } finally {
      setBusyEmployeeId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border overflow-hidden" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <div className="p-6 pb-3">
          <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
            Role Assignments
          </h3>
          <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            Each employee can hold one or more roles. CEO role cannot be reassigned.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Current Roles</TableHead>
              <TableHead className="w-[160px]">Add Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map(emp => {
              const empRoles = ((emp.employee_roles as any) ?? [])
                .map((er: any) => ({ id: er.roles?.id, name: er.roles?.name }))
                .filter((r: any) => r.id);
              const empRoleIds = new Set(empRoles.map((r: any) => r.id));
              const isCeoRow = empRoles.some((r: any) => r.name === 'ceo');
              const availableToAdd = (roles ?? []).filter(
                r => r.name !== 'ceo' && !empRoleIds.has(r.id)
              );

              return (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {emp.avatar_url && <AvatarImage src={emp.avatar_url} />}
                        <AvatarFallback className="text-xs" style={{ background: 'hsl(var(--bx-violet-light))', color: 'hsl(var(--primary))', fontFamily: 'var(--ff-display)' }}>
                          {getInitials(emp.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[13px] font-medium text-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{emp.full_name}</p>
                        {emp.designation && (
                          <p className="text-[11px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>{emp.designation}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {empRoles.length === 0 && (
                        <span className="text-[12px] text-muted-foreground">No Role</span>
                      )}
                      {empRoles.map((r: any) => {
                        const locked = r.name === 'ceo';
                        return (
                          <Badge
                            key={r.id}
                            variant="secondary"
                            className="text-[12px] gap-1 pl-2 pr-1.5 py-0.5"
                          >
                            {formatRole(r.name)}
                            {locked ? (
                              <Lock className="h-3 w-3 ml-0.5 opacity-60" />
                            ) : (
                              <button
                                type="button"
                                aria-label={`Remove ${formatRole(r.name)}`}
                                onClick={() => removeRole(emp.id, emp.full_name, r.id, empRoles.length === 1)}
                                disabled={busyEmployeeId === emp.id}
                                className="ml-0.5 rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-50"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isCeoRow ? (
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
                        <Lock className="h-3.5 w-3.5" />
                        Read-only
                      </div>
                    ) : busyEmployeeId === emp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : availableToAdd.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">All assigned</span>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-[12px]">
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add role
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[200px] p-1.5">
                          <div className="space-y-0.5">
                            {availableToAdd.map(r => (
                              <button
                                key={r.id}
                                onClick={() => addRole(emp.id, emp.full_name, r.id)}
                                className="w-full text-left px-2 py-1.5 rounded text-[12px] hover:bg-accent transition-colors"
                              >
                                {formatRole(r.name)}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RolesTab;
