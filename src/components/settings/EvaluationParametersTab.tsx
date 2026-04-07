import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ParamSectionProps {
  title: string;
  evaluationType: string;
  direction?: string;
  companyId: string;
}

const ParamSection = ({ title, evaluationType, direction, companyId }: ParamSectionProps) => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');

  const queryKey = ['eval-params-settings', companyId, evaluationType, direction || 'none'];

  const { data: parameters } = useQuery({
    queryKey,
    queryFn: async () => {
      let q = supabase
        .from('evaluation_parameters')
        .select('*')
        .eq('company_id', companyId)
        .eq('evaluation_type', evaluationType)
        .order('display_order');
      if (direction) q = q.eq('direction', direction);
      else q = q.is('direction', null);
      const { data } = await q;
      return data || [];
    },
    enabled: !!companyId,
  });

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const maxOrder = (parameters || []).reduce((max: number, p: any) => Math.max(max, p.display_order), 0);
      const { error } = await supabase.from('evaluation_parameters').insert({
        company_id: companyId,
        name,
        evaluation_type: evaluationType,
        direction: direction || null,
        min_score: 1,
        max_score: 5,
        display_order: maxOrder + 1,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewName('');
      toast.success('Parameter added');
    },
    onError: () => toast.error('Failed to add parameter'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('evaluation_parameters')
        .update({ is_active: active })
        .eq('id', id)
        .eq('company_id', companyId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase.from('evaluation_parameters')
        .update({ display_order: newOrder })
        .eq('id', id)
        .eq('company_id', companyId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const handleReorder = (paramId: string, dir: 'up' | 'down') => {
    const sorted = [...(parameters || [])].sort((a: any, b: any) => a.display_order - b.display_order);
    const idx = sorted.findIndex((p: any) => p.id === paramId);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    const orderA = sorted[idx].display_order;
    const orderB = sorted[swapIdx].display_order;
    reorderMutation.mutate({ id: sorted[idx].id, newOrder: orderB });
    reorderMutation.mutate({ id: sorted[swapIdx].id, newOrder: orderA });
  };

  const sorted = [...(parameters || [])].sort((a: any, b: any) => a.display_order - b.display_order);

  return (
    <div className="space-y-3">
      <h4 className="text-[13px] font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
        {title}
      </h4>
      <div className="space-y-2">
        {sorted.map((p: any, idx: number) => (
          <div key={p.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleReorder(p.id, 'up')} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button onClick={() => handleReorder(p.id, 'down')} disabled={idx === sorted.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
              <span className={`text-sm ${p.is_active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                {p.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`toggle-${p.id}`} className="text-xs text-muted-foreground">
                {p.is_active ? 'Active' : 'Inactive'}
              </Label>
              <Switch
                id={`toggle-${p.id}`}
                checked={p.is_active}
                onCheckedChange={v => toggleMutation.mutate({ id: p.id, active: v })}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New parameter name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="max-w-[240px]"
          onKeyDown={e => {
            if (e.key === 'Enter' && newName.trim()) addMutation.mutate(newName.trim());
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => newName.trim() && addMutation.mutate(newName.trim())}
          disabled={!newName.trim() || addMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

const EvaluationParametersTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  if (!companyId) return null;

  return (
    <div className="space-y-8">
      {/* Quarterly Parameters */}
      <div className="bg-card rounded-[14px] border p-6">
        <h3 className="font-semibold text-[15px] text-foreground mb-4" style={{ fontFamily: 'var(--ff-display)' }}>
          Quarterly Evaluation Parameters
        </h3>
        <ParamSection
          title="Standard Parameters"
          evaluationType="standard"
          companyId={companyId}
        />
      </div>

      {/* Daily Parameters */}
      <div className="bg-card rounded-[14px] border p-6 space-y-6">
        <h3 className="font-semibold text-[15px] text-foreground mb-2" style={{ fontFamily: 'var(--ff-display)' }}>
          Daily Evaluation Parameters
        </h3>
        <ParamSection
          title="Team Lead → Employee (Senior to Junior)"
          evaluationType="daily"
          direction="senior_to_junior"
          companyId={companyId}
        />
        <div className="border-t pt-6" style={{ borderColor: 'hsl(var(--border))' }}>
          <ParamSection
            title="Employee → Team Lead (Junior to Senior)"
            evaluationType="daily"
            direction="junior_to_senior"
            companyId={companyId}
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationParametersTab;
