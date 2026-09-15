-- 1. Add status column to project_tasks
ALTER TABLE project_tasks 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'todo'
CHECK (status IN ('todo', 'in_progress', 'qc', 'done'));

-- 2. Migrate existing data: completed tasks → done, rest → todo
UPDATE project_tasks SET status = 'done' WHERE is_completed = true;
UPDATE project_tasks SET status = 'todo' WHERE is_completed = false;

-- 3. Create task_stage_logs table
CREATE TABLE IF NOT EXISTS public.task_stage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES project_tasks(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Grant Data API access to task_stage_logs
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_stage_logs TO authenticated;
GRANT ALL ON public.task_stage_logs TO service_role;

-- 5. RLS on task_stage_logs
ALTER TABLE task_stage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_scoped_task_stage_logs" ON task_stage_logs
  FOR ALL USING (
    company_id = (SELECT company_id FROM employees WHERE auth_user_id = auth.uid())
  );

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_task_stage_logs_task_id ON task_stage_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_stage_logs_company_id ON task_stage_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_task_stage_logs_changed_at ON task_stage_logs(task_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(company_id, status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_status ON project_tasks(project_id, status);

-- 7. ANALYZE
ANALYZE project_tasks;
ANALYZE task_stage_logs;