-- Add last_login_at column to employees
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Index for fast filtering on Login Logs tab
CREATE INDEX IF NOT EXISTS idx_login_logs_company_logged_at
ON public.login_logs (company_id, logged_in_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_logs_employee
ON public.login_logs (employee_id, logged_in_at DESC);

-- Enable RLS (in case not already)
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "login_logs_insert_own" ON public.login_logs;
DROP POLICY IF EXISTS "login_logs_select_own" ON public.login_logs;
DROP POLICY IF EXISTS "login_logs_select_hr_ceo" ON public.login_logs;

-- Authenticated users can insert their own login record
CREATE POLICY "login_logs_insert_own"
ON public.login_logs
FOR INSERT
TO authenticated
WITH CHECK (auth_user_id = auth.uid());

-- Users can view their own login history
CREATE POLICY "login_logs_select_own"
ON public.login_logs
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- HR Managers and CEOs can view all login logs for their company
CREATE POLICY "login_logs_select_hr_ceo"
ON public.login_logs
FOR SELECT
TO authenticated
USING (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.auth_has_any_role(auth.uid(), ARRAY['hr_manager', 'ceo'])
);