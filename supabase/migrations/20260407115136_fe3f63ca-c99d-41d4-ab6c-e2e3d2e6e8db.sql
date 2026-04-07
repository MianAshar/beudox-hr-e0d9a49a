CREATE POLICY "loans_select_own"
ON public.loans
FOR SELECT
TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND employee_id = get_employee_id_for_auth(auth.uid())
);