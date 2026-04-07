import { useState, useEffect, useRef, DragEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Plus, Pencil, Trash2, Check, X, RefreshCw, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  company_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

interface LineItem {
  id: string;
  company_id: string;
  category_id: string;
  description: string;
  is_recurring: boolean;
  display_order: number;
  is_active: boolean;
}

const FORTE_SEED: { name: string; items: { description: string; is_recurring: boolean }[] }[] = [
  {
    name: 'Office Expenses',
    items: [
      { description: 'Office Rent', is_recurring: true },
      { description: 'Electricity Bill', is_recurring: true },
      { description: 'Transworld Internet', is_recurring: true },
      { description: 'Water/Sanitary Bill', is_recurring: true },
      { description: 'Drinking Water Bill', is_recurring: true },
      { description: 'Petrol', is_recurring: true },
      { description: 'Gas', is_recurring: true },
      { description: 'Kitchen Expenses', is_recurring: true },
    ],
  },
  {
    name: 'BD Expenses',
    items: [{ description: 'Subscriptions', is_recurring: true }],
  },
  { name: 'Recreational Expenses', items: [] },
  { name: 'Assets', items: [] },
];

const ExpenseCategoriesTab = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [addingItemForCategory, setAddingItemForCategory] = useState<string | null>(null);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemRecurring, setNewItemRecurring] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemDescription, setEditItemDescription] = useState('');
  const [editItemRecurring, setEditItemRecurring] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'item'; id: string; name: string } | null>(null);

  // Drag state
  const [dragType, setDragType] = useState<'category' | 'item' | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!companyId) return;
    setLoading(true);
    const [catRes, itemRes] = await Promise.all([
      supabase.from('expense_categories').select('*').eq('company_id', companyId).eq('is_active', true).order('display_order'),
      supabase.from('expense_line_items').select('*').eq('company_id', companyId).eq('is_active', true).order('display_order'),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (itemRes.data) setLineItems(itemRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [companyId]);

  useEffect(() => {
    if (!loading && categories.length === 0 && companyId && !seeding) seedDefaults();
  }, [loading, categories.length, companyId]);

  const seedDefaults = async () => {
    if (!companyId) return;
    setSeeding(true);
    try {
      for (let ci = 0; ci < FORTE_SEED.length; ci++) {
        const seed = FORTE_SEED[ci];
        const { data: cat } = await supabase.from('expense_categories').insert({ company_id: companyId, name: seed.name, display_order: ci }).select().single();
        if (cat && seed.items.length > 0) {
          await supabase.from('expense_line_items').insert(
            seed.items.map((item, ii) => ({ company_id: companyId, category_id: cat.id, description: item.description, is_recurring: item.is_recurring, display_order: ii }))
          );
        }
      }
      toast.success('Default expense categories seeded');
      await fetchData();
    } catch { toast.error('Failed to seed defaults'); }
    setSeeding(false);
  };

  // ——— Drag & Drop for categories ———
  const handleCategoryDragStart = (e: DragEvent, id: string) => {
    setDragType('category');
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e: DragEvent, id: string) => {
    if (dragType !== 'category' || dragId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  };

  const handleCategoryDrop = async (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (dragType !== 'category' || !dragId || dragId === targetId || !companyId) return;
    const fromIdx = categories.findIndex(c => c.id === dragId);
    const toIdx = categories.findIndex(c => c.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    // Reorder locally
    const reordered = [...categories];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Assign sequential display_order
    const updates = reordered.map((c, i) => ({ id: c.id, display_order: i }));
    setCategories(reordered.map((c, i) => ({ ...c, display_order: i })));
    setDragId(null);
    setDragOverId(null);
    setDragType(null);

    await Promise.all(updates.map(u =>
      supabase.from('expense_categories').update({ display_order: u.display_order }).eq('id', u.id).eq('company_id', companyId)
    ));
  };

  // ——— Drag & Drop for line items ———
  const handleItemDragStart = (e: DragEvent, id: string) => {
    setDragType('item');
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: DragEvent, id: string) => {
    if (dragType !== 'item' || dragId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  };

  const handleItemDrop = async (e: DragEvent, targetId: string, categoryId: string) => {
    e.preventDefault();
    if (dragType !== 'item' || !dragId || dragId === targetId || !companyId) return;
    const catItems = lineItems.filter(i => i.category_id === categoryId);
    const fromIdx = catItems.findIndex(i => i.id === dragId);
    const toIdx = catItems.findIndex(i => i.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const reordered = [...catItems];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updates = reordered.map((item, i) => ({ id: item.id, display_order: i }));
    setLineItems(prev => {
      const others = prev.filter(i => i.category_id !== categoryId);
      return [...others, ...reordered.map((item, i) => ({ ...item, display_order: i }))].sort((a, b) => a.display_order - b.display_order);
    });
    setDragId(null);
    setDragOverId(null);
    setDragType(null);

    await Promise.all(updates.map(u =>
      supabase.from('expense_line_items').update({ display_order: u.display_order }).eq('id', u.id).eq('company_id', companyId)
    ));
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
    setDragType(null);
  };

  // ——— Category CRUD ———
  const addCategory = async () => {
    if (!newCategoryName.trim() || !companyId) return;
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.display_order), -1);
    const { error } = await supabase.from('expense_categories').insert({ company_id: companyId, name: newCategoryName.trim(), display_order: maxOrder + 1 });
    if (error) { toast.error('Failed to add category'); return; }
    toast.success('Category added');
    setNewCategoryName('');
    setShowAddCategory(false);
    fetchData();
  };

  const saveEditCategory = async () => {
    if (!editingCategoryId || !editCategoryName.trim() || !companyId) return;
    const { error } = await supabase.from('expense_categories').update({ name: editCategoryName.trim(), updated_at: new Date().toISOString() }).eq('id', editingCategoryId).eq('company_id', companyId);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Category updated');
    setEditingCategoryId(null);
    fetchData();
  };

  // ——— Line Item CRUD ———
  const addLineItem = async () => {
    if (!addingItemForCategory || !newItemDescription.trim() || !companyId) return;
    const catItems = lineItems.filter(i => i.category_id === addingItemForCategory);
    const maxOrder = catItems.reduce((m, i) => Math.max(m, i.display_order), -1);
    const { error } = await supabase.from('expense_line_items').insert({ company_id: companyId, category_id: addingItemForCategory, description: newItemDescription.trim(), is_recurring: newItemRecurring, display_order: maxOrder + 1 });
    if (error) { toast.error('Failed to add line item'); return; }
    toast.success('Line item added');
    setNewItemDescription('');
    setNewItemRecurring(true);
    setAddingItemForCategory(null);
    fetchData();
  };

  const saveEditItem = async () => {
    if (!editingItemId || !editItemDescription.trim() || !companyId) return;
    const { error } = await supabase.from('expense_line_items').update({ description: editItemDescription.trim(), is_recurring: editItemRecurring, updated_at: new Date().toISOString() }).eq('id', editingItemId).eq('company_id', companyId);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Line item updated');
    setEditingItemId(null);
    fetchData();
  };

  // ——— Soft delete ———
  const confirmDelete = async () => {
    if (!deleteTarget || !companyId) return;
    const table = deleteTarget.type === 'category' ? 'expense_categories' : 'expense_line_items';
    const { error } = await supabase.from(table).update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', deleteTarget.id).eq('company_id', companyId);
    if (error) { toast.error('Failed to delete'); }
    else { toast.success(`${deleteTarget.type === 'category' ? 'Category' : 'Line item'} removed`); }
    setDeleteTarget(null);
    fetchData();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>Loading expense categories…</p>;
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>Expense Categories</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Define categories and recurring line items that pre-fill the monthly Finance Sheet.</p>
        </div>
        <Button size="sm" onClick={() => setShowAddCategory(true)} className="gap-1.5 text-[13px]">
          <Plus className="h-3.5 w-3.5" /> Add Category
        </Button>
      </div>

      {showAddCategory && (
        <div className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30">
          <Input placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCategory()} className="max-w-xs text-[13px] h-8" autoFocus />
          <Button size="sm" variant="default" onClick={addCategory} className="h-8 px-3"><Check className="h-3.5 w-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="h-8 px-3"><X className="h-3.5 w-3.5" /></Button>
        </div>
      )}

      {categories.length === 0 && !showAddCategory && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {seeding ? (
            <div className="flex items-center justify-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Seeding default categories…</div>
          ) : 'No expense categories defined yet.'}
        </div>
      )}

      <Accordion type="multiple" className="space-y-2">
        {categories.map((cat) => {
          const catItems = lineItems.filter(i => i.category_id === cat.id);
          const isEditing = editingCategoryId === cat.id;
          const isDragOver = dragType === 'category' && dragOverId === cat.id && dragId !== cat.id;

          return (
            <AccordionItem
              key={cat.id}
              value={cat.id}
              className={`border rounded-md px-1 transition-colors ${isDragOver ? 'border-primary bg-primary/5' : ''} ${dragId === cat.id && dragType === 'category' ? 'opacity-50' : ''}`}
              draggable={!isEditing}
              onDragStart={(e) => handleCategoryDragStart(e, cat.id)}
              onDragOver={(e) => handleCategoryDragOver(e, cat.id)}
              onDrop={(e) => handleCategoryDrop(e, cat.id)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center gap-1">
                <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-4 w-4" />
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 py-2">
                    <Input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEditCategory()} className="max-w-xs text-[13px] h-8" autoFocus />
                    <Button size="sm" variant="default" onClick={saveEditCategory} className="h-8 px-3"><Check className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCategoryId(null)} className="h-8 px-3"><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ) : (
                  <AccordionTrigger className="flex-1 text-[13px] font-medium hover:no-underline">
                    <span className="flex items-center gap-2">
                      {cat.name}
                      <Badge variant="secondary" className="text-[11px] font-normal">{catItems.length} item{catItems.length !== 1 ? 's' : ''}</Badge>
                    </span>
                  </AccordionTrigger>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-0.5 mr-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditingCategoryId(cat.id); setEditCategoryName(cat.name); }} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'category', id: cat.id, name: cat.name }); }} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <AccordionContent>
                <div className="space-y-1 pl-6">
                  {catItems.map((item) => {
                    const isItemEditing = editingItemId === item.id;
                    const isItemDragOver = dragType === 'item' && dragOverId === item.id && dragId !== item.id;

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 group transition-colors ${isItemDragOver ? 'bg-primary/5 ring-1 ring-primary/30' : ''} ${dragId === item.id && dragType === 'item' ? 'opacity-50' : ''}`}
                        draggable={!isItemEditing}
                        onDragStart={(e) => { e.stopPropagation(); handleItemDragStart(e, item.id); }}
                        onDragOver={(e) => { e.stopPropagation(); handleItemDragOver(e, item.id); }}
                        onDrop={(e) => { e.stopPropagation(); handleItemDrop(e, item.id, cat.id); }}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-3.5 w-3.5" />
                        </div>

                        {isItemEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input value={editItemDescription} onChange={(e) => setEditItemDescription(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEditItem()} className="max-w-xs text-[13px] h-7" autoFocus />
                            <div className="flex items-center gap-1.5">
                              <Switch checked={editItemRecurring} onCheckedChange={setEditItemRecurring} className="scale-75" />
                              <span className="text-[11px] text-muted-foreground">Recurring</span>
                            </div>
                            <Button size="sm" variant="default" onClick={saveEditItem} className="h-7 px-2"><Check className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingItemId(null)} className="h-7 px-2"><X className="h-3 w-3" /></Button>
                          </div>
                        ) : (
                          <>
                            <span className="text-[13px] text-foreground flex-1">{item.description}</span>
                            {item.is_recurring && (
                              <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0">Recurring</Badge>
                            )}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingItemId(item.id); setEditItemDescription(item.description); setEditItemRecurring(item.is_recurring); }} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent">
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button onClick={() => setDeleteTarget({ type: 'item', id: item.id, name: item.description })} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {addingItemForCategory === cat.id ? (
                    <div className="flex items-center gap-2 py-2 px-2">
                      <Input placeholder="Line item description" value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLineItem()} className="max-w-xs text-[13px] h-7" autoFocus />
                      <div className="flex items-center gap-1.5">
                        <Switch checked={newItemRecurring} onCheckedChange={setNewItemRecurring} className="scale-75" />
                        <span className="text-[11px] text-muted-foreground">Recurring</span>
                      </div>
                      <Button size="sm" variant="default" onClick={addLineItem} className="h-7 px-2"><Check className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddingItemForCategory(null); setNewItemDescription(''); setNewItemRecurring(true); }} className="h-7 px-2"><X className="h-3 w-3" /></Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => { setAddingItemForCategory(cat.id); setNewItemDescription(''); setNewItemRecurring(true); }} className="text-[12px] text-muted-foreground hover:text-foreground gap-1 mt-1">
                      <Plus className="h-3 w-3" /> Add Line Item
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === 'category' ? 'Category' : 'Line Item'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.name}</strong>?
              {deleteTarget?.type === 'category' && ' All line items under this category will also be hidden.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseCategoriesTab;
