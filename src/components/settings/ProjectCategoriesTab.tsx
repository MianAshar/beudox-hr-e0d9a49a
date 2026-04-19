import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

interface Category {
  id: string;
  company_id: string;
  name: string;
  is_active: boolean;
}

const ProjectCategoriesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchData = async () => {
    if (!companyId) return;
    setLoading(true);
    const { data } = await supabase
      .from('project_categories')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('name');
    if (data) setCategories(data as Category[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [companyId]);

  const addCategory = async () => {
    if (!newName.trim() || !companyId) return;
    const { error } = await supabase
      .from('project_categories')
      .insert({ company_id: companyId, name: newName.trim() });
    if (error) { toast.error('Failed to add category'); return; }
    toast.success('Category added');
    setNewName('');
    setShowAdd(false);
    fetchData();
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim() || !companyId) {
      setEditingId(null);
      return;
    }
    const original = categories.find(c => c.id === id);
    if (original && original.name === editName.trim()) {
      setEditingId(null);
      return;
    }
    const { error } = await supabase
      .from('project_categories')
      .update({ name: editName.trim() })
      .eq('id', id)
      .eq('company_id', companyId);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Category updated');
    setEditingId(null);
    fetchData();
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !companyId) return;
    const { error } = await supabase
      .from('project_categories')
      .update({ is_active: false })
      .eq('id', deleteTarget.id)
      .eq('company_id', companyId);
    if (error) { toast.error('Failed to delete'); }
    else { toast.success('Category removed'); }
    setDeleteTarget(null);
    fetchData();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>Loading project categories…</p>;
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>Project Categories</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Define categories that appear in the Category dropdown when adding or editing a project.</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 text-[13px]">
          <Plus className="h-3.5 w-3.5" /> Add Category
        </Button>
      </div>

      {showAdd && (
        <div className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addCategory();
              if (e.key === 'Escape') { setShowAdd(false); setNewName(''); }
            }}
            className="max-w-xs text-[13px] h-8"
            autoFocus
          />
          <Button size="sm" variant="default" onClick={addCategory} className="h-8 px-3"><Check className="h-3.5 w-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewName(''); }} className="h-8 px-3"><X className="h-3.5 w-3.5" /></Button>
        </div>
      )}

      {categories.length === 0 && !showAdd ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No project categories defined yet.
        </div>
      ) : (
        <div className="rounded-[14px] border bg-card overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
            {categories.map((cat) => {
              const isEditing = editingId === cat.id;
              return (
                <div key={cat.id} className="flex items-center gap-2 px-4 py-2.5 group hover:bg-muted/30 transition-colors">
                  {isEditing ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => saveEdit(cat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(cat.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="max-w-xs text-[13px] h-8"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-[13px] text-foreground">{cat.name}</span>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove project category?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" will no longer appear in the Category dropdown. Existing projects using it will keep their reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectCategoriesTab;
