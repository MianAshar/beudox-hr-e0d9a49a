import { useState, DragEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Plus } from 'lucide-react';
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
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  const sorted = [...(parameters || [])].sort((a: any, b: any) => a.display_order - b.display_order);

  const handleDragStart = (e: DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, id: string) => {
    if (dragId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  };

  const handleDrop = async (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const fromIdx = sorted.findIndex(p => p.id === dragId);
    const toIdx = sorted.findIndex(p => p.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const reordered = [...sorted];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updates = reordered.map((p, i) => ({ id: p.id, display_order: i }));
    setDragId(null);
    setDragOverId(null);

    await Promise.all(updates.map(u =>
      supabase.from('evaluation_parameters').update({ display_order: u.display_order }).eq('id', u.id).eq('company_id', companyId)
    ));
    queryClient.invalidateQueries({ queryKey });
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-[13px] font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
        {title}
      </h4>
      <div className="space-y-2">
        {sorted.map((p: any) => (
          <div
            key={p.id}
            className={`flex items-center justify-between gap-3 py-2 px-3 bg-muted/50 rounded-lg transition-colors ${dragOverId === p.id && dragId !== p.id ? 'ring-1 ring-primary/30 bg-primary/5' : ''} ${dragId === p.id ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, p.id)}
            onDragOver={(e) => handleDragOver(e, p.id)}
            onDrop={(e) => handleDrop(e, p.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="h-4 w-4" />
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
