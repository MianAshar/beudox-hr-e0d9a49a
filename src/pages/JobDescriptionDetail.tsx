import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Edit, Archive, ChevronDown, Eye } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';

const JobDescriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const queryClient = useQueryClient();
  const [archiving, setArchiving] = useState(false);
  const [viewVersionId, setViewVersionId] = useState<string | null>(null);

  const isManager = employee?.role_name === 'hr_manager' || employee?.role_name === 'ceo';

  const { data: jd, isLoading } = useQuery({
    queryKey: ['job-description', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_documents')
        .select('*, created_by_employee:employees!hr_documents_created_by_fkey(full_name)')
        .eq('id', id!)
        .eq('company_id', employee!.company_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!employee?.company_id,
  });

  const { data: versions } = useQuery({
    queryKey: ['job-description-versions', jd?.title],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_documents')
        .select('id, version_number, created_at, is_current, published_at, created_by_employee:employees!hr_documents_created_by_fkey(full_name)')
        .eq('company_id', employee!.company_id)
        .eq('document_type', 'jd')
        .eq('title', jd!.title)
        .order('version_number', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!jd?.title && isManager,
  });

  const { data: versionContent } = useQuery({
    queryKey: ['job-description-version-content', viewVersionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_documents')
        .select('title, content, version_number, published_at')
        .eq('id', viewVersionId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!viewVersionId,
  });

  const handleArchive = async () => {
    if (!jd) return;
    setArchiving(true);
    const { error } = await supabase
      .from('hr_documents')
      .update({ published_at: null, updated_by: employee!.employee_id })
      .eq('id', jd.id)
      .eq('company_id', employee!.company_id);
    setArchiving(false);
    if (error) { toast.error('Failed to archive'); return; }
    toast.success('Job description archived');
    queryClient.invalidateQueries({ queryKey: ['job-description', id] });
    queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
  };

  const handlePublish = async () => {
    if (!jd) return;
    const { error } = await supabase
      .from('hr_documents')
      .update({ published_at: new Date().toISOString(), updated_by: employee!.employee_id })
      .eq('id', jd.id)
      .eq('company_id', employee!.company_id);
    if (error) { toast.error('Failed to publish'); return; }
    toast.success('Job description published');
    queryClient.invalidateQueries({ queryKey: ['job-description', id] });
    queryClient.invalidateQueries({ queryKey: ['job-descriptions'] });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!jd) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Job description not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/job-descriptions')}>
          Back to Job Descriptions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/job-descriptions')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Job Descriptions
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{jd.title}</h1>
            <Badge variant="secondary">v{jd.version_number}</Badge>
            <Badge variant={jd.published_at ? 'default' : 'outline'}>
              {jd.published_at ? 'Published' : 'Draft'}
            </Badge>
          </div>
          {jd.published_at && (
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDate(jd.published_at)}
            </p>
          )}
        </div>
        {isManager && (
          <div className="flex items-center gap-2 shrink-0">
            {!jd.published_at && (
              <Button variant="outline" size="sm" onClick={handlePublish}>
                Publish
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate(`/job-descriptions/${jd.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {jd.published_at && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={archiving}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive {jd.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This JD will no longer be visible to employees. You can publish it again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <div
        className="prose prose-sm max-w-none bg-card border border-border rounded-lg p-6"
        dangerouslySetInnerHTML={{ __html: jd.content }}
      />

      {isManager && versions && versions.length > 1 && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4" />
              Version History ({versions.length} versions)
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 border border-border rounded-lg divide-y divide-border">
              {versions.map(v => (
                <div key={v.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant={v.is_current ? 'default' : 'secondary'} className="text-xs shrink-0">
                      v{v.version_number}
                    </Badge>
                    <span className="text-sm text-muted-foreground truncate">
                      {v.published_at ? formatDate(v.published_at) : 'Unpublished'}
                    </span>
                    {(v as any).created_by_employee?.full_name && (
                      <span className="text-xs text-muted-foreground truncate">
                        by {(v as any).created_by_employee.full_name}
                      </span>
                    )}
                    {v.is_current && <span className="text-xs text-primary font-medium">Current</span>}
                  </div>
                  {v.id !== id && (
                    <Button variant="ghost" size="sm" onClick={() => setViewVersionId(v.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      <Dialog open={!!viewVersionId} onOpenChange={open => !open && setViewVersionId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {versionContent?.title}
              {versionContent && (
                <Badge variant="secondary" className="text-xs">v{versionContent.version_number}</Badge>
              )}
            </DialogTitle>
            {versionContent?.published_at && (
              <p className="text-sm text-muted-foreground">
                Published {formatDate(versionContent.published_at)}
              </p>
            )}
          </DialogHeader>
          {versionContent && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: versionContent.content }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDescriptionDetail;
