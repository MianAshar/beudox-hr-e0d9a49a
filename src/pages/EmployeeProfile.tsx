import { useParams, useNavigate } from 'react-router-dom';
import { formatRole } from '@/lib/format-role';
import EvaluationTimeline from '@/components/evaluations/EvaluationTimeline';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Pencil, Send, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const toTitleCase = (val: string | null | undefined): string => {
  if (!val) return '—';
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusVariant = (status: string | null) => {
  switch (status) {
    case 'active': return 'bg-bx-success-bg text-[hsl(var(--bx-success-text))]';
    case 'inactive': return 'bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]';
    case 'resigned': return 'bg-bx-danger-bg text-[hsl(var(--bx-danger-text))]';
    default: return '';
  }
};

const InfoField = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <p className="text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: 'var(--ff-body)' }}>{label}</p>
    <p className="text-[13px] text-foreground font-medium">{value || '—'}</p>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-[14px] border p-6">
    <h3 className="font-display font-semibold text-[15px] text-foreground mb-4" style={{ fontFamily: 'var(--ff-display)' }}>
      {title}
    </h3>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">{children}</div>
  </div>
);

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee: authEmployee } = useAuth();
  const role = authEmployee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const [resending, setResending] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const isSelfView = !isManager && authEmployee?.employee_id === id;

  const { data: emp, isLoading } = useQuery({
    queryKey: ['employee-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`*, employee_roles ( roles ( name ) )`)
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const canView = isManager || isSelfView;
  const canSeeCompensation = role === 'hr_manager' || role === 'ceo';

  const handleResendInvite = async () => {
    if (!emp?.email || !emp?.id) return;
    setResending(true);
    try {
      const { error } = await supabase.functions.invoke('invite-employee', {
        body: { email: emp.email, employee_id: emp.id },
      });
      if (error) throw error;
      toast.success(`Invite resent to ${emp.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend invite');
    } finally {
      setResending(false);
    }
  };

  const handleDeactivateReactivate = async () => {
    if (!emp?.id) return;
    const isInactive = emp.status === 'inactive';
    setDeactivating(true);
    try {
      const newStatus = isInactive ? 'active' : 'inactive';
      const { error: updateError } = await supabase
        .from('employees')
        .update({ status: newStatus })
        .eq('id', emp.id);
      if (updateError) throw updateError;
      const { error: fnError } = await supabase.functions.invoke('deactivate-employee', {
        body: { employee_id: emp.id, reactivate: isInactive },
      });
      if (fnError) throw fnError;
      toast.success(`${emp.full_name} has been ${isInactive ? 'reactivated' : 'deactivated'}`);
      queryClient.invalidateQueries({ queryKey: ['employee-profile', id] });
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isInactive ? 'reactivate' : 'deactivate'} employee`);
    } finally {
      setDeactivating(false);
    }
  };

  const handleDelete = async () => {
    if (!emp?.id) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-employee', {
        body: { employee_id: emp.id },
      });
      if (error) throw error;
      toast.success(`${emp.full_name} has been permanently deleted`);
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmName('');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bx-skeleton h-8 w-32" />
        <div className="flex items-center gap-6">
          <div className="bx-skeleton h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <div className="bx-skeleton h-6 w-48" />
            <div className="bx-skeleton h-4 w-32" />
          </div>
        </div>
        <div className="bx-skeleton h-40 w-full rounded-[14px]" />
      </div>
    );
  }

  if (!emp || !canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display font-semibold text-lg text-foreground">Employee not found</h2>
        <p className="text-muted-foreground text-[13px] mt-1">You don't have permission to view this profile.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const empRole = emp.employee_roles?.[0]?.roles?.name || null;

  // Build tabs array based on permissions
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'employment', label: 'Employment' },
    ...(canSeeCompensation ? [{ value: 'compensation', label: 'Compensation' }] : []),
    { value: 'access', label: 'Portal Access' },
    { value: 'evaluations', label: 'Evaluations' },
    ...(isManager ? [{ value: 'danger', label: 'Danger Zone' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => navigate('/employees')}>
        <ArrowLeft className="h-4 w-4" style={{ strokeWidth: 1.5 }} />
        Back to Employees
      </Button>

      {/* Profile header */}
      <div className="bg-card rounded-[14px] border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              {emp.avatar_url ? <AvatarImage src={emp.avatar_url} alt={emp.full_name} /> : null}
              <AvatarFallback
                className="text-xl font-semibold"
                style={{ background: 'hsl(var(--bx-violet-light))', color: 'hsl(var(--primary))', fontFamily: 'var(--ff-display)' }}
              >
                {getInitials(emp.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold text-[22px] text-foreground">{emp.full_name}</h2>
                <Badge variant="outline" className={`text-[11px] font-medium capitalize border-0 ${statusVariant(emp.status)}`}>
                  {emp.status || 'active'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[13px] mt-0.5" style={{ fontFamily: 'var(--ff-body)' }}>
                {emp.designation || '—'} · {emp.department || '—'}
              </p>
            </div>
          </div>

          {isManager && (
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled={!emp.email || resending}>
                    <Send className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                    Resend Invite
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Resend invite?</AlertDialogTitle>
                    <AlertDialogDescription>Resend invite to <strong>{emp.email}</strong>?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResendInvite}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm" className="gap-2" onClick={() => navigate(`/employees/${id}/edit`)}>
                <Pencil className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start" style={{ borderColor: 'hsl(var(--border))' }}>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <SectionCard title="Personal Information">
            <InfoField label="Full Name" value={emp.full_name} />
            <InfoField label="CNIC" value={emp.cnic} />
            <InfoField label="Phone" value={emp.phone} />
            <InfoField label="Date of Birth" value={emp.date_of_birth ? format(new Date(emp.date_of_birth), 'dd MMM yyyy') : null} />
            <InfoField label="Address" value={emp.address} />
          </SectionCard>
        </TabsContent>

        {/* Employment */}
        <TabsContent value="employment" className="mt-6 space-y-6">
          <SectionCard title="Employment Information">
            <InfoField label="Employee Code" value={emp.employee_code} />
            <InfoField label="Designation" value={emp.designation} />
            <InfoField label="Department" value={emp.department} />
            <InfoField label="Joining Date" value={emp.joining_date ? format(new Date(emp.joining_date), 'dd MMM yyyy') : null} />
            <InfoField label="Employment Type" value={toTitleCase(emp.employment_type)} />
            <InfoField label="Status" value={toTitleCase(emp.status)} />
            <InfoField label="Increment Rule" value={toTitleCase(emp.increment_rule)} />
          </SectionCard>
        </TabsContent>

        {/* Compensation — hr_manager / ceo only */}
        {canSeeCompensation && (
          <TabsContent value="compensation" className="mt-6 space-y-6">
            <SectionCard title="Compensation">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: 'var(--ff-body)' }}>Basic Salary</p>
                <p className="text-[15px] text-foreground font-semibold font-mono-bx">
                  {emp.basic_salary != null ? Number(emp.basic_salary).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: 'var(--ff-body)' }}>Allowance</p>
                <p className="text-[15px] text-foreground font-semibold font-mono-bx">
                  {emp.allowance != null ? Number(emp.allowance).toLocaleString() : '—'}
                </p>
              </div>
            </SectionCard>
          </TabsContent>
        )}

        {/* Portal Access */}
        <TabsContent value="access" className="mt-6 space-y-6">
          <SectionCard title="Portal Access">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: 'var(--ff-body)' }}>Login Email</p>
              <p className="text-[13px] text-foreground font-medium">{emp.email || '—'}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: 'var(--ff-body)' }}>
                Used to sign in to Beudox. Can be a personal or company email.
              </p>
            </div>
            <InfoField label="Role" value={formatRole(empRole)} />
          </SectionCard>
        </TabsContent>

        {/* Evaluations */}
        <TabsContent value="evaluations" className="mt-6">
          {authEmployee?.company_id && (
            <EvaluationTimeline employeeId={emp.id} companyId={authEmployee.company_id} />
          )}
        </TabsContent>

        {/* Danger Zone */}
        {isManager && (
          <TabsContent value="danger" className="mt-6">
            <div className="bg-card rounded-[14px] border border-destructive/20 p-6">
              <h3 className="font-display font-semibold text-[15px] text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
                Danger Zone
              </h3>
              <p className="text-muted-foreground text-[12px] mb-4" style={{ fontFamily: 'var(--ff-body)' }}>
                These actions affect the employee's access and data.
              </p>
              <div className="flex items-center gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2" disabled={deactivating}>
                      {emp.status === 'inactive'
                        ? <ShieldCheck className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                        : <ShieldOff className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />}
                      {emp.status === 'inactive' ? 'Reactivate' : 'Deactivate'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {emp.status === 'inactive' ? 'Reactivate' : 'Deactivate'} {emp.full_name}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {emp.status === 'inactive'
                          ? `${emp.full_name} will regain access to the portal and can log in again.`
                          : `${emp.full_name} will lose access to the portal immediately. Their data will be retained and they can be reactivated later.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeactivateReactivate}>
                        {emp.status === 'inactive' ? 'Reactivate' : 'Deactivate'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setDeleteConfirmName(''); }}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2" disabled={deleting}>
                      <Trash2 className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Permanently delete {emp.full_name}?</DialogTitle>
                      <DialogDescription>
                        This will delete all their data including attendance, payroll records, and evaluations. This cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                      <p className="text-[13px] text-foreground mb-2" style={{ fontFamily: 'var(--ff-body)' }}>
                        Type <strong>{emp.full_name}</strong> to confirm:
                      </p>
                      <Input value={deleteConfirmName} onChange={(e) => setDeleteConfirmName(e.target.value)} placeholder={emp.full_name} />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" disabled={deleteConfirmName !== emp.full_name || deleting} onClick={handleDelete}>
                        {deleting ? 'Deleting…' : 'Delete permanently'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
