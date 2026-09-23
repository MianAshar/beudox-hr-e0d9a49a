import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Pencil, Eye, FileDown, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const EMPLOYMENT_TYPES: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  draft:  { bg: '#FEF3C7', text: '#92400E', label: 'Draft' },
  active: { bg: '#D1FAE5', text: '#065F46', label: 'Active' },
  closed: { bg: '#F3F4F6', text: '#6B7280', label: 'Closed' },
};

const APP_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  new:                 { bg: '#EBE6FF', text: '#2B1899', label: 'New' },
  shortlisted:         { bg: '#D1FAE5', text: '#065F46', label: 'Shortlisted' },
  interview_scheduled: { bg: '#DBEAFE', text: '#1E40AF', label: 'Interview Scheduled' },
  hired:               { bg: '#D1FAE5', text: '#065F46', label: 'Hired' },
  rejected:            { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const qc = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [appPanelOpen, setAppPanelOpen] = useState(false);
  const [appNotes, setAppNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch job listing
  const { data: job, isLoading } = useQuery({
    queryKey: ['job-listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  // Fetch applications for this job
  const { data: applications = [] } = useQuery({
    queryKey: ['job-applications', companyId, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('id, job_id, name, gender, mobile, email, city, area_lahore, last_degree, degree_year, linkedin_url, cv_url, cv_filename, message, status, is_duplicate, duplicate_reason, interview_notes, created_at')
        .eq('company_id', companyId!)
        .eq('job_id', id!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id && !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase
        .from('job_listings')
        .update(payload)
        .eq('id', id!)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-listing', id] });
      qc.invalidateQueries({ queryKey: ['job-listings'] });
      toast.success('Job listing updated');
      setEditOpen(false);
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update'),
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ appId, status, interview_notes }: { appId: string; status?: string; interview_notes?: string }) => {
      const payload: any = {};
      if (status !== undefined) payload.status = status;
      if (interview_notes !== undefined) payload.interview_notes = interview_notes;
      const { error } = await supabase
        .from('job_applications')
        .update(payload)
        .eq('id', appId)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-applications', companyId, id] });
      toast.success('Updated');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update'),
  });

  const downloadCV = async (cvUrl: string) => {
    const { data, error } = await supabase.storage.from('job-cvs').createSignedUrl(cvUrl, 60);
    if (error || !data?.signedUrl) { toast.error('Could not generate download link'); return; }
    window.open(data.signedUrl, '_blank');
  };

  const openApp = (app: any) => {
    setSelectedApp(app);
    setAppNotes(app.interview_notes || '');
    setAppPanelOpen(true);
  };

  const openEdit = () => {
    if (!job) return;
    setForm({
      title: job.title || '',
      department: job.department || '',
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      employment_type: job.employment_type || 'full_time',
      expires_at: job.expires_at ? job.expires_at.split('T')[0] : '',
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!form.title?.trim()) { toast.error('Title is required'); return; }
    updateMutation.mutate({
      title: form.title.trim(),
      department: form.department?.trim() || null,
      description: form.description?.trim() || null,
      requirements: form.requirements?.trim() || null,
      location: form.location?.trim() || null,
      employment_type: form.employment_type,
      expires_at: form.expires_at || null,
    });
  };

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  if (!job) return <div className="p-6 text-sm text-muted-foreground">Job not found.</div>;

  const st = STATUS_STYLES[job.status] || STATUS_STYLES.draft;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 22, color: '#120E36' }}>
              {job.title}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: st.bg, color: st.text }}>
              {st.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
            {job.department && <span>{job.department}</span>}
            {job.location && <><span>·</span><span>{job.location}</span></>}
            {job.employment_type && <><span>·</span><span>{EMPLOYMENT_TYPES[job.employment_type]}</span></>}
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{job.view_count} views</span>
            <span>·</span>
            <span>{applications.length} applications</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={openEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList className="bg-transparent h-auto p-0 gap-6 border-b w-full rounded-none justify-start">
          <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2.5 text-sm">
            Job Details
          </TabsTrigger>
          <TabsTrigger value="applicants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2.5 text-sm">
            Applicants ({applications.length})
          </TabsTrigger>
        </TabsList>

        {/* Job Details Tab */}
        <TabsContent value="details" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: description + requirements */}
            <div className="space-y-5">
              <div className="bg-card rounded-[14px] border p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Job Description</p>
                {job.description ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No description added yet.</p>
                )}
              </div>
              <div className="bg-card rounded-[14px] border p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Requirements</p>
                {job.requirements ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No requirements added yet.</p>
                )}
              </div>
            </div>
            {/* Right: meta */}
            <div className="bg-card rounded-[14px] border p-5 space-y-3 h-fit">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#5B3FF8' }}>Listing Info</p>
              {[
                { label: 'Status', value: st.label },
                { label: 'Department', value: job.department || '—' },
                { label: 'Location', value: job.location || '—' },
                { label: 'Employment Type', value: EMPLOYMENT_TYPES[job.employment_type] || job.employment_type },
                { label: 'Expires', value: job.expires_at ? format(new Date(job.expires_at), 'dd MMM yyyy') : 'No expiry' },
                { label: 'Created', value: format(new Date(job.created_at), 'dd MMM yyyy') },
                { label: 'Views', value: job.view_count },
                { label: 'Applications', value: applications.length },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
              {/* Status actions */}
              <div className="pt-2 flex gap-2 flex-wrap">
                {job.status !== 'active' && (
                  <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ status: 'active' })}>Set Active</Button>
                )}
                {job.status !== 'draft' && (
                  <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ status: 'draft' })}>Set Draft</Button>
                )}
                {job.status !== 'closed' && (
                  <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateMutation.mutate({ status: 'closed' })}>Close Listing</Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants" className="mt-5">
          {applications.length === 0 ? (
            <div className="bg-card rounded-[14px] border py-16 text-center space-y-2">
              <Inbox className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">No applications received for this listing yet.</p>
            </div>
          ) : (
            <div className="bg-card rounded-[14px] border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app: any) => {
                    const appSt = APP_STATUS_STYLES[app.status] || APP_STATUS_STYLES.new;
                    return (
                      <TableRow key={app.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openApp(app)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{app.name}</span>
                            {app.is_duplicate && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }} title={app.duplicate_reason}>⚠ Duplicate</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{app.email}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{app.last_degree}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{app.city}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{format(new Date(app.created_at), 'dd MMM yyyy')}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: appSt.bg, color: appSt.text }}>{appSt.label}</span>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Select value={app.status} onValueChange={val => updateAppMutation.mutate({ appId: app.id, status: val })}>
                            <SelectTrigger className="h-7 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(APP_STATUS_STYLES).map(([key, val]) => (
                                <SelectItem key={key} value={key}>{val.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Sheet */}
      {form && (
        <Sheet open={editOpen} onOpenChange={v => { if (!v) setEditOpen(false); }}>
          <SheetContent className="w-full sm:max-w-[580px] flex flex-col">
            <SheetHeader className="shrink-0 px-6 pt-6">
              <SheetTitle>Edit Job Listing</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <Label>Job Title *</Label>
                <Input className="bg-white mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Department</Label>
                  <Input className="bg-white mt-1" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. GC Team" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input className="bg-white mt-1" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lahore" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Employment Type</Label>
                  <Select value={form.employment_type} onValueChange={v => setForm({ ...form, employment_type: v })}>
                    <SelectTrigger className="bg-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input className="bg-white mt-1" type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Job Description</Label>
                <Textarea className="bg-white mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe the role and responsibilities…" />
              </div>
              <div>
                <Label>Requirements</Label>
                <Textarea className="bg-white mt-1" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={4} placeholder="List qualifications and skills required…" />
              </div>
            </div>
            <SheetFooter className="shrink-0 px-6 pb-6 pt-4 border-t gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending} className="flex-1">
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Applicant detail panel */}
      <Sheet open={appPanelOpen} onOpenChange={v => { if (!v) { setAppPanelOpen(false); setSelectedApp(null); } }}>
        <SheetContent className="w-full sm:max-w-[540px] flex flex-col">
          {selectedApp && (
            <>
              <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-lg">{selectedApp.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{job.title}</p>
                  </div>
                  {selectedApp.is_duplicate && (
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full shrink-0" style={{ background: '#FEF3C7', color: '#92400E' }}>⚠ Duplicate</span>
                  )}
                </div>
                {selectedApp.is_duplicate && selectedApp.duplicate_reason && (
                  <p className="text-xs mt-2 px-2 py-1.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>{selectedApp.duplicate_reason}</p>
                )}
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                <div className="flex items-center gap-3">
                  <Label className="shrink-0">Status</Label>
                  <Select value={selectedApp.status} onValueChange={val => { updateAppMutation.mutate({ appId: selectedApp.id, status: val }); setSelectedApp({ ...selectedApp, status: val }); }}>
                    <SelectTrigger className="w-[200px] h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(APP_STATUS_STYLES).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Contact Details</p>
                  <div className="space-y-1 text-sm">
                    {[
                      { label: 'Email', value: selectedApp.email },
                      { label: 'Mobile', value: selectedApp.mobile },
                      { label: 'City', value: selectedApp.city + (selectedApp.area_lahore ? `, ${selectedApp.area_lahore}` : '') },
                      { label: 'Gender', value: selectedApp.gender ? selectedApp.gender.charAt(0).toUpperCase() + selectedApp.gender.slice(1) : '—' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Education</p>
                  <div className="space-y-1 text-sm">
                    {[
                      { label: 'Degree', value: selectedApp.last_degree },
                      { label: 'Year', value: selectedApp.degree_year },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    ))}
                    {selectedApp.linkedin_url && (
                      <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">LinkedIn</span>
                        <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">View Profile</a>
                      </div>
                    )}
                  </div>
                </div>
                {selectedApp.message && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>Message</p>
                    <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">{selectedApp.message}</p>
                  </div>
                )}
                {selectedApp.cv_url && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>CV</p>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadCV(selectedApp.cv_url)}>
                      <FileDown className="h-3.5 w-3.5" />
                      {selectedApp.cv_filename || 'Download CV'}
                    </Button>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>Interview Notes</p>
                  <Textarea className="bg-white text-sm" rows={4} value={appNotes} onChange={e => setAppNotes(e.target.value)} placeholder="Add notes about the candidate…" />
                  <Button size="sm" className="mt-2" disabled={savingNotes || appNotes === (selectedApp.interview_notes || '')}
                    onClick={async () => {
                      setSavingNotes(true);
                      await updateAppMutation.mutateAsync({ appId: selectedApp.id, interview_notes: appNotes });
                      setSelectedApp({ ...selectedApp, interview_notes: appNotes });
                      setSavingNotes(false);
                    }}>
                    {savingNotes ? 'Saving…' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
