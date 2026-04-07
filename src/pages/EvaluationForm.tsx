import { useState, useEffect } from 'react';
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ArrowLeft, Settings2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

const currentQuarter = () => {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
};

const PERIODS = [
  'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026',
  'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027',
  'H1 2026', 'H2 2026', 'H1 2027', 'H2 2027',
  'Annual 2026', 'Annual 2027', 'Custom',
];

const RECOMMENDATIONS = ['No Change', 'Increment', 'Promotion', 'PIP', 'Custom'];

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

const EvaluationForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const [employeeId, setEmployeeId] = useState('');
  const [period, setPeriod] = useState(currentQuarter());
  const [customPeriod, setCustomPeriod] = useState('');
  const [recommendation, setRecommendation] = useState('No Change');
  const [customRecommendation, setCustomRecommendation] = useState('');
  const [comments, setComments] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [manageOpen, setManageOpen] = useState(false);
  const [newParamName, setNewParamName] = useState('');

  // Fetch employees
  const { data: employees } = useQuery({
    queryKey: ['employees-active', companyId],
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

  // Fetch parameters
  const { data: parameters, isLoading: paramsLoading } = useQuery({
    queryKey: ['eval-parameters', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluation_parameters')
        .select('*')
        .eq('company_id', companyId!)
        .eq('evaluation_type', 'standard')
        .order('display_order');
      return data || [];
    },
    enabled: !!companyId,
  });

  // Seed defaults if none exist
  useEffect(() => {
    if (parameters && parameters.length === 0 && companyId) {
      const seed = async () => {
        const defaults = [
          { name: 'Performance', display_order: 1 },
          { name: 'Attendance', display_order: 2 },
          { name: 'Quality', display_order: 3 },
        ];
        for (const d of defaults) {
          await supabase.from('evaluation_parameters').insert({
            company_id: companyId,
            name: d.name,
            evaluation_type: 'standard',
            min_score: 1,
            max_score: 5,
            display_order: d.display_order,
            is_active: true,
          });
        }
        queryClient.invalidateQueries({ queryKey: ['eval-parameters'] });
      };
      seed();
    }
  }, [parameters, companyId, queryClient]);

  // Fetch existing evaluation for edit
  const { data: existing } = useQuery({
    queryKey: ['evaluation-edit', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('evaluations')
        .select('*, evaluation_scores(*)')
        .eq('id', id!)
        .eq('company_id', companyId!)
        .single();
      return data;
    },
    enabled: isEdit && !!companyId,
  });

  useEffect(() => {
    if (existing) {
      setEmployeeId(existing.employee_id);
      setPeriod(PERIODS.includes(existing.period) ? existing.period : 'Custom');
      if (!PERIODS.includes(existing.period)) setCustomPeriod(existing.period);
      setRecommendation(RECOMMENDATIONS.includes(existing.recommendation || '') ? existing.recommendation! : existing.recommendation ? 'Custom' : 'No Change');
      if (existing.recommendation && !RECOMMENDATIONS.includes(existing.recommendation)) setCustomRecommendation(existing.recommendation);
      setComments(existing.comments || '');
      const scoreMap: Record<string, number> = {};
      ((existing as any).evaluation_scores || []).forEach((s: any) => { scoreMap[s.parameter_id] = s.score; });
      setScores(scoreMap);
    }
  }, [existing]);

  const activeParams = (parameters || []).filter((p: any) => p.is_active);

  // Initialize scores for new params
  useEffect(() => {
    if (activeParams.length > 0 && !isEdit) {
      const init: Record<string, number> = {};
      activeParams.forEach((p: any) => { if (!scores[p.id]) init[p.id] = 0; });
      if (Object.keys(init).length > 0) setScores(prev => ({ ...init, ...prev }));
    }
  }, [activeParams, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const finalPeriod = period === 'Custom' ? customPeriod : period;
      const finalRec = recommendation === 'Custom' ? customRecommendation : recommendation;
      const paramScores = activeParams.map((p: any) => scores[p.id] || 0);
      const avg = paramScores.length > 0 ? paramScores.reduce((a: number, b: number) => a + b, 0) / paramScores.length : 0;

      if (isEdit) {
        const { error } = await supabase.from('evaluations').update({
          employee_id: employeeId,
          period: finalPeriod,
          overall_score: Math.round(avg * 100) / 100,
          recommendation: finalRec,
          comments,
        }).eq('id', id!).eq('company_id', companyId!);
        if (error) throw error;

        // Delete old scores and re-insert
        await supabase.from('evaluation_scores').delete().eq('evaluation_id', id!).eq('company_id', companyId!);
        const scoreRows = activeParams.map((p: any) => ({
          evaluation_id: id!,
          company_id: companyId!,
          parameter_id: p.id,
          score: scores[p.id] || 0,
        }));
        if (scoreRows.length > 0) {
          const { error: sErr } = await supabase.from('evaluation_scores').insert(scoreRows);
          if (sErr) throw sErr;
        }
        return id;
      } else {
        const { data, error } = await supabase.from('evaluations').insert({
          company_id: companyId!,
          employee_id: employeeId,
          evaluated_by: employee!.employee_id,
          period: finalPeriod,
          overall_score: Math.round(avg * 100) / 100,
          recommendation: finalRec,
          comments,
        }).select('id').single();
        if (error) throw error;

        const scoreRows = activeParams.map((p: any) => ({
          evaluation_id: data.id,
          company_id: companyId!,
          parameter_id: p.id,
          score: scores[p.id] || 0,
        }));
        if (scoreRows.length > 0) {
          const { error: sErr } = await supabase.from('evaluation_scores').insert(scoreRows);
          if (sErr) throw sErr;
        }
        return data.id;
      }
    },
    onSuccess: (evalId) => {
      toast.success('Evaluation saved successfully');
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      navigate(`/evaluations/${evalId}`);
    },
    onError: () => toast.error('Failed to save evaluation'),
  });

  // Manage parameters mutations
  const addParamMutation = useMutation({
    mutationFn: async (name: string) => {
      const maxOrder = (parameters || []).reduce((max: number, p: any) => Math.max(max, p.display_order), 0);
      const { error } = await supabase.from('evaluation_parameters').insert({
        company_id: companyId!,
        name,
        evaluation_type: 'standard',
        min_score: 1,
        max_score: 5,
        display_order: maxOrder + 1,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eval-parameters'] });
      setNewParamName('');
    },
  });

  const toggleParamMutation = useMutation({
    mutationFn: async ({ paramId, active }: { paramId: string; active: boolean }) => {
      const { error } = await supabase.from('evaluation_parameters')
        .update({ is_active: active })
        .eq('id', paramId)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eval-parameters'] }),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ paramId, newOrder }: { paramId: string; newOrder: number }) => {
      const { error } = await supabase.from('evaluation_parameters')
        .update({ display_order: newOrder })
        .eq('id', paramId)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eval-parameters'] }),
  });

  const handleReorder = (paramId: string, direction: 'up' | 'down') => {
    const sorted = [...(parameters || [])].sort((a: any, b: any) => a.display_order - b.display_order);
    const idx = sorted.findIndex((p: any) => p.id === paramId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const orderA = sorted[idx].display_order;
    const orderB = sorted[swapIdx].display_order;
    reorderMutation.mutate({ paramId: sorted[idx].id, newOrder: orderB });
    reorderMutation.mutate({ paramId: sorted[swapIdx].id, newOrder: orderA });
  };

  const canSave = employeeId && (period !== 'Custom' || customPeriod.trim());

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/evaluations')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit Evaluation' : 'Create Evaluation'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Employee & Period */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Employee *</Label>
                <SearchableEmployeeSelect
                  employees={employees || []}
                  value={employeeId}
                  onValueChange={setEmployeeId}
                  placeholder="Select employee"
                />
              </div>

              <div className="space-y-2">
                <Label>Period *</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {period === 'Custom' && (
                  <Input placeholder="Enter custom period" value={customPeriod} onChange={e => setCustomPeriod(e.target.value)} className="mt-2" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parameter Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evaluation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {paramsLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : activeParams.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active parameters. Add some using Manage Parameters.</p>
              ) : (
                activeParams.map((p: any) => (
                  <div key={p.id} className="space-y-1">
                    <Label>{p.name}</Label>
                    <StarRating value={scores[p.id] || 0} onChange={v => setScores(prev => ({ ...prev, [p.id]: v }))} max={p.max_score} />
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" onClick={() => setManageOpen(true)}>
                <Settings2 className="h-4 w-4 mr-2" /> Manage Parameters
              </Button>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Label>Comments</Label>
              <Textarea placeholder="Add notes or observations..." value={comments} onChange={e => setComments(e.target.value)} rows={4} />
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Label>Recommendation</Label>
              <Select value={recommendation} onValueChange={setRecommendation}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RECOMMENDATIONS.map(r => <SelectItem key={r} value={r}>{r === 'PIP' ? 'PIP (Performance Improvement Plan)' : r}</SelectItem>)}
                </SelectContent>
              </Select>
              {recommendation === 'Custom' && (
                <Input placeholder="Enter custom recommendation" value={customRecommendation} onChange={e => setCustomRecommendation(e.target.value)} className="mt-2" />
              )}
            </CardContent>
          </Card>

          <Button onClick={() => saveMutation.mutate()} disabled={!canSave || saveMutation.isPending} className="w-full sm:w-auto">
            {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Evaluation' : 'Save Evaluation'}
          </Button>
        </div>

        {/* Attendance mock card */}
        <div>
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Attendance Overview (sample data)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Days Present</span><span className="font-medium">18</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Days Absent</span><span className="font-medium">2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Late Arrivals</span><span className="font-medium">3</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total OT Hours</span><span className="font-medium">12.5</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manage Parameters Modal */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Evaluation Parameters</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {(parameters || []).sort((a: any, b: any) => a.display_order - b.display_order).map((p: any, idx: number) => (
              <div key={p.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleReorder(p.id, 'up')} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleReorder(p.id, 'down')} disabled={idx === (parameters || []).length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className={`text-sm ${!p.is_active ? 'text-muted-foreground line-through' : ''}`}>{p.name}</span>
                </div>
                <Switch checked={p.is_active} onCheckedChange={checked => toggleParamMutation.mutate({ paramId: p.id, active: checked })} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input placeholder="New parameter name" value={newParamName} onChange={e => setNewParamName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newParamName.trim()) addParamMutation.mutate(newParamName.trim()); }} />
            <Button size="sm" disabled={!newParamName.trim() || addParamMutation.isPending}
              onClick={() => newParamName.trim() && addParamMutation.mutate(newParamName.trim())}>Add</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationForm;
