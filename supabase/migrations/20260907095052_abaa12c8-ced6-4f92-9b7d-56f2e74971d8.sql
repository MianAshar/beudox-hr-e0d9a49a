-- Harden new client portal helper functions

-- 1. Set fixed search_path to prevent search_path injection
CREATE OR REPLACE FUNCTION get_client_id_for_auth(user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT client_id FROM client_users WHERE auth_user_id = user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION is_client_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM client_users WHERE auth_user_id = user_id);
$$;

-- 2. Revoke public/anon execute and grant only to authenticated
REVOKE ALL ON FUNCTION get_client_id_for_auth(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION is_client_user(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_client_id_for_auth(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_client_user(UUID) TO authenticated;
