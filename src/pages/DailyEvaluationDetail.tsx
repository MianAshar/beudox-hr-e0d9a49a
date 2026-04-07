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
import { ArrowLeft, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const DailyEvaluationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const myId = employee?.employee_id;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: evaluation, isLoading } = useQuery({
    queryKey: ['daily-eval-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_evaluations')
        .select(`
          *,
          reviewer:employees!daily_evaluations_reviewer_id_fkey(id, full_name, avatar_url, designation),
          reviewee:employees!daily_evaluations_reviewee_id_fkey(id, full_name, avatar_url, designation),
          project:projects!daily_evaluations_project_id_fkey(id, project_name),
          daily_evaluation_scores(id, parameter_id, score, evaluation_parameters(id, name, max_score))
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
      await supabase.from('daily_evaluation_scores').delete().eq('daily_evaluation_id', id!).eq('company_id', companyId!);
      const { error } = await supabase.from('daily_evaluations').delete().eq('id', id!).eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Evaluation deleted');
      queryClient.invalidateQueries({ queryKey: ['daily-evaluations'] });
      navigate('/evaluations/daily');
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
        <Button variant="link" onClick={() => navigate('/evaluations/daily')}>Back to Daily Evaluations</Button>
      </div>
    );
  }

  const ev = evaluation as any;
  const canDelete = isManager || ev.reviewer_id === myId;
  const scoresList = (ev.daily_evaluation_scores || []).sort((a: any, b: any) =>
    (a.evaluation_parameters?.name || '').localeCompare(b.evaluation_parameters?.name || '')
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/evaluations/daily')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Evaluation Detail</h1>
        </div>
        {canDelete && (
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        )}
      </div>

      {/* Direction badge */}
      <Badge variant="outline" className={ev.direction === 'senior_to_junior'
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-0'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-0'
      }>
        {ev.direction === 'senior_to_junior' ? 'Team Lead → Employee' : 'Employee → Team Lead'}
      </Badge>

      {/* People */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground mb-2">Reviewer</p>
                <Avatar className="h-14 w-14 mx-auto">
                  <AvatarImage src={ev.reviewer?.avatar_url || ''} />
                  <AvatarFallback>{getInitials(ev.reviewer?.full_name || '?')}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium mt-1">{ev.reviewer?.full_name}</p>
                <p className="text-xs text-muted-foreground">{ev.reviewer?.designation || ''}</p>
              </div>
              <span className="text-muted-foreground text-lg">→</span>
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground mb-2">Reviewee</p>
                <Avatar className="h-14 w-14 mx-auto">
                  <AvatarImage src={ev.reviewee?.avatar_url || ''} />
                  <AvatarFallback>{getInitials(ev.reviewee?.full_name || '?')}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium mt-1">{ev.reviewee?.full_name}</p>
                <p className="text-xs text-muted-foreground">{ev.reviewee?.designation || ''}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{ev.overall_score?.toFixed(1) || '—'}</div>
              <div className="text-xs text-muted-foreground">/ 5 overall</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 text-sm text-muted-foreground flex-wrap">
            <span>Date: {format(new Date(ev.date), 'dd MMM yyyy')}</span>
            {ev.project && <span>· Project: {ev.project.project_name}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Scores */}
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

      {/* Remarks */}
      {ev.remarks && (
        <Card>
          <CardHeader><CardTitle className="text-base">Remarks</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{ev.remarks}</p>
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

export default DailyEvaluationDetail;
