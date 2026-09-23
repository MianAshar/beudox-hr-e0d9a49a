import { useState } from 'react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Eye, Briefcase, Inbox, FileDown } from 'lucide-react';
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

const emptyForm = {
  title: '',
  department: '',
  description: '',
  requirements: '',
  location: '',
  employment_type: 'full_time',
  expires_at: '',
};

export default function Jobs() {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const qc = useQueryClient();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [appPanelOpen, setAppPanelOpen] = useState(false);
  const [appJobFilter, setAppJobFilter] = useState<string>('all');
  const [appNotes, setAppNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Fetch all job listings
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['job-listings', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('id, title, department, location, employment_type, status, view_count, expires_at, created_at')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // Fetch application counts per listing
  const { data: appCounts = {} } = useQuery({
    queryKey: ['job-app-counts', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('company_id', companyId!);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((a: any) => {
        counts[a.job_id] = (counts[a.job_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!companyId,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['job-applications', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('id, job_id, name, gender, mobile, email, city, area_lahore, last_degree, degree_year, linkedin_url, cv_url, cv_filename, message, status, is_duplicate, duplicate_reason, interview_date, interview_notes, created_at, job_listings(title)')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ id, status, interview_notes }: { id: string; status?: string; interview_notes?: string }) => {
      const payload: any = {};
      if (status !== undefined) payload.status = status;
      if (interview_notes !== undefined) payload.interview_notes = interview_notes;
      const { error } = await supabase
        .from('job_applications')
        .update(payload)
        .eq('id', id)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-applications'] });
      qc.invalidateQueries({ queryKey: ['job-app-counts'] });
      toast.success('Updated');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update'),
  });

  const downloadCV = async (cvUrl: string, cvFilename: string) => {
    const { data, error } = await supabase.storage
      .from('job-cvs')
      .createSignedUrl(cvUrl, 60);
    if (error || !data?.signedUrl) {
      toast.error('Could not generate download link');
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const openApp = (app: any) => {
    setSelectedApp(app);
    setAppNotes(app.interview_notes || '');
    setAppPanelOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!,
        title: form.title.trim(),
        department: form.department.trim() || null,
        description: form.description.trim() || null,
        requirements: form.requirements.trim() || null,
        location: form.location.trim() || null,
        employment_type: form.employment_type,
        expires_at: form.expires_at || null,
        ...(editingId ? {} : { status: 'draft', created_by: employee?.employee_id }),
      };
      if (editingId) {
        const { error } = await supabase.from('job_listings').update(payload).eq('id', editingId).eq('company_id', companyId!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('job_listings').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-listings'] });
      toast.success(editingId ? 'Job listing updated' : 'Job listing created');
      closeSheet();
    },
    onError: (e: any) => toast.error(e.message || 'Failed to save listing'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('job_listings').update({ status }).eq('id', id).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-listings'] });
      toast.success('Status updated');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update status'),
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setSheetOpen(true);
  };

  const openEdit = (listing: any) => {
    setEditingId(listing.id);
    setForm({
      title: listing.title || '',
      department: listing.department || '',
      description: listing.description || '',
      requirements: listing.requirements || '',
      location: listing.location || '',
      employment_type: listing.employment_type || 'full_time',
      expires_at: listing.expires_at ? listing.expires_at.split('T')[0] : '',
    });
    setErrors({});
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    saveMutation.mutate();
  };

  const activeCount = listings.filter((l: any) => l.status === 'active').length;
  const totalApps = Object.values(appCounts).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Listings', value: listings.length },
          { label: 'Active Listings', value: activeCount },
          { label: 'Total Applications', value: totalApps },
        ].map(card => (
          <div key={card.label} className="bg-card rounded-[14px] border p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
            <p style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 28, color: '#120E36' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="listings">
        <div className="flex items-center justify-between border-b">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="listings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2.5 text-sm"
            >
              Listings
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2.5 text-sm"
            >
              Applications
            </TabsTrigger>
          </TabsList>
          <Button onClick={openNew} className="gap-2 mb-1.5">
            <Plus className="h-4 w-4" />
            New Listing
          </Button>
        </div>

        <TabsContent value="listings" className="mt-4">
          <div className="bg-card rounded-[14px] border overflow-hidden">
            {isLoading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">Loading listings…</div>
            ) : listings.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Briefcase className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">No job listings yet. Create your first one.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Applications</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing: any) => {
                    const st = STATUS_STYLES[listing.status] || STATUS_STYLES.draft;
                    return (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{listing.department || '—'}</TableCell>
                        <TableCell className="text-sm">{EMPLOYMENT_TYPES[listing.employment_type] || listing.employment_type}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: st.bg, color: st.text }}>
                            {st.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            {listing.view_count}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">{appCounts[listing.id] || 0}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {listing.expires_at ? format(new Date(listing.expires_at), 'dd MMM yyyy') : '—'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(listing)}>Edit</DropdownMenuItem>
                              {listing.status !== 'active' && (
                                <DropdownMenuItem onClick={() => statusMutation.mutate({ id: listing.id, status: 'active' })}>
                                  Set Active
                                </DropdownMenuItem>
                              )}
                              {listing.status !== 'draft' && (
                                <DropdownMenuItem onClick={() => statusMutation.mutate({ id: listing.id, status: 'draft' })}>
                                  Set Draft
                                </DropdownMenuItem>
                              )}
                              {listing.status !== 'closed' && (
                                <DropdownMenuItem onClick={() => statusMutation.mutate({ id: listing.id, status: 'closed' })}>
                                  Close Listing
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4 space-y-3">
          {/* Filter by job */}
          <div className="flex items-center gap-3">
            <Select value={appJobFilter} onValueChange={setAppJobFilter}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="All listings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                {listings.map((l: any) => (
                  <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {applications.filter((a: any) => appJobFilter === 'all' || a.job_id === appJobFilter).length} applications
            </span>
          </div>

          <div className="bg-card rounded-[14px] border overflow-hidden">
            {applications.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Inbox className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">No applications received yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications
                    .filter((a: any) => appJobFilter === 'all' || a.job_id === appJobFilter)
                    .map((app: any) => {
                      const appStatus = APP_STATUS_STYLES[app.status] || APP_STATUS_STYLES.new;
                      return (
                        <TableRow
                          key={app.id}
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => openApp(app)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{app.name}</span>
                              {app.is_duplicate && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }} title={app.duplicate_reason}>
                                  ⚠ Duplicate
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </TableCell>
                          <TableCell className="text-sm">{(app.job_listings as any)?.title || '—'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{app.last_degree}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{app.city}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{format(new Date(app.created_at), 'dd MMM yyyy')}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: appStatus.bg, color: appStatus.text }}>
                              {appStatus.label}
                            </span>
                          </TableCell>
                          <TableCell onClick={e => e.stopPropagation()}>
                            <Select
                              value={app.status}
                              onValueChange={val => updateAppMutation.mutate({ id: app.id, status: val })}
                            >
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
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={v => { if (!v) closeSheet(); }}>
        <SheetContent className="w-full sm:max-w-[580px] flex flex-col">
          <SheetHeader className="shrink-0 px-6 pt-6">
            <SheetTitle>{editingId ? 'Edit Job Listing' : 'New Job Listing'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div>
              <Label>Job Title *</Label>
              <Input className="bg-white mt-1" value={form.title} onChange={e => { setForm({ ...form, title: e.target.value }); setErrors({}); }} placeholder="e.g. Senior Estimator" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
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
              <Textarea className="bg-white mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe the role, responsibilities, and what a typical day looks like…" />
            </div>
            <div>
              <Label>Requirements</Label>
              <Textarea className="bg-white mt-1" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={4} placeholder="List qualifications, experience, and skills required…" />
            </div>
          </div>
          <SheetFooter className="shrink-0 px-6 pb-6 pt-4 border-t gap-2">
            <Button variant="outline" onClick={closeSheet} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1">
              {saveMutation.isPending ? 'Saving…' : editingId ? 'Save Changes' : 'Create Listing'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* Applicant detail panel */}
      <Sheet open={appPanelOpen} onOpenChange={v => { if (!v) { setAppPanelOpen(false); setSelectedApp(null); } }}>
        <SheetContent className="w-full sm:max-w-[540px] flex flex-col">
          {selectedApp && (
            <>
              <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-lg">{selectedApp.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{(selectedApp.job_listings as any)?.title}</p>
                  </div>
                  {selectedApp.is_duplicate && (
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full shrink-0" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      ⚠ Duplicate
                    </span>
                  )}
                </div>
                {selectedApp.is_duplicate && selectedApp.duplicate_reason && (
                  <p className="text-xs mt-2 px-2 py-1.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>
                    {selectedApp.duplicate_reason}
                  </p>
                )}
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {/* Status */}
                <div className="flex items-center gap-3">
                  <Label className="shrink-0">Status</Label>
                  <Select
                    value={selectedApp.status}
                    onValueChange={val => {
                      updateAppMutation.mutate({ id: selectedApp.id, status: val });
                      setSelectedApp({ ...selectedApp, status: val });
                    }}
                  >
                    <SelectTrigger className="w-[200px] h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(APP_STATUS_STYLES).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact info */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Contact Details</p>
                  <div className="space-y-2 text-sm">
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

                {/* Education */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#5B3FF8' }}>Education</p>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Degree', value: selectedApp.last_degree },
                      { label: 'Completion Year', value: selectedApp.degree_year },
                      { label: 'LinkedIn', value: selectedApp.linkedin_url || '—' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">{row.label}</span>
                        {row.label === 'LinkedIn' && selectedApp.linkedin_url ? (
                          <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate max-w-[200px]">
                            View Profile
                          </a>
                        ) : (
                          <span className="font-medium">{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                {selectedApp.message && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>Message</p>
                    <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">{selectedApp.message}</p>
                  </div>
                )}

                {/* CV */}
                {selectedApp.cv_url && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>CV</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => downloadCV(selectedApp.cv_url, selectedApp.cv_filename)}
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      {selectedApp.cv_filename || 'Download CV'}
                    </Button>
                  </div>
                )}

                {/* Interview notes */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B3FF8' }}>Interview Notes</p>
                  <Textarea
                    className="bg-white text-sm"
                    rows={4}
                    value={appNotes}
                    onChange={e => setAppNotes(e.target.value)}
                    placeholder="Add notes about the interview, candidate impression, follow-up actions…"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    disabled={savingNotes || appNotes === (selectedApp.interview_notes || '')}
                    onClick={async () => {
                      setSavingNotes(true);
                      await updateAppMutation.mutateAsync({ id: selectedApp.id, interview_notes: appNotes });
                      setSelectedApp({ ...selectedApp, interview_notes: appNotes });
                      setSavingNotes(false);
                    }}
                  >
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
