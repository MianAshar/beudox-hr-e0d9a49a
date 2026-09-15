import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_STAGES = ['todo', 'in_progress', 'qc', 'done'] as const;
type Stage = typeof VALID_STAGES[number];

const json = (res: Response | null, status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get calling user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json(null, 401, { error: 'Missing authorization' });

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return json(null, 401, { error: 'Unauthorized' });

    // Get employee record
    const { data: employee, error: empErr } = await admin
      .from('employees')
      .select('id, company_id, employee_roles(roles(name))')
      .eq('auth_user_id', user.id)
      .single();
    if (empErr || !employee) return json(null, 403, { error: 'Employee not found' });

    const companyId = employee.company_id;
    const employeeId = employee.id;
    const roleNames: string[] = (employee.employee_roles ?? [])
      .map((er: any) => er?.roles?.name)
      .filter(Boolean);

    const isManager = roleNames.some(r => ['ceo', 'hr_manager'].includes(r));
    const isTeamLead = roleNames.includes('team_lead');
    const isEmployee = roleNames.includes('employee') && !isManager && !isTeamLead;

    // Parse request body
    const { taskId, toStage, reason } = await req.json();

    if (!taskId || !toStage) return json(null, 400, { error: 'taskId and toStage are required' });
    if (!VALID_STAGES.includes(toStage as Stage)) return json(null, 400, { error: 'Invalid stage' });

    // Fetch task
    const { data: task, error: taskErr } = await admin
      .from('project_tasks')
      .select('id, company_id, status, assigned_to, project_id')
      .eq('id', taskId)
      .eq('company_id', companyId)
      .single();
    if (taskErr || !task) return json(null, 404, { error: 'Task not found' });

    const fromStage = task.status as Stage;

    // Done is terminal — nobody can move out of done
    if (fromStage === 'done') {
      return json(null, 403, { error: 'Done tasks cannot be moved' });
    }

    // Permission check per role
    if (isEmployee) {
      // Employees can only move their own tasks
      if (task.assigned_to !== employeeId) {
        return json(null, 403, { error: 'You can only move your own tasks' });
      }
      // Employees can only move: todo→in_progress or in_progress→qc
      const allowed: Partial<Record<Stage, Stage[]>> = {
        todo: ['in_progress'],
        in_progress: ['qc'],
      };
      if (!allowed[fromStage]?.includes(toStage as Stage)) {
        return json(null, 403, { error: `Employees cannot move tasks from ${fromStage} to ${toStage}` });
      }
    } else if (isTeamLead) {
      // Team leads can move anything except out of done (already blocked above)
      // No extra restrictions
    } else if (isManager) {
      // Managers can move anything except out of done (already blocked above)
      // No extra restrictions
    } else {
      return json(null, 403, { error: 'Insufficient permissions' });
    }

    // If same stage, no-op
    if (fromStage === toStage) {
      return json(null, 400, { error: 'Task is already in this stage' });
    }

    // Update task status
    const now = new Date().toISOString();
    const taskUpdate: Record<string, unknown> = { status: toStage };
    if (toStage === 'done') {
      taskUpdate.is_completed = true;
      taskUpdate.completed_at = now;
      taskUpdate.completed_by = employeeId;
    }

    const { error: updateErr } = await admin
      .from('project_tasks')
      .update(taskUpdate)
      .eq('id', taskId)
      .eq('company_id', companyId);
    if (updateErr) throw updateErr;

    // Log the transition
    const { error: logErr } = await admin
      .from('task_stage_logs')
      .insert({
        company_id: companyId,
        task_id: taskId,
        from_stage: fromStage,
        to_stage: toStage,
        changed_by: employeeId,
        changed_at: now,
        reason: reason?.trim() || null,
      });
    if (logErr) throw logErr;

    return json(null, 200, {
      success: true,
      taskId,
      fromStage,
      toStage,
      changedAt: now,
    });

  } catch (err) {
    console.error('move-task-stage error:', err);
    return json(null, 500, { error: (err as Error).message });
  }
});
