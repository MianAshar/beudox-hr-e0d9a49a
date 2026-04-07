import { useState } from 'react';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Eye, Trash2, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const recommendationColors: Record<string, string> = {
  'No Change': 'bg-muted text-muted-foreground',
  'Increment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Promotion': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'PIP': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const Evaluations = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';

  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterRecommendation, setFilterRecommendation] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: employees } = useQuery({
    queryKey: ['employees-list', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, avatar_url, designation')
        .eq('company_id', companyId!)
        .eq('status', 'active')
        .order('full_name');
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['evaluations', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          id, period, overall_score, recommendation, comments, created_at,
          employee:employees!evaluations_employee_id_fkey(id, full_name, avatar_url, designation),
          evaluator:employees!evaluations_evaluated_by_fkey(id, full_name)
        `)
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('evaluation_scores').delete().eq('evaluation_id', id).eq('company_id', companyId!);
      const { error } = await supabase.from('evaluations').delete().eq('id', id).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Evaluation deleted');
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete evaluation'),
  });

  const filtered = (evaluations || []).filter((ev: any) => {
    if (!isManager && ev.employee?.id !== employee?.employee_id) return false;
    if (filterEmployee !== 'all' && ev.employee?.id !== filterEmployee) return false;
    if (filterPeriod !== 'all' && ev.period !== filterPeriod) return false;
    if (filterRecommendation !== 'all' && ev.recommendation !== filterRecommendation) return false;
    return true;
  });

  const periods = [...new Set((evaluations || []).map((e: any) => e.period))].sort();
  const recommendations = [...new Set((evaluations || []).map((e: any) => e.recommendation).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isManager ? 'Manage employee performance evaluations' : 'View your performance evaluations'}
          </p>
        </div>
        {isManager && (
          <Button onClick={() => navigate('/evaluations/new')}>
            <Plus className="h-4 w-4 mr-2" /> Create Evaluation
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {isManager && (
          <SearchableEmployeeSelect
            employees={employees || []}
            value={filterEmployee}
            onValueChange={setFilterEmployee}
            placeholder="All Employees"
            allowAll
            allLabel="All Employees"
            className="w-[200px]"
          />
        )}
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Periods" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            {periods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        {isManager && (
          <Select value={filterRecommendation} onValueChange={setFilterRecommendation}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Recommendations" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recommendations</SelectItem>
              {recommendations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium">No evaluations found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isManager ? 'Create a new evaluation to get started.' : 'No evaluations have been recorded yet.'}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Overall Score</TableHead>
              {isManager && <TableHead>Recommendation</TableHead>}
              <TableHead>Evaluated By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ev: any) => (
              <TableRow key={ev.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={ev.employee?.avatar_url || ''} />
                      <AvatarFallback className="text-xs">
                        {ev.employee?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{ev.employee?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{ev.employee?.designation}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ev.period}</TableCell>
                <TableCell>
                  <span className="font-semibold">{ev.overall_score?.toFixed(1) || '—'}</span>
                  <span className="text-muted-foreground text-xs"> / 5</span>
                </TableCell>
                {isManager && (
                  <TableCell>
                    {ev.recommendation ? (
                      <Badge className={recommendationColors[ev.recommendation] || 'bg-muted text-muted-foreground'} variant="outline">
                        {ev.recommendation}
                      </Badge>
                    ) : '—'}
                  </TableCell>
                )}
                <TableCell className="text-sm">{ev.evaluator?.full_name || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ev.created_at ? format(new Date(ev.created_at), 'dd MMM yyyy') : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/evaluations/${ev.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isManager && (
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

export default Evaluations;
