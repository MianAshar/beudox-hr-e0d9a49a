import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { sendNotification } from '@/lib/notifications';
import { cn } from '@/lib/utils';
import {
  Plus, ChevronDown, ChevronUp, CheckCircle2,
  Clock, MessageSquare, X, Check, Loader2
} from 'lucide-react';

interface ProjectRFITabProps {
  projectId: string;
  companyId: string;
  employeeId: string;
  canManage: boolean; // team_lead | hr_manager | ceo
  managerIds: string[]; // CEO + HR manager employee IDs for notifications
  projectName: string;
}

interface RFIQuestion {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  asked_by: string;
  answered_by: string | null;
  answered_at: string | null;
  display_order: number;
  asker?: { full_name: string };
  answerer?: { full_name: string };
}

interface RFI {
  id: string;
  title: string;
  status: string;
  created_by: string;
  created_at: string;
  creator?: { full_name: string };
  project_rfi_questions: RFIQuestion[];
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export const ProjectRFITab = ({
  projectId, companyId, employeeId, canManage, managerIds, projectName
}: ProjectRFITabProps) => {
  const qc = useQueryClient();
  const [expandedRFIs, setExpandedRFIs] = useState<Set<string>>(new Set());
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestions, setNewQuestions] = useState<string[]>(['']);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [addingQuestionToRFI, setAddingQuestionToRFI] = useState<string | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  const toggleExpanded = (id: string) => {
    setExpandedRFIs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Fetch RFIs with questions and employee names
  const { data: rfis, isLoading } = useQuery({
    queryKey: ['project-rfis', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_rfis')
        .select(`
          id, title, status, created_by, created_at,
          creator:employees!project_rfis_created_by_fkey(full_name),
          project_rfi_questions(
            id, question, answer, status, asked_by, answered_by, answered_at, display_order,
            asker:employees!project_rfi_questions_asked_by_fkey(full_name),
            answerer:employees!project_rfi_questions_answered_by_fkey(full_name)
          )
        `)
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Sort questions by display_order
      return (data as any[]).map(rfi => ({
        ...rfi,
        project_rfi_questions: [...(rfi.project_rfi_questions ?? [])].sort(
          (a: any, b: any) => a.display_order - b.display_order
        ),
      })) as RFI[];
    },
    enabled: !!projectId && !!companyId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['project-rfis', projectId] });
  };

  // Create new RFI with questions
  const createMutation = useMutation({
    mutationFn: async () => {
      const title = newTitle.trim();
      const questions = newQuestions.map(q => q.trim()).filter(Boolean);
      if (!title) throw new Error('RFI title is required');
      if (questions.length === 0) throw new Error('At least one question is required');

      // Insert RFI
      const { data: rfi, error: rfiErr } = await supabase
        .from('project_rfis')
        .insert({ company_id: companyId, project_id: projectId, title, created_by: employeeId, status: 'open' })
        .select('id')
        .single();
      if (rfiErr) throw rfiErr;

      // Insert questions
      const { error: qErr } = await supabase.from('project_rfi_questions').insert(
        questions.map((q, i) => ({
          company_id: companyId,
          rfi_id: rfi.id,
          question: q,
          asked_by: employeeId,
          status: 'pending',
          display_order: i,
        }))
      );
      if (qErr) throw qErr;

      // Notify CEO + HR managers
      const recipients = managerIds.filter(id => id !== employeeId);
      if (recipients.length > 0) {
        await sendNotification({
          companyId,
          recipientIds: recipients,
          type: 'rfi_submitted',
          title: 'New RFI submitted',
          message: `A new RFI "${title}" has been submitted on ${projectName}. Please review and answer the questions.`,
          referenceType: 'project',
          referenceId: projectId,
        });
      }
    },
    onSuccess: () => {
      setShowNewForm(false);
      setNewTitle('');
      setNewQuestions(['']);
      invalidate();
      toast({ title: 'RFI submitted' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  // Answer a question
  const answerMutation = useMutation({
    mutationFn: async ({ questionId, answer, rfiCreatedBy }: { questionId: string; answer: string; rfiCreatedBy: string }) => {
      const { error } = await supabase
        .from('project_rfi_questions')
        .update({ answer, answered_by: employeeId, answered_at: new Date().toISOString(), status: 'answered' })
        .eq('id', questionId);
      if (error) throw error;

      // Notify RFI creator if not the answerer
      if (rfiCreatedBy !== employeeId) {
        await sendNotification({
          companyId,
          recipientIds: [rfiCreatedBy],
          type: 'rfi_answered',
          title: 'RFI question answered',
          message: `A question on your RFI for ${projectName} has been answered.`,
          referenceType: 'project',
          referenceId: projectId,
        });
      }
    },
    onSuccess: (_, vars) => {
      setAnswerDrafts(prev => { const n = { ...prev }; delete n[vars.questionId]; return n; });
      invalidate();
      toast({ title: 'Answer saved' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  // Mark RFI resolved
  const resolveMutation = useMutation({
    mutationFn: async ({ rfiId, rfiCreatedBy }: { rfiId: string; rfiCreatedBy: string }) => {
      const { error } = await supabase
        .from('project_rfis')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', rfiId);
      if (error) throw error;

      if (rfiCreatedBy !== employeeId) {
        await sendNotification({
          companyId,
          recipientIds: [rfiCreatedBy],
          type: 'rfi_resolved',
          title: 'RFI resolved',
          message: `An RFI on ${projectName} has been marked as resolved.`,
          referenceType: 'project',
          referenceId: projectId,
        });
      }
    },
    onSuccess: () => { invalidate(); toast({ title: 'RFI marked resolved' }); },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  // Add follow-up question to existing RFI
  const followUpMutation = useMutation({
    mutationFn: async ({ rfiId, rfiCreatedBy }: { rfiId: string; rfiCreatedBy: string }) => {
      const question = followUpQuestion.trim();
      if (!question) throw new Error('Question is required');
      const rfi = rfis?.find(r => r.id === rfiId);
      const nextOrder = (rfi?.project_rfi_questions?.length ?? 0);
      const { error } = await supabase.from('project_rfi_questions').insert({
        company_id: companyId,
        rfi_id: rfiId,
        question,
        asked_by: employeeId,
        status: 'pending',
        display_order: nextOrder,
      });
      if (error) throw error;

      const recipients = managerIds.filter(id => id !== employeeId);
      if (recipients.length > 0) {
        await sendNotification({
          companyId,
          recipientIds: recipients,
          type: 'rfi_submitted',
          title: 'Follow-up question added',
          message: `A follow-up question has been added to an RFI on ${projectName}.`,
          referenceType: 'project',
          referenceId: projectId,
        });
      }
    },
    onSuccess: () => {
      setFollowUpQuestion('');
      setAddingQuestionToRFI(null);
      invalidate();
      toast({ title: 'Question added' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
    </div>
  );

  const openRFIs = (rfis ?? []).filter(r => r.status === 'open');
  const resolvedRFIs = (rfis ?? []).filter(r => r.status === 'resolved');

  return (
    <div className="space-y-4">
      {/* New RFI button */}
      {canManage && !showNewForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowNewForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> New RFI
          </Button>
        </div>
      )}

      {/* New RFI form */}
      {showNewForm && (
        <div className="rounded-lg border border-primary/30 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">New RFI</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowNewForm(false); setNewTitle(''); setNewQuestions(['']); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">RFI Title</label>
            <Input placeholder="e.g. Foundation clarifications" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">Questions</label>
            {newQuestions.map((q, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-xs text-muted-foreground mt-2.5 w-5 shrink-0">{i + 1}.</span>
                <Textarea
                  rows={2}
                  placeholder={`Question ${i + 1}`}
                  value={q}
                  onChange={e => {
                    const next = [...newQuestions];
                    next[i] = e.target.value;
                    setNewQuestions(next);
                  }}
                  className="flex-1 resize-none"
                />
                {newQuestions.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 mt-1 shrink-0" onClick={() => setNewQuestions(newQuestions.filter((_, j) => j !== i))}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => setNewQuestions([...newQuestions, ''])}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add question
            </Button>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t">
            <Button variant="outline" onClick={() => { setShowNewForm(false); setNewTitle(''); setNewQuestions(['']); }}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit RFI'}
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!showNewForm && (rfis ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border bg-card">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No RFIs yet</p>
          <p className="text-xs text-muted-foreground mt-1">Submit an RFI to request clarifications from the client.</p>
        </div>
      )}

      {/* Open RFIs */}
      {openRFIs.length > 0 && (
        <div className="space-y-3">
          {openRFIs.map(rfi => {
            const isExpanded = expandedRFIs.has(rfi.id);
            const pendingCount = rfi.project_rfi_questions.filter(q => q.status === 'pending').length;
            const allAnswered = rfi.project_rfi_questions.length > 0 && pendingCount === 0;

            return (
              <div key={rfi.id} className="rounded-lg border bg-card overflow-hidden">
                {/* RFI header */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                  onClick={() => toggleExpanded(rfi.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge style={{ background: '#EBE6FF', color: '#2B1899', border: 'none' }} className="shrink-0 text-xs">Open</Badge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{rfi.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {(rfi.creator as any)?.full_name || 'Unknown'} · {formatDateTime(rfi.created_at)}
                        {pendingCount > 0 && <span className="ml-2 text-amber-600">{pendingCount} pending</span>}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>

                {/* RFI body */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 space-y-4 pt-3">
                    {/* Questions */}
                    <div className="space-y-4">
                      {rfi.project_rfi_questions.map((q, idx) => (
                        <div key={q.id} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-muted-foreground mt-0.5 w-5 shrink-0">Q{idx + 1}.</span>
                            <p className="text-sm text-foreground flex-1">{q.question}</p>
                          </div>
                          {q.status === 'answered' ? (
                            <div className="ml-7 flex items-start gap-2 rounded-md p-3" style={{ background: '#D1FAE5' }}>
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-green-900">{q.answer}</p>
                                <p className="text-xs text-green-700 mt-1">
                                  Answered by {(q.answerer as any)?.full_name || 'Unknown'} · {q.answered_at ? formatDateTime(q.answered_at) : ''}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="ml-7 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs text-amber-600">
                                <Clock className="h-3.5 w-3.5" /> Pending answer
                              </div>
                              {canManage && (
                                <div className="flex gap-2">
                                  <Textarea
                                    rows={2}
                                    placeholder="Type your answer…"
                                    value={answerDrafts[q.id] ?? ''}
                                    onChange={e => setAnswerDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    className="resize-none flex-1 text-sm"
                                  />
                                  <Button
                                    size="sm"
                                    className="self-end shrink-0"
                                    disabled={!answerDrafts[q.id]?.trim() || answerMutation.isPending}
                                    onClick={() => answerMutation.mutate({ questionId: q.id, answer: answerDrafts[q.id], rfiCreatedBy: rfi.created_by })}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add follow-up question */}
                    {canManage && (
                      <div className="border-t pt-3">
                        {addingQuestionToRFI === rfi.id ? (
                          <div className="space-y-2">
                            <Textarea
                              autoFocus
                              rows={2}
                              placeholder="Follow-up question…"
                              value={followUpQuestion}
                              onChange={e => setFollowUpQuestion(e.target.value)}
                              className="resize-none text-sm"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => { setAddingQuestionToRFI(null); setFollowUpQuestion(''); }}>Cancel</Button>
                              <Button
                                size="sm"
                                disabled={!followUpQuestion.trim() || followUpMutation.isPending}
                                onClick={() => followUpMutation.mutate({ rfiId: rfi.id, rfiCreatedBy: rfi.created_by })}
                              >
                                {followUpMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Add Question'}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" className="text-primary text-xs" onClick={() => { setAddingQuestionToRFI(rfi.id); setFollowUpQuestion(''); }}>
                              <Plus className="h-3.5 w-3.5 mr-1" /> Add question
                            </Button>
                            {allAnswered && canManage && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-700 border-green-200 hover:bg-green-50"
                                disabled={resolveMutation.isPending}
                                onClick={() => resolveMutation.mutate({ rfiId: rfi.id, rfiCreatedBy: rfi.created_by })}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Resolved
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolved RFIs */}
      {resolvedRFIs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-4">Resolved</p>
          {resolvedRFIs.map(rfi => {
            const isExpanded = expandedRFIs.has(rfi.id);
            return (
              <div key={rfi.id} className="rounded-lg border bg-muted/30 overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => toggleExpanded(rfi.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge style={{ background: '#D1FAE5', color: '#065F46', border: 'none' }} className="shrink-0 text-xs">Resolved</Badge>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">{rfi.title}</p>
                      <p className="text-xs text-muted-foreground/70">{rfi.project_rfi_questions.length} question{rfi.project_rfi_questions.length !== 1 ? 's' : ''} · {formatDateTime(rfi.created_at)}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-3">
                    {rfi.project_rfi_questions.map((q, idx) => (
                      <div key={q.id} className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground mt-0.5 w-5 shrink-0">Q{idx + 1}.</span>
                          <p className="text-sm text-muted-foreground flex-1">{q.question}</p>
                        </div>
                        {q.answer && (
                          <div className="ml-7 rounded-md p-2.5 bg-muted/50">
                            <p className="text-sm text-foreground">{q.answer}</p>
                            <p className="text-xs text-muted-foreground mt-1">by {(q.answerer as any)?.full_name || 'Unknown'}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
