import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

interface Props {
  employeeId: string;
  companyId: string;
}

const EvaluationTimeline = ({ employeeId, companyId }: Props) => {
  const { employee } = useAuth();
  const role = employee?.role_name;
  const isManager = role === 'hr_manager' || role === 'ceo';
  const myId = employee?.employee_id;

  // Quarterly evaluations
  const { data: quarterly, isLoading: qLoading } = useQuery({
    queryKey: ['eval-timeline-quarterly', employeeId, companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluations')
        .select(`
          id, period, overall_score, comments, recommendation, created_at,
          evaluator:employees!evaluations_evaluated_by_fkey(id, full_name, avatar_url)
        `)
        .eq('company_id', companyId)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!employeeId && !!companyId,
  });

  // Daily evaluations (about this employee + by this employee)
  const { data: daily, isLoading: dLoading } = useQuery({
    queryKey: ['eval-timeline-daily', employeeId, companyId],
    queryFn: async () => {
      // Get evals where this employee is reviewer or reviewee
      const { data: asReviewee } = await supabase
        .from('daily_evaluations')
        .select(`
          id, direction, date, overall_score, remarks, reviewer_id, reviewee_id,
          reviewer:employees!daily_evaluations_reviewer_id_fkey(id, full_name, avatar_url),
          reviewee:employees!daily_evaluations_reviewee_id_fkey(id, full_name, avatar_url)
        `)
        .eq('company_id', companyId)
        .eq('reviewee_id', employeeId)
        .order('date', { ascending: false })
        .limit(20);

      const { data: asReviewer } = await supabase
        .from('daily_evaluations')
        .select(`
          id, direction, date, overall_score, remarks, reviewer_id, reviewee_id,
          reviewer:employees!daily_evaluations_reviewer_id_fkey(id, full_name, avatar_url),
          reviewee:employees!daily_evaluations_reviewee_id_fkey(id, full_name, avatar_url)
        `)
        .eq('company_id', companyId)
        .eq('reviewer_id', employeeId)
        .order('date', { ascending: false })
        .limit(20);

      return { received: asReviewee || [], given: asReviewer || [] };
    },
    enabled: !!employeeId && !!companyId,
  });

  const isLoading = qLoading || dLoading;

  // Build unified timeline
  type TimelineItem = {
    id: string;
    type: 'quarterly' | 'daily';
    date: string;
    score: number | null;
    preview: string | null;
    direction?: string;
    dailyDirection?: 'received' | 'given';
    person: { name: string; avatar: string | null } | null;
    recommendation?: string | null;
    linkTo: string;
  };

  const items: TimelineItem[] = [];

  // Quarterly
  (quarterly || []).forEach((ev: any) => {
    // Visibility: employee viewing own profile shouldn't see recommendation
    const isSelf = myId === employeeId;
    items.push({
      id: `q-${ev.id}`,
      type: 'quarterly',
      date: ev.created_at,
      score: ev.overall_score,
      preview: ev.comments,
      person: ev.evaluator ? { name: ev.evaluator.full_name, avatar: ev.evaluator.avatar_url } : null,
      recommendation: isManager ? ev.recommendation : null,
      linkTo: `/evaluations/${ev.id}`,
    });
  });

  // Daily received
  const receivedEvals = daily?.received || [];
  const givenEvals = daily?.given || [];

  // Visibility filtering
  const filterDaily = (evals: any[], dir: 'received' | 'given') => {
    return evals.filter(ev => {
      if (isManager) return true;
      if (role === 'team_lead') {
        // team lead sees evals they submitted about this employee + evals this employee submitted about them
        if (dir === 'received' && ev.reviewer_id === myId) return true;
        if (dir === 'given' && ev.reviewee_id === myId) return true;
        return false;
      }
      // Employee viewing own profile
      if (myId === employeeId) return true;
      return false;
    });
  };

  filterDaily(receivedEvals, 'received').forEach((ev: any) => {
    items.push({
      id: `dr-${ev.id}`,
      type: 'daily',
      date: ev.date,
      score: ev.overall_score,
      preview: ev.remarks,
      direction: ev.direction,
      dailyDirection: 'received',
      person: ev.reviewer ? { name: ev.reviewer.full_name, avatar: ev.reviewer.avatar_url } : null,
      linkTo: `/evaluations/daily/${ev.id}`,
    });
  });

  filterDaily(givenEvals, 'given').forEach((ev: any) => {
    items.push({
      id: `dg-${ev.id}`,
      type: 'daily',
      date: ev.date,
      score: ev.overall_score,
      preview: ev.remarks,
      direction: ev.direction,
      dailyDirection: 'given',
      person: ev.reviewee ? { name: ev.reviewee.full_name, avatar: ev.reviewee.avatar_url } : null,
      linkTo: `/evaluations/daily/${ev.id}`,
    });
  });

  // Sort by date desc and limit to 20
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const limited = items.slice(0, 20);

  if (isLoading) {
    return (
      <div className="bg-card rounded-[14px] border p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[14px] border p-6">
      <h3 className="font-semibold text-[15px] text-foreground mb-4" style={{ fontFamily: 'var(--ff-display)' }}>
        Evaluation Timeline
      </h3>

      {limited.length === 0 ? (
        <p className="text-sm text-muted-foreground">No evaluations yet</p>
      ) : (
        <div className="space-y-3">
          {limited.map(item => (
            <Link
              key={item.id}
              to={item.linkTo}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Person avatar */}
              <Avatar className="h-8 w-8 mt-0.5">
                <AvatarImage src={item.person?.avatar || ''} />
                <AvatarFallback className="text-[10px]">{item.person ? getInitials(item.person.name) : '?'}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={
                    item.type === 'quarterly'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-0 text-[10px]'
                      : 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-0 text-[10px]'
                  }>
                    {item.type === 'quarterly' ? 'Bi-Annual' : 'Daily'}
                  </Badge>
                  {item.type === 'daily' && item.dailyDirection && (
                    <Badge variant="outline" className={
                      item.dailyDirection === 'received'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-0 text-[10px]'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-0 text-[10px]'
                    }>
                      {item.dailyDirection === 'received' ? 'Received' : 'Given'}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.date), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-foreground">{item.person?.name || '—'}</span>
                  {item.score != null && (
                    <span className="flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {item.score.toFixed(1)}/5
                    </span>
                  )}
                </div>
                {item.preview && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.preview}</p>
                )}
              </div>
            </Link>
          ))}

          {items.length > 20 && (
            <Link
              to={`/evaluations/daily`}
              className="text-sm text-primary hover:underline block text-center pt-2"
            >
              View all evaluations →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluationTimeline;
