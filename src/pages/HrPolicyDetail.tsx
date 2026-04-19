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
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { toast } from 'sonner';

const HrPolicyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const queryClient = useQueryClient();
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isManager = employee?.role_name === 'hr_manager' || employee?.role_name === 'ceo';
  const isCeo = employee?.role_name === 'ceo';

  const { data: policy, isLoading } = useQuery({
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
    enabled: !!id && !!employee?.company_id,
  });



  const handleTogglePublish = async () => {
    if (!policy) return;
    setPublishing(true);
    const { error } = await supabase
      .from('hr_documents')
      .update({
        published_at: policy.published_at ? null : new Date().toISOString(),
        updated_by: employee!.employee_id,
      })
      .eq('id', policy.id)
      .eq('company_id', employee!.company_id);
    setPublishing(false);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(policy.published_at ? 'Policy unpublished' : 'Policy published');
    queryClient.invalidateQueries({ queryKey: ['hr-policy', id] });
    queryClient.invalidateQueries({ queryKey: ['hr-policies'] });
  };

  const handleDelete = async () => {
    if (!policy) return;
    setDeleting(true);
    const { error } = await supabase
      .from('hr_documents')
      .delete()
      .eq('company_id', employee!.company_id)
      .eq('document_type', 'policy')
      .eq('title', policy.title);
    setDeleting(false);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Policy deleted');
    queryClient.invalidateQueries({ queryKey: ['hr-policies'] });
    navigate('/hr-policies');
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

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Policy not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/hr-policies')}>
          Back to Policies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/hr-policies')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Policies
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{policy.title}</h1>
            <Badge variant={policy.published_at ? 'default' : 'outline'}>
              {policy.published_at ? 'Published' : 'Draft'}
            </Badge>
          </div>
          {policy.published_at && (
            <p className="text-sm text-muted-foreground">
              Published on {formatDate(policy.published_at)}
            </p>
          )}
        </div>
        {isManager && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleTogglePublish} disabled={publishing}>
              {policy.published_at ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/hr-policies/${policy.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {isCeo && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {policy.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      All versions will be permanently deleted. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <div
        className="prose prose-sm max-w-none bg-card border border-border rounded-lg p-6"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />

    </div>
  );
};

export default HrPolicyDetail;
