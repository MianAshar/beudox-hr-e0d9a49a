ALTER TABLE public.hr_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hr_documents_select_company"
ON public.hr_documents FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "hr_documents_insert_hr_ceo"
ON public.hr_documents FOR INSERT TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "hr_documents_update_hr_ceo"
ON public.hr_documents FOR UPDATE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "hr_documents_delete_ceo"
ON public.hr_documents FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);