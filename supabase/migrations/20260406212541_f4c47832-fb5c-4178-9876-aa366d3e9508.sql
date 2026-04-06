
-- RLS for evaluations
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evaluations_select_company" ON evaluations
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "evaluations_insert_hr_ceo" ON evaluations
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

CREATE POLICY "evaluations_update_hr_ceo" ON evaluations
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

CREATE POLICY "evaluations_delete_hr_ceo" ON evaluations
FOR DELETE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

-- RLS for evaluation_scores
ALTER TABLE evaluation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eval_scores_select_company" ON evaluation_scores
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "eval_scores_insert_hr_ceo" ON evaluation_scores
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

CREATE POLICY "eval_scores_update_hr_ceo" ON evaluation_scores
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

CREATE POLICY "eval_scores_delete_hr_ceo" ON evaluation_scores
FOR DELETE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

-- RLS for evaluation_parameters
ALTER TABLE evaluation_parameters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eval_params_select_company" ON evaluation_parameters
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "eval_params_insert_hr_ceo" ON evaluation_parameters
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));

CREATE POLICY "eval_params_update_hr_ceo" ON evaluation_parameters
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo'));
