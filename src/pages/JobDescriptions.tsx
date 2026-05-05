import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, FileText } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

const JobDescriptions = () => {
  const navigate = useNavigate();
  const { employee } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const isManager = (employee?.roles ?? []).includes('hr_manager') || (employee?.roles ?? []).includes('ceo');

  const { data: jds, isLoading } = useQuery({
    queryKey: ['job-descriptions', employee?.company_id, isManager],
    queryFn: async () => {
      let query = supabase
        .from('hr_documents')
        .select('*')
        .eq('company_id', employee!.company_id)
        .eq('document_type', 'jd')
        .eq('is_current', true)
        .order('title', { ascending: true });

      if (!isManager) {
        query = query.not('published_at', 'is', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!employee?.company_id,
  });

  const filtered = jds?.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (isManager && statusFilter === 'published' && !j.published_at) return false;
    if (isManager && statusFilter === 'draft' && j.published_at) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Job descriptions for company roles</p>
        </div>
        {isManager && (
          <Button onClick={() => navigate('/job-descriptions/new')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add JD
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {isManager && (
          <div className="flex gap-1">
            {(['all', 'published', 'draft'] as const).map(s => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : !filtered?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No job descriptions found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isManager ? 'Create your first JD to get started.' : 'No published JDs yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(jd => (
            <div
              key={jd.id}
              className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground line-clamp-2 flex-1 mr-2">{jd.title}</h3>
                <Badge variant="secondary" className="shrink-0 text-xs">v{jd.version_number}</Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={jd.published_at ? 'default' : 'outline'} className="text-xs">
                  {jd.published_at ? 'Published' : 'Draft'}
                </Badge>
              </div>
              {jd.published_at && (
                <p className="text-xs text-muted-foreground mb-4">
                  Last updated: {formatDate(jd.published_at)}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/job-descriptions/${jd.id}`)}
              >
                Read
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDescriptions;
