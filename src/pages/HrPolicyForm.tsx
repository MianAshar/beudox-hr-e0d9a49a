import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/hr-policies/RichTextEditor';

const HrPolicyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishNow, setPublishNow] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['hr-policy', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_documents')
        .select('*')
        .eq('id', id!)
        .eq('company_id', employee!.company_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit && !!employee?.company_id,
  });

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
    }
  }, [existing]);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content.trim()) { toast.error('Content is required'); return; }
    setSaving(true);

    try {
      if (isEdit && existing) {
        // Mark current version as not current
        await supabase
          .from('hr_documents')
          .update({ is_current: false })
          .eq('id', existing.id)
          .eq('company_id', employee!.company_id);

        // Insert new version
        const { data, error } = await supabase
          .from('hr_documents')
          .insert({
            company_id: employee!.company_id,
            title: title.trim(),
            document_type: 'policy',
            content,
            version_number: existing.version_number + 1,
            is_current: true,
            designation: existing.designation,
            published_at: publishNow ? new Date().toISOString() : null,
            created_by: employee!.employee_id,
          })
          .select()
          .single();

        if (error) throw error;
        toast.success(`Policy saved as v${existing.version_number + 1}`);
        queryClient.invalidateQueries({ queryKey: ['hr-policies'] });
        queryClient.invalidateQueries({ queryKey: ['hr-policy'] });
        navigate(`/hr-policies/${data.id}`);
      } else {
        // Create new policy
        const { data, error } = await supabase
          .from('hr_documents')
          .insert({
            company_id: employee!.company_id,
            title: title.trim(),
            document_type: 'policy',
            content,
            version_number: 1,
            is_current: true,
            published_at: publishNow ? new Date().toISOString() : null,
            created_by: employee!.employee_id,
          })
          .select()
          .single();

        if (error) throw error;
        toast.success('Policy created');
        queryClient.invalidateQueries({ queryKey: ['hr-policies'] });
        navigate(`/hr-policies/${data.id}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(isEdit ? `/hr-policies/${id}` : '/hr-policies')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {isEdit ? 'Back to Policy' : 'Back to Policies'}
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Edit Policy' : 'New Policy'}
        </h1>
        {isEdit && existing && (
          <p className="text-sm text-muted-foreground mt-1">
            Currently v{existing.version_number}, saving as v{existing.version_number + 1}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Policy title"
          />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="publish" checked={publishNow} onCheckedChange={setPublishNow} />
          <Label htmlFor="publish">Publish immediately</Label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {publishNow ? 'Save & Publish' : 'Save as Draft'}
        </Button>
        <Button variant="outline" onClick={() => navigate(isEdit ? `/hr-policies/${id}` : '/hr-policies')}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default HrPolicyForm;
