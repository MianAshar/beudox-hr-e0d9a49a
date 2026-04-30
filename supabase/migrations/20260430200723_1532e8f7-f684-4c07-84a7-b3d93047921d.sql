CREATE TABLE IF NOT EXISTS public.leave_overwrite_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  leave_request_id UUID REFERENCES public.leave_requests(id) ON DELETE SET NULL,
  leave_type_name TEXT,
  date DATE NOT NULL,
  check_in TEXT,
  check_out TEXT,
  working_hours NUMERIC,
  reason TEXT DEFAULT 'machine_record_found',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leave_overwrite_logs_company_date
  ON public.leave_overwrite_logs (company_id, date DESC);

ALTER TABLE public.leave_overwrite_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_overwrite_logs_select_hr_ceo"
  ON public.leave_overwrite_logs
  FOR SELECT
  TO authenticated
  USING (
    company_id = public.get_company_id_for_auth(auth.uid())
    AND public.get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager','ceo'])
  );

CREATE POLICY "leave_overwrite_logs_insert_company"
  ON public.leave_overwrite_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (company_id = public.get_company_id_for_auth(auth.uid()));
