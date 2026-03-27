
-- Security definer function to check employee role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_employee_role_for_auth(_auth_id uuid)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.name
  FROM employees e
  JOIN employee_roles er ON er.employee_id = e.id
  JOIN roles r ON r.id = er.role_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$$;

-- Security definer function to get employee_id for auth user
CREATE OR REPLACE FUNCTION public.get_employee_id_for_auth(_auth_id uuid)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.id
  FROM employees e
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$$;

-- Security definer function to get company_id for auth user
CREATE OR REPLACE FUNCTION public.get_company_id_for_auth(_auth_id uuid)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.company_id
  FROM employees e
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$$;

-- RLS: employees - hr_manager, finance_manager, ceo can SELECT all in their company
CREATE POLICY "employees_select_company_managers"
ON public.employees
FOR SELECT
TO authenticated
USING (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'finance_manager', 'ceo')
);

-- RLS: employees - hr_manager and ceo can INSERT
CREATE POLICY "employees_insert_hr_ceo"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

-- RLS: employees - hr_manager and ceo can UPDATE
CREATE POLICY "employees_update_hr_ceo"
ON public.employees
FOR UPDATE
TO authenticated
USING (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
)
WITH CHECK (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

-- RLS: employee_roles - managers can SELECT all in their company
CREATE POLICY "employee_roles_select_company_managers"
ON public.employee_roles
FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees WHERE company_id = public.get_company_id_for_auth(auth.uid())
  )
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'finance_manager', 'ceo')
);

-- RLS: employee_roles - hr_manager and ceo can INSERT
CREATE POLICY "employee_roles_insert_hr_ceo"
ON public.employee_roles
FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees WHERE company_id = public.get_company_id_for_auth(auth.uid())
  )
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

-- RLS: employee_roles - hr_manager and ceo can UPDATE
CREATE POLICY "employee_roles_update_hr_ceo"
ON public.employee_roles
FOR UPDATE
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees WHERE company_id = public.get_company_id_for_auth(auth.uid())
  )
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
)
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees WHERE company_id = public.get_company_id_for_auth(auth.uid())
  )
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

-- RLS: employee_roles - hr_manager and ceo can DELETE (for role changes)
CREATE POLICY "employee_roles_delete_hr_ceo"
ON public.employee_roles
FOR DELETE
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees WHERE company_id = public.get_company_id_for_auth(auth.uid())
  )
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

-- Storage RLS for employee-avatars bucket
CREATE POLICY "avatar_upload_hr_ceo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'employee-avatars'
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "avatar_update_hr_ceo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'employee-avatars'
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);

CREATE POLICY "avatar_select_authenticated"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-avatars'
);

CREATE POLICY "avatar_delete_hr_ceo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-avatars'
  AND public.get_employee_role_for_auth(auth.uid()) IN ('hr_manager', 'ceo')
);
