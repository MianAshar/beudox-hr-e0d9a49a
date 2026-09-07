-- 1. client_users table — links Supabase auth users to clients
CREATE TABLE IF NOT EXISTS client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  status TEXT NOT NULL DEFAULT 'invited',
  invited_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON client_users TO authenticated;
GRANT ALL ON client_users TO service_role;

ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;

-- HR/CEO can read and write client_users for their company
CREATE POLICY "client_users_company_read" ON client_users
  FOR SELECT USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "client_users_company_write" ON client_users
  FOR ALL USING (company_id = get_company_id_for_auth(auth.uid()));

-- Client users can read their own row
CREATE POLICY "client_users_self_read" ON client_users
  FOR SELECT USING (auth_user_id = auth.uid());

-- 2. Helper function to get client_id from auth.uid()
CREATE OR REPLACE FUNCTION get_client_id_for_auth(user_id UUID)
RETURNS UUID AS $$
  SELECT client_id FROM client_users WHERE auth_user_id = user_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Helper function to check if auth user is a client portal user
CREATE OR REPLACE FUNCTION is_client_user(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM client_users WHERE auth_user_id = user_id);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. Client-scoped RLS policies on projects
CREATE POLICY "projects_client_read" ON projects
  FOR SELECT USING (
    client_id = get_client_id_for_auth(auth.uid())
    AND get_client_id_for_auth(auth.uid()) IS NOT NULL
  );

-- 5. Client-scoped RLS policies on project_assignments
CREATE POLICY "project_assignments_client_read" ON project_assignments
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND project_id IN (
      SELECT id FROM projects WHERE client_id = get_client_id_for_auth(auth.uid())
    )
  );

-- 6. Client-scoped RLS policies on project_tasks
CREATE POLICY "project_tasks_client_read" ON project_tasks
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND project_id IN (
      SELECT id FROM projects WHERE client_id = get_client_id_for_auth(auth.uid())
    )
  );

-- 7. Client-scoped RLS policies on project_rfis
CREATE POLICY "project_rfis_client_read" ON project_rfis
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND project_id IN (
      SELECT id FROM projects WHERE client_id = get_client_id_for_auth(auth.uid())
    )
  );

-- 8. Client-scoped RLS policies on project_rfi_questions
CREATE POLICY "project_rfi_questions_client_read" ON project_rfi_questions
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND rfi_id IN (
      SELECT pr.id FROM project_rfis pr
      JOIN projects p ON p.id = pr.project_id
      WHERE p.client_id = get_client_id_for_auth(auth.uid())
    )
  );

-- 9. Client-scoped read on employees table (names only — for team lead display)
CREATE POLICY "employees_client_read" ON employees
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND id IN (
      SELECT pa.employee_id FROM project_assignments pa
      JOIN projects p ON p.id = pa.project_id
      WHERE p.client_id = get_client_id_for_auth(auth.uid())
      AND pa.is_active = true
    )
  );

-- 10. Client can read company logo from companies table
CREATE POLICY "companies_client_read" ON companies
  FOR SELECT USING (
    get_client_id_for_auth(auth.uid()) IS NOT NULL
    AND id IN (
      SELECT company_id FROM client_users WHERE auth_user_id = auth.uid()
    )
  );
