
-- RLS for daily_evaluations: all company members can SELECT and INSERT, only hr/ceo/reviewer can DELETE
ALTER TABLE daily_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_evals_select_company" ON daily_evaluations
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "daily_evals_insert_authenticated" ON daily_evaluations
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "daily_evals_delete_hr_ceo_reviewer" ON daily_evaluations
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND (
    get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
    OR reviewer_id = get_employee_id_for_auth(auth.uid())
  )
);

-- RLS for daily_evaluation_scores
ALTER TABLE daily_evaluation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_eval_scores_select_company" ON daily_evaluation_scores
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "daily_eval_scores_insert_authenticated" ON daily_evaluation_scores
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "daily_eval_scores_delete_hr_ceo" ON daily_evaluation_scores
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND (
    get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
    OR daily_evaluation_id IN (
      SELECT id FROM daily_evaluations WHERE reviewer_id = get_employee_id_for_auth(auth.uid())
    )
  )
);
