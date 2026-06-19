import { useEffect, useRef, useState, useMemo } from 'react';
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatDate } from '@/lib/format-date';
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown, X, Plus } from 'lucide-react';
import { NewClientModal } from '@/components/clients/NewClientModal';


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
    notes: '',
    sub_series: '',
  });
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [addingSubSeries, setAddingSubSeries] = useState(false);
  const [newSubSeries, setNewSubSeries] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Combobox open states
  const [clientOpen, setClientOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamExpanded, setTeamExpanded] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');

  // Fetch lookups
  const { data: clients } = useQuery({
    queryKey: ['clients-lookup', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('clients').select('id, name, billing_currency, sub_series').eq('company_id', companyId!).eq('is_active', true).order('name');
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
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, employment_type, employee_roles(roles(name))')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
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
        notes: existingProject.notes || '',
        sub_series: (existingProject as any).sub_series || '',
      });
    }
  }, [existingProject]);

  useEffect(() => {
    if (existingAssignments) setTeamMembers(existingAssignments);
  }, [existingAssignments]);

  // On NEW project, pre-select all active employees excluding CEO / HR Manager / Finance Manager / Director.
  const didPrefillRef = useRef(false);
  useEffect(() => {
    if (isEdit) return;
    if (!employees || employees.length === 0) return;
    if (didPrefillRef.current) return;
    const excludedRoles = new Set(['ceo', 'hr_manager', 'finance_manager']);
    const eligibleIds = employees
      .filter((e: any) => {
        if (e.employment_type === 'director') return false;
        const roleNames: string[] = (e.employee_roles ?? [])
          .map((er: any) => er?.roles?.name)
          .filter(Boolean);
        return !roleNames.some((r) => excludedRoles.has(r));
      })
      .map((e: any) => e.id);
    setTeamMembers(eligibleIds);
    didPrefillRef.current = true;
  }, [employees, isEdit]);

  const selectedClient = clients?.find(c => c.id === form.client_id);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        project_code: form.project_code.trim(),
        project_name: form.project_name.trim(),
        client_id: form.client_id,
        category_id: form.category_id || null,
        scope_of_work: form.scope_of_work.trim() || null,
        fee: form.fee ? parseFloat(form.fee) : null,
        client_deadline: form.client_deadline ? format(form.client_deadline, 'yyyy-MM-dd') : null,
        internal_deadline: form.internal_deadline ? format(form.internal_deadline, 'yyyy-MM-dd') : null,
        project_lead_id: form.project_lead_id || null,
        notes: form.notes.trim() || null,
        sub_series: form.sub_series || null,
        company_id: companyId!,
      };
      if (!isEdit) payload.status = 'pending';

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', id!);
        if (error) throw error;
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
              is_active: true,
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
              is_active: true,
            }))
          );
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['client-projects'] });
      qc.invalidateQueries({ queryKey: ['project-team'] });
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

  const removeTeamMember = (empId: string) => {
    setTeamMembers(prev => prev.filter(e => e !== empId));
  };

  

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!clientSearch) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(c => c.name.toLowerCase().includes(q));
  }, [clients, clientSearch]);

  const filteredLeadEmployees = useMemo(() => {
    if (!employees) return [];
    if (!leadSearch) return employees;
    const q = leadSearch.toLowerCase();
    return employees.filter(e => e.full_name.toLowerCase().includes(q) || (e.employee_code?.toLowerCase().includes(q)));
  }, [employees, leadSearch]);

  const filteredTeamEmployees = useMemo(() => {
    if (!employees) return [];
    if (!teamSearch) return employees;
    const q = teamSearch.toLowerCase();
    return employees.filter(e => e.full_name.toLowerCase().includes(q) || (e.employee_code?.toLowerCase().includes(q)));
  }, [employees, teamSearch]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Row 2: Client combobox + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Client *</Label>
            <Popover open={clientOpen} onOpenChange={setClientOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={clientOpen} className="w-full justify-between font-normal">
                  {selectedClient?.name || 'Select client…'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput placeholder="Search clients…" value={clientSearch} onValueChange={setClientSearch} />
                  <CommandList>
                    <CommandEmpty>No clients found.</CommandEmpty>
                    <CommandGroup>
                      {filteredClients.map(c => (
                        <CommandItem key={c.id} value={c.id} onSelect={() => { setForm({ ...form, client_id: c.id }); setClientOpen(false); setClientSearch(''); }}>
                          <Check className={cn('mr-2 h-4 w-4', form.client_id === c.id ? 'opacity-100' : 'opacity-0')} />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.client_id && <p className="text-sm text-destructive mt-1">{errors.client_id}</p>}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No categories defined. Add categories in Settings.
                  </div>
                )}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  {form.client_deadline ? formatDate(form.client_deadline) : 'Pick date'}
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
                  {form.internal_deadline ? formatDate(form.internal_deadline) : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={form.internal_deadline} onSelect={d => setForm({ ...form, internal_deadline: d })} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Lead combobox */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Project Lead</Label>
            <Popover open={leadOpen} onOpenChange={setLeadOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={leadOpen} className="w-full justify-between font-normal">
                  {employees?.find(e => e.id === form.project_lead_id)?.full_name || 'Select lead…'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput placeholder="Search by name or code…" value={leadSearch} onValueChange={setLeadSearch} />
                  <CommandList>
                    <CommandEmpty>No employees found.</CommandEmpty>
                    <CommandGroup>
                      {filteredLeadEmployees.map(e => (
                        <CommandItem key={e.id} value={e.id} onSelect={() => { setForm({ ...form, project_lead_id: e.id }); setLeadOpen(false); setLeadSearch(''); }}>
                          <Check className={cn('mr-2 h-4 w-4', form.project_lead_id === e.id ? 'opacity-100' : 'opacity-0')} />
                          {e.full_name} {e.employee_code ? `(${e.employee_code})` : ''}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Team Members - searchable multi-select */}
        <div>
          <Label>Team Members / Resources</Label>
          <Popover open={teamOpen} onOpenChange={setTeamOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between font-normal mt-2">
                Search and select team members…
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" side="bottom" avoidCollisions={false}>
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search by name or code…" value={teamSearch} onValueChange={setTeamSearch} />
                <CommandList>
                  <CommandEmpty>No employees found.</CommandEmpty>
                  <CommandGroup>
                    {filteredTeamEmployees.map(e => (
                      <CommandItem key={e.id} value={e.id} onSelect={() => toggleTeamMember(e.id)}>
                        <Check className={cn('mr-2 h-4 w-4', teamMembers.includes(e.id) ? 'opacity-100' : 'opacity-0')} />
                        {e.full_name} {e.employee_code ? `(${e.employee_code})` : ''}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Selected members - collapsed summary + expandable list */}
          {teamMembers.length > 0 && (() => {
            const members = teamMembers.map(id => {
              const emp = employees?.find(e => e.id === id);
              const name = emp?.full_name || 'Unknown';
              const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return { id, emp, name, initials };
            });
            const visible = members.slice(0, 8);
            const extra = members.length - visible.length;
            return (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-dm-sans font-medium text-[13px] text-[#120E36]">
                    {members.length} team member{members.length === 1 ? '' : 's'} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setTeamExpanded(v => !v)}
                    className="font-dm-sans font-medium text-[12px] text-[#5B3FF8] hover:underline"
                  >
                    {teamExpanded ? 'Hide' : 'Show all'}
                  </button>
                </div>

                {!teamExpanded ? (
                  <div className="flex items-center h-9 mt-1.5">
                    {visible.map(m => (
                      <div
                        key={m.id}
                        title={m.name}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary border-[1.5px] border-white -ml-[10px] first:ml-0"
                      >
                        {m.initials}
                      </div>
                    ))}
                    {extra > 0 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6F5FF] text-[10px] font-medium text-[#4B4468] border-[1.5px] border-white -ml-[10px]">
                        +{extra}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 space-y-1.5">
                    {members.map(m => (
                      <div key={m.id} className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {m.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            {m.emp?.employee_code && (
                              <p className="text-xs text-muted-foreground">{m.emp.employee_code}</p>
                            )}
                          </div>
                        </div>
                        <button type="button" onClick={() => removeTeamMember(m.id)} className="rounded-full p-1 hover:bg-muted">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
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
