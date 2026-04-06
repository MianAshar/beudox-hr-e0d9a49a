import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const formatRole = (role: string) =>
  role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
        .select('id, full_name, designation, avatar_url, employee_roles(role_id, roles(name))')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const [changingId, setChangingId] = useState<string | null>(null);

  const handleRoleChange = async (employeeId: string, employeeName: string, newRoleId: string) => {
    setChangingId(employeeId);
    try {
      await supabase.from('employee_roles').delete().eq('employee_id', employeeId);
      const { error } = await supabase.from('employee_roles').insert({
        employee_id: employeeId,
        role_id: newRoleId,
      });
      if (error) throw error;
      toast.success(`Role updated for ${employeeName}`);
      qc.invalidateQueries({ queryKey: ['employees-with-roles'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setChangingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-[400px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-[14px] border overflow-hidden" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <div className="p-6 pb-3">
          <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
            Role Assignments
          </h3>
          <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
            View and change employee roles. CEO role cannot be reassigned.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map(emp => {
              const currentRole = (emp.employee_roles as any)?.[0]?.roles?.name;
              const currentRoleId = (emp.employee_roles as any)?.[0]?.role_id;
              const isSelf = emp.id === authEmployee?.employee_id;
              const isCeoRow = currentRole === 'ceo';

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
                    <Badge variant="secondary" className="text-[12px]">
                      {currentRole ? formatRole(currentRole) : 'No Role'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isCeoRow ? (
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
                        <Lock className="h-3.5 w-3.5" />
                        Read-only
                      </div>
                    ) : changingId === emp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Select
                        value={currentRoleId || ''}
                        onValueChange={v => handleRoleChange(emp.id, emp.full_name, v)}
                      >
                        <SelectTrigger className="h-8 w-[180px] text-[12px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.filter(r => r.name !== 'ceo').map(r => (
                            <SelectItem key={r.id} value={r.id} className="text-[12px]">
                              {formatRole(r.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
