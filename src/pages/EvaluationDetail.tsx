import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const recommendationColors: Record<string, string> = {
  'No Change': 'bg-muted text-muted-foreground',
  'Increment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Promotion': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'PIP': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const EvaluationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: evaluation, isLoading } = useQuery({
    queryKey: ['evaluation-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          *,
          employee:employees!evaluations_employee_id_fkey(id, full_name, avatar_url, designation, department),
          evaluator:employees!evaluations_evaluated_by_fkey(id, full_name),
          evaluation_scores(id, parameter_id, score, evaluation_parameters(id, name, max_score))
        `)
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('evaluation_scores').delete().eq('evaluation_id', id!).eq('company_id', companyId!);
      const { error } = await supabase.from('evaluations').delete().eq('id', id!).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Evaluation deleted');
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      navigate('/evaluations');
    },
    onError: () => toast.error('Failed to delete evaluation'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Evaluation not found.</p>
        <Button variant="link" onClick={() => navigate('/evaluations')}>Back to Evaluations</Button>
      </div>
    );
  }

  const ev = evaluation as any;
  const scoresList = (ev.evaluation_scores || []).sort((a: any, b: any) =>
    (a.evaluation_parameters?.name || '').localeCompare(b.evaluation_parameters?.name || '')
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/evaluations')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Evaluation Detail</h1>
        </div>
        {isManager && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/evaluations/${id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Employee header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={ev.employee?.avatar_url || ''} />
                <AvatarFallback>{ev.employee?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{ev.employee?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{ev.employee?.designation}{ev.employee?.department ? ` · ${ev.employee.department}` : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{ev.overall_score?.toFixed(1) || '—'}</div>
              <div className="text-xs text-muted-foreground">/ 5 overall</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Badge variant="outline">{ev.period}</Badge>
            {isManager && ev.recommendation && (
              <Badge className={recommendationColors[ev.recommendation] || ''} variant="outline">{ev.recommendation}</Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            Evaluated by {ev.evaluator?.full_name || '—'} on {ev.created_at ? format(new Date(ev.created_at), 'dd MMM yyyy') : '—'}
          </div>
        </CardContent>
      </Card>

      {/* Parameter scores */}
      <Card>
        <CardHeader><CardTitle className="text-base">Parameter Scores</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {scoresList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scores recorded.</p>
          ) : (
            scoresList.map((s: any) => {
              const max = s.evaluation_parameters?.max_score || 5;
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{s.evaluation_parameters?.name || 'Unknown'}</span>
                    <span className="text-sm">{s.score}/{max}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: max }, (_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < s.score ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      {ev.comments && (
        <Card>
          <CardHeader><CardTitle className="text-base">Comments</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{ev.comments}</p>
          </CardContent>
        </Card>
      )}

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Evaluation</DialogTitle>
            <DialogDescription>Delete this evaluation? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationDetail;
