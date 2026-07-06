CREATE OR REPLACE FUNCTION pg_temp.replace_single_role_policy_checks(_expr text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  _result text := _expr;
BEGIN
  IF _result IS NULL THEN
    RETURN NULL;
  END IF;

  _result := regexp_replace(
    _result,
    '(public\.)?get_employee_role_for_auth\(auth\.uid\(\)\)\s*=\s*ANY\s*\(ARRAY\[([^\]]+)\]\)',
    'public.auth_has_any_role(auth.uid(), ARRAY[\2])',
    'g'
  );

  _result := regexp_replace(
    _result,
    '(public\.)?get_employee_role_for_auth\(auth\.uid\(\)\)\s*=\s*''([^'']+)''::text',
    'public.auth_has_role(auth.uid(), ''\2'')',
    'g'
  );

  RETURN _result;
END;
$$;

DO $$
DECLARE
  _policy record;
  _using_expr text;
  _check_expr text;
  _sql text;
BEGIN
  FOR _policy IN
    SELECT schemaname, tablename, policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        qual ILIKE '%get_employee_role_for_auth(auth.uid())%'
        OR with_check ILIKE '%get_employee_role_for_auth(auth.uid())%'
      )
  LOOP
    _using_expr := pg_temp.replace_single_role_policy_checks(_policy.qual);
    _check_expr := pg_temp.replace_single_role_policy_checks(_policy.with_check);

    _sql := format('ALTER POLICY %I ON %I.%I', _policy.policyname, _policy.schemaname, _policy.tablename);

    IF _using_expr IS NOT NULL THEN
      _sql := _sql || format(' USING (%s)', _using_expr);
    END IF;

    IF _check_expr IS NOT NULL THEN
      _sql := _sql || format(' WITH CHECK (%s)', _check_expr);
    END IF;

    EXECUTE _sql;
  END LOOP;
END;
$$;