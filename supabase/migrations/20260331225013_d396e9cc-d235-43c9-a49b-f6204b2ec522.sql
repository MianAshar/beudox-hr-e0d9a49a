ALTER TABLE public_holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "holidays_select_hr_ceo"
ON public_holidays FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "holidays_insert_hr_ceo"
ON public_holidays FOR INSERT TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "holidays_delete_hr_ceo"
ON public_holidays FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);