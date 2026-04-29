CREATE POLICY "payroll_delete_ceo" ON public.payroll_records
FOR DELETE
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);