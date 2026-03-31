import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon } from 'lucide-react';

const STATUSES = ['in_progress', 'completed', 'invoiced', 'on_hold', 'cancelled'];
const PRIORITIES = ['high', 'medium', 'low'];

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');
  const isEdit = !!id;
  const navigate = useNavigate();
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;

  const [form, setForm] = useState({
    project_code: '',
    project_name: '',
    client_id: preselectedClientId || '',
    category_id: '',
    scope_of_work: '',
    fee: '',
    client_deadline: undefined as Date | undefined,
    internal_deadline: undefined as Date | undefined,
    project_lead_id: '',
    priority: '',
    status: 'in_progress',
    notes: '',
  });
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch lookups
  const { data: clients } = useQuery({
    queryKey: ['clients-lookup', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('clients').select('id, name, billing_currency').eq('company_id', companyId!).eq('is_active', true).order('name');
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: categories } = useQuery({
    queryKey: ['project-categories', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('project_categories').select('id, name').eq('company_id', companyId!).eq('is_active', true).order('name');
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees-lookup', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name').eq('company_id', companyId!).eq('status', 'active').order('full_name');
      return data ?? [];
    },
    enabled: !!companyId,
  });

  // Fetch existing project for edit
  const { data: existingProject } = useQuery({
    queryKey: ['project-edit', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: existingAssignments } = useQuery({
    queryKey: ['project-assignments-edit', id],
    queryFn: async () => {
      const { data } = await supabase.from('project_assignments').select('employee_id').eq('project_id', id!).eq('is_active', true);
      return data?.map(a => a.employee_id) ?? [];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existingProject) {
      setForm({
        project_code: existingProject.project_code,
        project_name: existingProject.project_name,
        client_id: existingProject.client_id,
        category_id: existingProject.category_id || '',
        scope_of_work: existingProject.scope_of_work || '',
        fee: existingProject.fee?.toString() || '',
        client_deadline: existingProject.client_deadline ? new Date(existingProject.client_deadline) : undefined,
        internal_deadline: existingProject.internal_deadline ? new Date(existingProject.internal_deadline) : undefined,
        project_lead_id: existingProject.project_lead_id || '',
        priority: existingProject.priority || '',
        status: existingProject.status,
        notes: existingProject.notes || '',
      });
    }
  }, [existingProject]);

  useEffect(() => {
    if (existingAssignments) setTeamMembers(existingAssignments);
  }, [existingAssignments]);

  const selectedClient = clients?.find(c => c.id === form.client_id);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        project_code: form.project_code.trim(),
        project_name: form.project_name.trim(),
        client_id: form.client_id,
        category_id: form.category_id || null,
        scope_of_work: form.scope_of_work.trim() || null,
        fee: form.fee ? parseFloat(form.fee) : null,
        client_deadline: form.client_deadline ? format(form.client_deadline, 'yyyy-MM-dd') : null,
        internal_deadline: form.internal_deadline ? format(form.internal_deadline, 'yyyy-MM-dd') : null,
        project_lead_id: form.project_lead_id || null,
        priority: form.priority || null,
        status: form.status,
        notes: form.notes.trim() || null,
        company_id: companyId!,
      };

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', id!);
        if (error) throw error;
        // Manage assignments: deactivate removed, add new
        const prev = existingAssignments ?? [];
        const removed = prev.filter(e => !teamMembers.includes(e));
        const added = teamMembers.filter(e => !prev.includes(e));
        if (removed.length > 0) {
          await supabase.from('project_assignments')
            .update({ is_active: false, removed_at: new Date().toISOString() })
            .eq('project_id', id!)
            .in('employee_id', removed);
        }
        if (added.length > 0) {
          await supabase.from('project_assignments').insert(
            added.map(empId => ({
              project_id: id!,
              employee_id: empId,
              company_id: companyId!,
              assigned_by: employee?.employee_id!,
            }))
          );
        }
      } else {
        const { data: newProj, error } = await supabase.from('projects').insert(payload).select('id').single();
        if (error) throw error;
        if (teamMembers.length > 0) {
          await supabase.from('project_assignments').insert(
            teamMembers.map(empId => ({
              project_id: newProj.id,
              employee_id: empId,
              company_id: companyId!,
              assigned_by: employee?.employee_id!,
            }))
          );
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['client-projects'] });
      toast({ title: isEdit ? 'Project updated successfully' : 'Project added successfully' });
      navigate('/projects');
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.project_code.trim()) errs.project_code = 'Required';
    if (!form.project_name.trim()) errs.project_name = 'Required';
    if (!form.client_id) errs.client_id = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    saveMutation.mutate();
  };

  const toggleTeamMember = (empId: string) => {
    setTeamMembers(prev => prev.includes(empId) ? prev.filter(e => e !== empId) : [...prev, empId]);
  };

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{isEdit ? 'Edit Project' : 'New Project'}</h1>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Project Code *</Label>
            <Input value={form.project_code} onChange={e => setForm({ ...form, project_code: e.target.value })} placeholder="e.g. 915NY" />
            {errors.project_code && <p className="text-sm text-destructive mt-1">{errors.project_code}</p>}
          </div>
          <div>
            <Label>Project Name *</Label>
            <Input value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })} />
            {errors.project_name && <p className="text-sm text-destructive mt-1">{errors.project_name}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Client *</Label>
            <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.client_id && <p className="text-sm text-destructive mt-1">{errors.client_id}</p>}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scope */}
        <div>
          <Label>Scope of Work</Label>
          <Textarea value={form.scope_of_work} onChange={e => setForm({ ...form, scope_of_work: e.target.value })} rows={3} />
        </div>

        {/* Fee + Deadlines */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Fee {selectedClient ? `(${selectedClient.billing_currency})` : ''}</Label>
            <Input type="number" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
          </div>
          <div>
            <Label>Client Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !form.client_deadline && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.client_deadline ? format(form.client_deadline, 'PPP') : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={form.client_deadline} onSelect={d => setForm({ ...form, client_deadline: d })} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Internal Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !form.internal_deadline && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.internal_deadline ? format(form.internal_deadline, 'PPP') : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={form.internal_deadline} onSelect={d => setForm({ ...form, internal_deadline: d })} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Lead + Priority + Status */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Project Lead</Label>
            <Select value={form.project_lead_id} onValueChange={v => setForm({ ...form, project_lead_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
              <SelectContent>
                {employees?.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <Label>Team Members / Resources</Label>
          <div className="mt-2 border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
            {employees?.map(emp => (
              <label key={emp.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={teamMembers.includes(emp.id)}
                  onCheckedChange={() => toggleTeamMember(emp.id)}
                />
                <span className="text-sm text-foreground">{emp.full_name}</span>
              </label>
            ))}
            {(!employees || employees.length === 0) && (
              <p className="text-sm text-muted-foreground">No active employees found</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes / Progress</Label>
          <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
