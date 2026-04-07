ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loans_select_finance_ceo" ON loans
FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "loans_insert_finance_ceo" ON loans
FOR INSERT TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "loans_update_finance_ceo" ON loans
FOR UPDATE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "loans_delete_ceo" ON loans
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);