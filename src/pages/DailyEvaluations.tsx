import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Plus, Eye, Trash2, ClipboardCheck, CalendarIcon, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const DailyEvaluations = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const myId = employee?.employee_id;

  const [tab, setTab] = useState('submitted');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfMonth(new Date()));
  const [dateTo, setDateTo] = useState<Date | undefined>(endOfMonth(new Date()));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['daily-evaluations', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_evaluations')
        .select(`
          id, direction, date, overall_score, remarks, reviewer_id, reviewee_id, created_at,
          reviewer:employees!daily_evaluations_reviewer_id_fkey(id, full_name, avatar_url),
          reviewee:employees!daily_evaluations_reviewee_id_fkey(id, full_name, avatar_url),
          project:projects!daily_evaluations_project_id_fkey(id, project_name)
        `)
        .eq('company_id', companyId!)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('daily_evaluation_scores').delete().eq('daily_evaluation_id', id).eq('company_id', companyId!);
      const { error } = await supabase.from('daily_evaluations').delete().eq('id', id).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Evaluation deleted');
      queryClient.invalidateQueries({ queryKey: ['daily-evaluations'] });
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const filterByDate = (list: any[]) => {
    return list.filter(ev => {
      const d = new Date(ev.date);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  };

  const submitted = filterByDate((evaluations || []).filter((ev: any) => ev.reviewer_id === myId));
  const aboutMe = filterByDate((evaluations || []).filter((ev: any) => ev.reviewee_id === myId));
  const all = filterByDate(evaluations || []);

  const canDelete = (ev: any) => isManager || ev.reviewer_id === myId;

  const renderTable = (items: any[], showDirection: boolean) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">No evaluations found</h3>
          <p className="text-sm text-muted-foreground mt-1">No daily evaluations match your filters.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {showDirection && <TableHead>Direction</TableHead>}
            <TableHead>Reviewer</TableHead>
            <TableHead>Reviewee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((ev: any) => (
            <TableRow key={ev.id}>
              {showDirection && (
                <TableCell>
                  <Badge variant="outline" className={ev.direction === 'senior_to_junior'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-0'
                  }>
                    {ev.direction === 'senior_to_junior' ? '→ To' : '← From'}
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={ev.reviewer?.avatar_url || ''} />
                    <AvatarFallback className="text-[10px]">{getInitials(ev.reviewer?.full_name || '?')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ev.reviewer?.full_name || '—'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={ev.reviewee?.avatar_url || ''} />
                    <AvatarFallback className="text-[10px]">{getInitials(ev.reviewee?.full_name || '?')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ev.reviewee?.full_name || '—'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(ev.date), 'dd MMM yyyy')}
              </TableCell>
              <TableCell>
                <span className="font-semibold">{ev.overall_score?.toFixed(1) || '—'}</span>
                <span className="text-muted-foreground text-xs"> / 5</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                {ev.remarks || '—'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/evaluations/daily/${ev.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canDelete(ev) && (
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(ev.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">Two-way evaluations between Team Leads and Employees</p>
        </div>
        <Button onClick={() => navigate('/evaluations/daily/new')}>
          <Plus className="h-4 w-4 mr-2" /> Submit Evaluation
        </Button>
      </div>

      {/* Date filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, 'dd MMM yyyy') : 'From'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground text-sm">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, 'dd MMM yyyy') : 'To'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start" style={{ borderColor: 'hsl(var(--border))' }}>
            <TabsTrigger value="submitted" className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
              Submitted by Me
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
              About Me
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
                All Evaluations
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="submitted" className="mt-4">{renderTable(submitted, true)}</TabsContent>
          <TabsContent value="about" className="mt-4">{renderTable(aboutMe, true)}</TabsContent>
          {isManager && <TabsContent value="all" className="mt-4">{renderTable(all, true)}</TabsContent>}
        </Tabs>
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Evaluation</DialogTitle>
            <DialogDescription>Delete this evaluation? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyEvaluations;
