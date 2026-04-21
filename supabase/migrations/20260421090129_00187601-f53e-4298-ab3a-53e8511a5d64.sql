CREATE OR REPLACE FUNCTION public.get_employee_roles_for_auth(_auth_id uuid)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(array_agg(DISTINCT r.name ORDER BY r.name), ARRAY[]::text[])
  FROM employees e
  JOIN employee_roles er ON er.employee_id = e.id
  JOIN roles r ON r.id = er.role_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active';
$function$;

CREATE OR REPLACE FUNCTION public.auth_has_role(_auth_id uuid, _role text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM employees e
    JOIN employee_roles er ON er.employee_id = e.id
    JOIN roles r ON r.id = er.role_id
    WHERE e.auth_user_id = _auth_id
      AND e.status = 'active'
      AND r.name = _role
  );
$function$;

CREATE OR REPLACE FUNCTION public.auth_has_any_role(_auth_id uuid, _roles text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM employees e
    JOIN employee_roles er ON er.employee_id = e.id
    JOIN roles r ON r.id = er.role_id
    WHERE e.auth_user_id = _auth_id
      AND e.status = 'active'
      AND r.name = ANY(_roles)
  );
$function$;

-- Update the existing single-role getter to return the highest-priority role
-- (ceo > hr_manager > finance_manager > team_lead > employee)
-- so legacy single-role checks remain consistent for the user.
CREATE OR REPLACE FUNCTION public.get_employee_role_for_auth(_auth_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT r.name
  FROM employees e
  JOIN employee_roles er ON er.employee_id = e.id
  JOIN roles r ON r.id = er.role_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  ORDER BY CASE r.name
    WHEN 'ceo' THEN 1
    WHEN 'hr_manager' THEN 2
    WHEN 'finance_manager' THEN 3
    WHEN 'team_lead' THEN 4
    WHEN 'employee' THEN 5
    ELSE 99
  END
  LIMIT 1;
$function$;

-- Update the multi-field getter to return highest-priority role for the
-- 'role_name' field (used for backward compat by the client).
CREATE OR REPLACE FUNCTION public.get_employee_by_auth_id(_auth_id uuid)
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
    (
      SELECT r.name
      FROM employee_roles er
      JOIN roles r ON r.id = er.role_id
      WHERE er.employee_id = e.id
      ORDER BY CASE r.name
        WHEN 'ceo' THEN 1
        WHEN 'hr_manager' THEN 2
        WHEN 'finance_manager' THEN 3
        WHEN 'team_lead' THEN 4
        WHEN 'employee' THEN 5
        ELSE 99
      END
      LIMIT 1
    ) AS role_name,
    c.logo_url AS company_logo_url
  FROM employees e
  JOIN companies c ON c.id = e.company_id
  WHERE e.auth_user_id = _auth_id
  AND e.status = 'active'
  LIMIT 1;
$function$;