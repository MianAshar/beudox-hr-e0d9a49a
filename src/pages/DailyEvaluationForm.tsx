import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Star, ArrowLeft, CalendarIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const StarRating = ({ value, onChange, max = 5 }: { value: number; onChange: (v: number) => void; max?: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: max }, (_, i) => (
      <button key={i} type="button" onClick={() => onChange(i + 1)} className="focus:outline-none">
        <Star className={`h-6 w-6 transition-colors ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
      </button>
    ))}
    <span className="ml-2 text-sm font-medium">{value}/{max}</span>
  </div>
);

const DailyEvaluationForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const role = employee?.role_name;
  const myId = employee?.employee_id;

  // Determine direction based on role
  const isJunior = role === 'employee';
  const direction = isJunior ? 'junior_to_senior' : 'senior_to_junior';

  const [revieweeId, setRevieweeId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  // Fetch employees based on direction
  const { data: selectableEmployees } = useQuery({
    queryKey: ['daily-eval-employees', companyId, direction],
    queryFn: async () => {
      if (isJunior) {
        // Employee can only evaluate team_lead role employees
        const { data } = await supabase
          .from('employees')
          .select(`id, full_name, avatar_url, designation, employee_roles(roles(name))`)
          .eq('company_id', companyId!)
          .eq('status', 'active')
          .order('full_name');
        // Filter to team_lead roles
        return (data || []).filter((emp: any) =>
          emp.employee_roles?.some((er: any) => er.roles?.name === 'team_lead')
        );
      } else {
        // team_lead, hr_manager, ceo can evaluate any active employee
        const { data } = await supabase
          .from('employees')
          .select('id, full_name, avatar_url, designation')
          .eq('company_id', companyId!)
          .eq('status', 'active')
          .neq('id', myId!)
          .order('full_name');
        return data || [];
      }
    },
    enabled: !!companyId && !!myId,
  });

  // Fetch parameters for current direction
  const { data: parameters } = useQuery({
    queryKey: ['daily-eval-params', companyId, direction],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluation_parameters')
        .select('*')
        .eq('company_id', companyId!)
        .eq('evaluation_type', 'daily')
        .eq('direction', direction)
        .eq('is_active', true)
        .order('display_order');
      return data || [];
    },
    enabled: !!companyId,
  });

  // Seed defaults if no daily params exist
  useEffect(() => {
    if (parameters && parameters.length === 0 && companyId) {
      const seed = async () => {
        // Check if ANY daily params exist (including other direction)
        const { data: allDaily } = await supabase
          .from('evaluation_parameters')
          .select('id')
          .eq('company_id', companyId)
          .eq('evaluation_type', 'daily')
          .limit(1);
        if (allDaily && allDaily.length > 0) return;

        const defaults = [
          { name: 'Accuracy', direction: 'senior_to_junior', display_order: 1 },
          { name: 'Time Management', direction: 'senior_to_junior', display_order: 2 },
          { name: 'Focus', direction: 'senior_to_junior', display_order: 3 },
          { name: 'Guidance', direction: 'junior_to_senior', display_order: 1 },
        ];
        for (const d of defaults) {
          await supabase.from('evaluation_parameters').insert({
            company_id: companyId,
            name: d.name,
            evaluation_type: 'daily',
            direction: d.direction,
            min_score: 1,
            max_score: 5,
            display_order: d.display_order,
            is_active: true,
          });
        }
        queryClient.invalidateQueries({ queryKey: ['daily-eval-params'] });
      };
      seed();
    }
  }, [parameters, companyId, queryClient]);

  // Init scores
  useEffect(() => {
    if (parameters && parameters.length > 0) {
      const init: Record<string, number> = {};
      parameters.forEach((p: any) => { if (!scores[p.id]) init[p.id] = 0; });
      if (Object.keys(init).length > 0) setScores(prev => ({ ...init, ...prev }));
    }
  }, [parameters]);

  // Duplicate check
  const { data: duplicate } = useQuery({
    queryKey: ['daily-eval-dup', myId, revieweeId, date ? format(date, 'yyyy-MM-dd') : ''],
    queryFn: async () => {
      const { data } = await supabase
        .from('daily_evaluations')
        .select('id')
        .eq('company_id', companyId!)
        .eq('reviewer_id', myId!)
        .eq('reviewee_id', revieweeId)
        .eq('date', format(date, 'yyyy-MM-dd'))
        .limit(1);
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!revieweeId && !!myId && !!companyId && !!date,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const activeParams = parameters || [];
      const paramScores = activeParams.map((p: any) => scores[p.id] || 0);
      const avg = paramScores.length > 0 ? paramScores.reduce((a: number, b: number) => a + b, 0) / paramScores.length : 0;

      // Get most recent active project for reviewee
      const { data: projectAssignment } = await supabase
        .from('project_assignments')
        .select('project_id')
        .eq('employee_id', revieweeId)
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false })
        .limit(1);

      const projectId = projectAssignment?.[0]?.project_id || null;

      const { data, error } = await supabase.from('daily_evaluations').insert({
        company_id: companyId!,
        reviewer_id: myId!,
        reviewee_id: revieweeId,
        direction,
        date: format(date, 'yyyy-MM-dd'),
        overall_score: Math.round(avg * 100) / 100,
        remarks: remarks || null,
        project_id: projectId,
      }).select('id').single();
      if (error) throw error;

      const scoreRows = activeParams.map((p: any) => ({
        daily_evaluation_id: data.id,
        company_id: companyId!,
        parameter_id: p.id,
        score: scores[p.id] || 0,
      }));
      if (scoreRows.length > 0) {
        const { error: sErr } = await supabase.from('daily_evaluation_scores').insert(scoreRows);
        if (sErr) throw sErr;
      }
    },
    onSuccess: () => {
      toast.success('Evaluation submitted');
      queryClient.invalidateQueries({ queryKey: ['daily-evaluations'] });
      navigate('/evaluations/daily');
    },
    onError: () => toast.error('Failed to submit evaluation'),
  });

  const allScored = (parameters || []).every((p: any) => scores[p.id] > 0);
  const canSave = revieweeId && date && allScored && !duplicate;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/evaluations/daily')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Submit Daily Evaluation</h1>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>{isJunior ? 'Select Team Lead to Evaluate' : 'Select Employee to Evaluate'} *</Label>
            <SearchableEmployeeSelect
              employees={selectableEmployees || []}
              value={revieweeId}
              onValueChange={setRevieweeId}
              placeholder="Select person"
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'dd MMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={d => d && setDate(d)}
                  disabled={d => d > new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <p className="text-xs text-muted-foreground">
            One evaluation per person per day. If you have already submitted an evaluation for this person today it will be shown below.
          </p>
        </CardContent>
      </Card>

      {duplicate && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have already submitted an evaluation for this person on this date.{' '}
            <Link to={`/evaluations/daily/${duplicate.id}`} className="underline font-medium">View it here →</Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isJunior ? 'Rate your Team Lead' : 'Rate the Employee'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {(parameters || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No parameters configured. Ask your admin to set up daily evaluation parameters.</p>
          ) : (
            (parameters || []).map((p: any) => (
              <div key={p.id} className="space-y-1">
                <Label>{p.name}</Label>
                <StarRating value={scores[p.id] || 0} onChange={v => setScores(prev => ({ ...prev, [p.id]: v }))} max={p.max_score} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card>
        <CardContent className="pt-6 space-y-2">
          <Label>Remarks</Label>
          <Textarea placeholder="Optional notes..." value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
        </CardContent>
      </Card>

      <Button onClick={() => saveMutation.mutate()} disabled={!canSave || saveMutation.isPending} className="w-full sm:w-auto">
        {saveMutation.isPending ? 'Submitting...' : 'Submit Evaluation'}
      </Button>
    </div>
  );
};

export default DailyEvaluationForm;
