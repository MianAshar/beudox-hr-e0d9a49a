CREATE OR REPLACE FUNCTION public.get_employee_status_by_email(_email text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status
  FROM employees
  WHERE lower(email) = lower(_email)
  ORDER BY
    CASE WHEN status = 'inactive' THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_employee_status_by_email(text) TO anon, authenticated;