CREATE POLICY projects_update_any_company_member
ON public.projects
FOR UPDATE
TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));