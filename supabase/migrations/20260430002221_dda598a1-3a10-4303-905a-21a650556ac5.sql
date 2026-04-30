-- Manual edit audit log for attendance records
CREATE TABLE IF NOT EXISTS public.attendance_manual_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  attendance_record_id UUID REFERENCES public.attendance_records(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  field_updated TEXT NOT NULL CHECK (field_updated IN ('check_in', 'check_out')),
  old_value TEXT,
  new_value TEXT,
  updated_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attendance_manual_logs_company ON public.attendance_manual_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_attendance_manual_logs_record ON public.attendance_manual_logs(attendance_record_id);
CREATE INDEX IF NOT EXISTS idx_attendance_manual_logs_employee ON public.attendance_manual_logs(employee_id);

ALTER TABLE public.attendance_manual_logs ENABLE ROW LEVEL SECURITY;

-- SELECT: any authenticated user in the same company
CREATE POLICY "attendance_manual_logs_select_company"
ON public.attendance_manual_logs
FOR SELECT
TO authenticated
USING (company_id = public.get_company_id_for_auth(auth.uid()));

-- INSERT: HR Manager, CEO, or employee logging their own self-service edit
CREATE POLICY "attendance_manual_logs_insert_authorised"
ON public.attendance_manual_logs
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND (
    public.get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager', 'ceo'])
    OR updated_by = public.get_employee_id_for_auth(auth.uid())
  )
);

-- Allow employees to update their OWN attendance records (for self-service missing entry)
CREATE POLICY "attendance_records_update_own"
ON public.attendance_records
FOR UPDATE
TO authenticated
USING (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND employee_id = public.get_employee_id_for_auth(auth.uid())
)
WITH CHECK (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND employee_id = public.get_employee_id_for_auth(auth.uid())
);
