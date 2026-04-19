-- Allow team_lead to add/remove members on project_assignments
DROP POLICY IF EXISTS project_assignments_insert_hr_ceo ON public.project_assignments;
DROP POLICY IF EXISTS project_assignments_update_hr_ceo ON public.project_assignments;

CREATE POLICY project_assignments_insert_hr_ceo_tl
ON public.project_assignments
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text, 'team_lead'::text])
);

CREATE POLICY project_assignments_update_hr_ceo_tl
ON public.project_assignments
FOR UPDATE
TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text, 'team_lead'::text])
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['hr_manager'::text, 'ceo'::text, 'team_lead'::text])
);