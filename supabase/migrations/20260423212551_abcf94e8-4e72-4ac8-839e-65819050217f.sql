
-- RLS policies for attendance_imports
ALTER TABLE public.attendance_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_imports_select_company"
  ON public.attendance_imports FOR SELECT
  TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "attendance_imports_insert_hr_ceo"
  ON public.attendance_imports FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  );

CREATE POLICY "attendance_imports_update_hr_ceo"
  ON public.attendance_imports FOR UPDATE
  TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  );

-- RLS policies for attendance_records
CREATE POLICY "attendance_records_select_company"
  ON public.attendance_records FOR SELECT
  TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "attendance_records_insert_hr_ceo"
  ON public.attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  );

CREATE POLICY "attendance_records_update_hr_ceo"
  ON public.attendance_records FOR UPDATE
  TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  );

CREATE POLICY "attendance_records_delete_hr_ceo"
  ON public.attendance_records FOR DELETE
  TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text])
  );

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS attendance_records_employee_date_unique
  ON public.attendance_records (employee_id, date);
