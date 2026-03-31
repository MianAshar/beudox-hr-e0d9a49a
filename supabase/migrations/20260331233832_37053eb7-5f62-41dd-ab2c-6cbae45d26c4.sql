
-- RLS for clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select_company" ON public.clients
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "clients_insert_hr_ceo" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

CREATE POLICY "clients_update_hr_ceo" ON public.clients
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

-- RLS for projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_company" ON public.projects
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "projects_insert_hr_ceo" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

CREATE POLICY "projects_update_hr_ceo" ON public.projects
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

-- RLS for project_assignments table
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_assignments_select_company" ON public.project_assignments
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "project_assignments_insert_hr_ceo" ON public.project_assignments
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

CREATE POLICY "project_assignments_update_hr_ceo" ON public.project_assignments
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );

-- RLS for project_categories table
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_categories_select_company" ON public.project_categories
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "project_categories_insert_hr_ceo" ON public.project_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
  );
