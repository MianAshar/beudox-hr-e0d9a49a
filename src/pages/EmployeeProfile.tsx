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
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Pencil, Trash2, Lock, AlertTriangle, UserX, UserCheck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';
import { useState } from 'react';
import { canManageEmployee, canViewCompensation, isProtectedFromHr } from '@/lib/role-hierarchy';
import AttendanceTab from '@/components/employee-profile/AttendanceTab';
import LeaveTab from '@/components/employee-profile/LeaveTab';
import PayrollTab from '@/components/employee-profile/PayrollTab';
import DocumentsTab from '@/components/employee-profile/DocumentsTab';
import SalaryReviewTab from '@/components/employee-profile/SalaryReviewTab';

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
  const roles = authEmployee?.roles ?? [];
  const isHrOrCeo = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const isFinanceOrCeo = ['finance_manager', 'ceo'].some(r => roles.includes(r));
  const isManager = isHrOrCeo;
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactReason, setDeactReason] = useState<'resigned' | 'fired' | 'other'>('resigned');
  const [deactCustom, setDeactCustom] = useState('');
  const [deactivating, setDeactivating] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [reactReason, setReactReason] = useState('');
  const [reactivating, setReactivating] = useState(false);
  const queryClient = useQueryClient();
  const isCeo = roles.includes('ceo');

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
  const canManage = isManager && canManageEmployee(roles, emp);
  const canSeeCompensation = canViewCompensation(roles, emp);
  const isHrBlocked = isManager && !canManage && isProtectedFromHr(emp);

  const handleDelete = async () => {
    if (!emp?.id) return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-employee', {
        body: { employee_id: emp.id },
      });
      if (error) throw error;
      toast.success('Employee permanently deleted.');
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmText('');
      setDeleteStep(1);
    }
  };

  const handleDeactivate = async () => {
    if (!emp?.id) return;
    if (deactReason === 'other' && !deactCustom.trim()) {
      toast.error('Please provide a reason.');
      return;
    }
    setDeactivating(true);
    try {
      const { data, error } = await supabase.functions.invoke('deactivate-employee', {
        body: {
          employee_id: emp.id,
          reason: deactReason,
          custom_reason: deactReason === 'other' ? deactCustom.trim() : undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('Employee deactivated. They can no longer sign in.');
      setDeactivateOpen(false);
      setDeactReason('resigned');
      setDeactCustom('');
      queryClient.invalidateQueries({ queryKey: ['employee-profile', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to deactivate employee');
    } finally {
      setDeactivating(false);
    }
  };

  const handleReactivate = async () => {
    if (!emp?.id) return;
    if (!reactReason.trim()) {
      toast.error('Please provide a reason for reactivation.');
      return;
    }
    setReactivating(true);
    try {
      const { data, error } = await supabase.functions.invoke('reactivate-employee', {
        body: { employee_id: emp.id, reason: reactReason.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('Employee reactivated. They can sign in again.');
      setReactivateOpen(false);
      setReactReason('');
      queryClient.invalidateQueries({ queryKey: ['employee-profile', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to reactivate employee');
    } finally {
      setReactivating(false);
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
    ...(isHrOrCeo ? [{ value: 'attendance', label: 'Attendance' }] : []),
    ...(isHrOrCeo ? [{ value: 'leave', label: 'Leave' }] : []),
    ...(isFinanceOrCeo && canSeeCompensation ? [{ value: 'payroll', label: 'Payroll' }] : []),
    ...(isHrOrCeo ? [{ value: 'evaluations', label: 'Evaluations' }] : []),
    ...(isCeo && canSeeCompensation ? [{ value: 'salary-review', label: 'Salary Review' }] : []),
    ...(isHrOrCeo ? [{ value: 'documents', label: 'Documents' }] : []),
    ...(canManage ? [{ value: 'danger', label: 'Danger Zone' }] : []),
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

          {canManage && (
            <div className="flex items-center gap-2">
              <Button size="sm" className="gap-2" onClick={() => navigate(`/employees/${id}/edit`)}>
                <Pencil className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                Edit
              </Button>
            </div>
          )}
          {isHrBlocked && (
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
              <Lock className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
              Contact the CEO to make changes to this profile.
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
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview — combined personal, employment, compensation & portal access */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <SectionCard title="Personal Information">
            <InfoField label="Full Name" value={emp.full_name} />
            <InfoField label="CNIC" value={emp.cnic} />
            <InfoField label="Phone" value={emp.phone} />
            <InfoField label="Date of Birth" value={emp.date_of_birth ? formatDate(emp.date_of_birth) : null} />
            <InfoField label="Address" value={emp.address} />
          </SectionCard>

          <SectionCard title="Employment Information">
            <InfoField label="Employee Code" value={emp.employee_code} />
            <InfoField label="Designation" value={emp.designation} />
            <InfoField label="Department" value={emp.department} />
            <InfoField label="Joining Date" value={emp.joining_date ? formatDate(emp.joining_date) : null} />
            <InfoField label="Employment Type" value={toTitleCase(emp.employment_type)} />
            <InfoField label="Status" value={toTitleCase(emp.status)} />
          </SectionCard>

          {canSeeCompensation && (
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
          )}

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

        {/* Attendance — HR / CEO only */}
        {isHrOrCeo && (
          <TabsContent value="attendance" className="mt-6">
            <AttendanceTab employeeId={emp.id} />
          </TabsContent>
        )}

        {/* Leave — HR / CEO only */}
        {isHrOrCeo && (
          <TabsContent value="leave" className="mt-6">
            <LeaveTab employeeId={emp.id} />
          </TabsContent>
        )}

        {/* Payroll — Finance Manager / CEO only, respecting compensation visibility */}
        {isFinanceOrCeo && canSeeCompensation && (
          <TabsContent value="payroll" className="mt-6">
            <PayrollTab employeeId={emp.id} />
          </TabsContent>
        )}

        {/* Evaluations — HR / CEO only */}
        {isHrOrCeo && (
          <TabsContent value="evaluations" className="mt-6">
            {authEmployee?.company_id && (
              <EvaluationTimeline employeeId={emp.id} companyId={authEmployee.company_id} />
            )}
          </TabsContent>
        )}

        {isCeo && canSeeCompensation && authEmployee?.employee_id && (
          <TabsContent value="salary-review" className="mt-6">
            <SalaryReviewTab
              employee={{
                id: emp.id,
                full_name: emp.full_name,
                company_id: emp.company_id,
                basic_salary: emp.basic_salary,
                allowance: emp.allowance,
                first_review_date: emp.first_review_date,
                review_frequency_months: emp.review_frequency_months,
              }}
              canEdit={isCeo}
              isCeo={isCeo}
              authEmployeeId={authEmployee.employee_id}
            />
          </TabsContent>
        )}

        {/* Documents — HR / CEO only (placeholder) */}
        {isHrOrCeo && (
          <TabsContent value="documents" className="mt-6">
            <DocumentsTab />
          </TabsContent>
        )}

        {/* Danger Zone */}
        {canManage && (
          <TabsContent value="danger" className="mt-6">
            <div className="bg-card rounded-[14px] border border-destructive/20 p-6">
              <h3 className="font-display font-semibold text-[15px] text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
                Danger Zone
              </h3>
              <p className="text-muted-foreground text-[12px] mb-4" style={{ fontFamily: 'var(--ff-body)' }}>
                These actions affect the employee's access and data.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {emp.status === 'inactive' ? (
                  <Dialog open={reactivateOpen} onOpenChange={(open) => { setReactivateOpen(open); if (!open) setReactReason(''); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2" disabled={reactivating}>
                        <UserCheck className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                        Reactivate Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reactivate {emp.full_name}?</DialogTitle>
                        <DialogDescription>
                          The employee will regain access to the portal and receive an email notification.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-2">
                        <Label htmlFor="react-reason" className="text-[13px]">Reason for reactivation</Label>
                        <Textarea
                          id="react-reason"
                          value={reactReason}
                          onChange={(e) => setReactReason(e.target.value)}
                          placeholder="e.g. Returning from leave, rehired after resignation…"
                          maxLength={500}
                          rows={3}
                          autoFocus
                        />
                        <p className="text-[11px] text-muted-foreground">{reactReason.length}/500</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setReactivateOpen(false)} disabled={reactivating}>Cancel</Button>
                        <Button onClick={handleReactivate} disabled={reactivating || !reactReason.trim()}>
                          {reactivating ? 'Reactivating…' : 'Reactivate Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={deactivateOpen} onOpenChange={(open) => { setDeactivateOpen(open); if (!open) { setDeactReason('resigned'); setDeactCustom(''); } }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive" disabled={deactivating}>
                        <UserX className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                        Deactivate Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Deactivate {emp.full_name}?</DialogTitle>
                        <DialogDescription>
                          This employee will no longer be able to sign in. All their data is retained and the account can be reactivated later.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-2">
                        <Label className="text-[13px]">Reason</Label>
                        <RadioGroup value={deactReason} onValueChange={(v) => setDeactReason(v as any)} className="gap-2">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="resigned" id="r-resigned" />
                            <Label htmlFor="r-resigned" className="font-normal cursor-pointer">Employee Resigned</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="fired" id="r-fired" />
                            <Label htmlFor="r-fired" className="font-normal cursor-pointer">Employee Fired</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="other" id="r-other" />
                            <Label htmlFor="r-other" className="font-normal cursor-pointer">Other</Label>
                          </div>
                        </RadioGroup>
                        {deactReason === 'other' && (
                          <div className="space-y-1 pt-1">
                            <Textarea
                              value={deactCustom}
                              onChange={(e) => setDeactCustom(e.target.value)}
                              placeholder="Please specify the reason…"
                              maxLength={500}
                              rows={3}
                              autoFocus
                            />
                            <p className="text-[11px] text-muted-foreground">{deactCustom.length}/500</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeactivateOpen(false)} disabled={deactivating}>Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeactivate}
                          disabled={deactivating || (deactReason === 'other' && !deactCustom.trim())}
                        >
                          {deactivating ? 'Deactivating…' : 'Deactivate Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {isCeo && (
                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                      setDeleteDialogOpen(open);
                      if (!open) {
                        setDeleteConfirmText('');
                        setDeleteStep(1);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2" disabled={deleting}>
                        <Trash2 className="h-3.5 w-3.5" style={{ strokeWidth: 1.5 }} />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {deleteStep === 1 ? (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" style={{ strokeWidth: 2 }} />
                              Permanently Delete Employee?
                            </DialogTitle>
                            <DialogDescription asChild>
                              <p className="text-destructive text-[13px] leading-relaxed" style={{ fontFamily: 'var(--ff-body)' }}>
                                This will permanently delete <strong>{emp.full_name}</strong> and ALL their data including attendance records, payroll history, loans, evaluations, and salary history. This cannot be undone.
                              </p>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => setDeleteStep(2)}>
                              Yes, Delete Permanently
                            </Button>
                          </DialogFooter>
                        </>
                      ) : (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" style={{ strokeWidth: 2 }} />
                              Final Confirmation
                            </DialogTitle>
                            <DialogDescription>
                              Type <strong>DELETE</strong> to confirm permanent deletion of {emp.full_name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-2">
                            <Input
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="DELETE"
                              autoFocus
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => { setDeleteStep(1); setDeleteConfirmText(''); }}>
                              Back
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={deleteConfirmText !== 'DELETE' || deleting}
                              onClick={handleDelete}
                            >
                              {deleting ? 'Deleting…' : 'Delete Permanently'}
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
