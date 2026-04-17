CREATE POLICY "projects_update_status_team_lead"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'team_lead'
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'team_lead'
);