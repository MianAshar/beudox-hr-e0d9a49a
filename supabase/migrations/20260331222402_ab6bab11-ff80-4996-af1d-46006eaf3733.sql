
DROP FUNCTION IF EXISTS public.get_employee_by_auth_id(uuid);

CREATE FUNCTION public.get_employee_by_auth_id(_auth_id uuid)
 RETURNS TABLE(employee_id uuid, full_name text, email text, employee_code text, designation text, department text, avatar_url text, company_id uuid, company_name text, company_slug text, role_name text, company_logo_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    r.name AS role_name,
    c.logo_url AS company_logo_url
  FROM employees e
  JOIN companies c ON c.id = e.company_id
  LEFT JOIN employee_roles er ON er.employee_id = e.id
  LEFT JOIN roles r ON r.id = er.role_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$function$;
