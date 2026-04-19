import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/hr-policies/RichTextEditor';

const JobDescriptionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['job-description', id],
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

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content.trim()) { toast.error('Content is required'); return; }
    setSaving(true);

    try {
      if (isEdit && existing) {
        // Versioning rule: only publishing a previously published JD creates a new version.
        const wasPublished = !!existing.published_at;
        if (publish && wasPublished) {
          // Mark current as not current, insert new version.
          await supabase
            .from('hr_documents')
            .update({ is_current: false })
            .eq('id', existing.id)
            .eq('company_id', employee!.company_id);

          const { data, error } = await supabase
            .from('hr_documents')
            .insert({
              company_id: employee!.company_id,
              title: title.trim(),
              document_type: 'jd',
              content,
              version_number: existing.version_number + 1,
              is_current: true,
              designation: existing.designation,
              published_at: new Date().toISOString(),
              created_by: employee!.employee_id,
            })
            .select()
            .single();
          if (error) throw error;
          toast.success(`Published as v${existing.version_number + 1}`);
          queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
          queryClient.invalidateQueries({ queryKey: ['job-description'] });
          navigate(`/job-descriptions/${data.id}`);
        } else {
          // Update in place — drafts and first publish keep version_number.
          const { error } = await supabase
            .from('hr_documents')
            .update({
              title: title.trim(),
              content,
              published_at: publish ? new Date().toISOString() : existing.published_at,
              updated_by: employee!.employee_id,
            })
            .eq('id', existing.id)
            .eq('company_id', employee!.company_id);
          if (error) throw error;
          toast.success(publish ? 'Job description published' : 'Draft saved');
          queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
          queryClient.invalidateQueries({ queryKey: ['job-description'] });
          navigate(`/job-descriptions/${existing.id}`);
        }
      } else {
        const { data, error } = await supabase
          .from('hr_documents')
          .insert({
            company_id: employee!.company_id,
            title: title.trim(),
            document_type: 'jd',
            content,
            version_number: 1,
            is_current: true,
            published_at: publish ? new Date().toISOString() : null,
            created_by: employee!.employee_id,
          })
          .select()
          .single();
        if (error) throw error;
        toast.success(publish ? 'Job description published' : 'Draft saved');
        queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
        navigate(`/job-descriptions/${data.id}`);
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
      <Button variant="ghost" size="sm" onClick={() => navigate(isEdit ? `/job-descriptions/${id}` : '/job-descriptions')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {isEdit ? 'Back to JD' : 'Back to Job Descriptions'}
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Edit Job Description' : 'New Job Description'}
        </h1>
        {isEdit && existing?.published_at && (
          <p className="text-sm text-muted-foreground mt-1">
            Currently v{existing.version_number}. Publishing will create v{existing.version_number + 1}.
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
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save as Draft
        </Button>
        <Button onClick={() => handleSave(true)} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Publish
        </Button>
        <Button variant="ghost" onClick={() => navigate(isEdit ? `/job-descriptions/${id}` : '/job-descriptions')}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default JobDescriptionForm;
