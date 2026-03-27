
-- Security definer function to get employee + role by auth user id (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_employee_by_auth_id(_auth_id uuid)
RETURNS TABLE (
  employee_id uuid,
  full_name text,
  email text,
  employee_code text,
  designation text,
  department text,
  avatar_url text,
  company_id uuid,
  company_name text,
  company_slug text,
  role_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.id AS employee_id,
    e.full_name,
    e.email,
    e.employee_code,
    e.designation,
    e.department,
    e.avatar_url,
    e.company_id,
    c.name AS company_name,
    c.slug AS company_slug,
    r.name AS role_name
  FROM employees e
  JOIN companies c ON c.id = e.company_id
  LEFT JOIN employee_roles er ON er.employee_id = e.id
  LEFT JOIN roles r ON r.id = er.role_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$$;

-- RLS on employees: users can read their own row
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employees_select_own" ON public.employees
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- RLS on companies: users can read their own company
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_select_own" ON public.companies
  FOR SELECT TO authenticated
  USING (id IN (
    SELECT company_id FROM public.employees WHERE auth_user_id = auth.uid()
  ));

-- RLS on roles: users can read roles in their company
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_select_company" ON public.roles
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM public.employees WHERE auth_user_id = auth.uid()
  ));

-- RLS on employee_roles: users can read their own role assignments
ALTER TABLE public.employee_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employee_roles_select_own" ON public.employee_roles
  FOR SELECT TO authenticated
  USING (employee_id IN (
    SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
  ));
