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
import { Plus, MoreHorizontal, Eye, Briefcase, Inbox } from 'lucide-react';
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

        <TabsContent value="applications" className="mt-4">
          <div className="bg-card rounded-[14px] border py-16 text-center space-y-2">
            <Inbox className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <p className="text-sm font-medium text-foreground">Applications review is coming next</p>
            <p className="text-sm text-muted-foreground">
              Candidates applying through the website will appear here. {totalApps > 0 ? `${totalApps} received so far.` : ''}
            </p>
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
    </div>
  );
}
