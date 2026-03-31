-- Allow CEO to delete clients
CREATE POLICY "clients_delete_ceo" ON public.clients
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);

-- Allow CEO to delete projects
CREATE POLICY "projects_delete_ceo" ON public.projects
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);

-- Allow CEO to delete project_assignments
CREATE POLICY "project_assignments_delete_ceo" ON public.project_assignments
FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);