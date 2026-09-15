import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Archive, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ClientCategoriesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryKey = ['client-categories-settings', companyId];

  const { data: categories, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_categories')
        .select('*')
        .eq('company_id', companyId!)
        .order('display_order')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const maxOrder = (categories || []).reduce((max: number, c: any) => Math.max(max, c.display_order ?? 0), 0);
      const { error } = await supabase.from('client_categories').insert({
        company_id: companyId!,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        is_active: true,
        display_order: maxOrder + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['client-categories'] });
      setDialogOpen(false);
      setName('');
      setCode('');
      setErrors({});
      toast.success('Category added');
    },
    onError: (e: any) => {
      if (e?.code === '23505' || `${e?.message}`.toLowerCase().includes('duplicate')) {
        setErrors({ code: 'This code is already in use' });
      } else {
        toast.error(e?.message || 'Failed to add category');
      }
    },
  });

  const setActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('client_categories')
        .update({ is_active: active })
        .eq('id', id)
        .eq('company_id', companyId!);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['client-categories'] });
      toast.success(v.active ? 'Category restored' : 'Category archived');
    },
    onError: () => toast.error('Failed to update category'),
  });

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!code.trim()) errs.code = 'Code is required';
    const dup = (categories || []).some((c: any) => c.code?.toUpperCase() === code.trim().toUpperCase());
    if (!errs.code && dup) errs.code = 'This code is already in use';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addMutation.mutate();
  };

  if (!companyId) return null;

  return (
    <div className="bg-card rounded-[14px] border p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-[15px] text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
          Client Categories
        </h3>
        <Button size="sm" variant="outline" onClick={() => { setName(''); setCode(''); setErrors({}); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (categories || []).length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No categories yet — add your first one</p>
      ) : (
        <div className="rounded-[12px] border overflow-x-auto" style={{ borderColor: 'hsl(var(--border))' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(categories || []).map((c: any) => (
                <TableRow key={c.id} className={c.is_active ? '' : 'opacity-50'}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-sm">{c.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.is_active ? 'Active' : 'Archived'}</TableCell>
                  <TableCell className="text-right">
                    {c.is_active ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Archive"
                        onClick={() => setActiveMutation.mutate({ id: c.id, active: false })}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        title="Restore"
                        onClick={() => setActiveMutation.mutate({ id: c.id, active: true })}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) setDialogOpen(false); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Client Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input value={name} onChange={e => { setName(e.target.value); setErrors({}); }} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Code *</Label>
              <Input
                value={code}
                maxLength={6}
                onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 6)); setErrors({}); }}
              />
              {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientCategoriesTab;
