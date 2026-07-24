
-- 1) Remove employees' ability to update their own leave balances
DROP POLICY IF EXISTS leave_balances_update_own ON public.leave_balances;

-- 2) Remove the permissive project update policy
DROP POLICY IF EXISTS projects_update_any_company_member ON public.projects;
CREATE POLICY projects_update_assigned_employee
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    company_id = public.get_company_id_for_auth(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.project_assignments pa
      WHERE pa.project_id = projects.id
        AND pa.employee_id = public.get_employee_id_for_auth(auth.uid())
    )
  )
  WITH CHECK (
    company_id = public.get_company_id_for_auth(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.project_assignments pa
      WHERE pa.project_id = projects.id
        AND pa.employee_id = public.get_employee_id_for_auth(auth.uid())
    )
  );

-- 3) CEO-only writes on roles table
CREATE POLICY roles_insert_ceo ON public.roles FOR INSERT TO authenticated
  WITH CHECK (public.auth_has_role(auth.uid(), 'ceo'));
CREATE POLICY roles_update_ceo ON public.roles FOR UPDATE TO authenticated
  USING (public.auth_has_role(auth.uid(), 'ceo'))
  WITH CHECK (public.auth_has_role(auth.uid(), 'ceo'));
CREATE POLICY roles_delete_ceo ON public.roles FOR DELETE TO authenticated
  USING (public.auth_has_role(auth.uid(), 'ceo'));

-- 5) Rewrite company-logos storage policies
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete company logos" ON storage.objects;

CREATE POLICY company_logos_select_authenticated ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'company-logos');

CREATE POLICY company_logos_insert_ceo ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (public.get_company_id_for_auth(auth.uid()))::text
    AND public.auth_has_role(auth.uid(), 'ceo')
  );

CREATE POLICY company_logos_update_ceo ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (public.get_company_id_for_auth(auth.uid()))::text
    AND public.auth_has_role(auth.uid(), 'ceo')
  )
  WITH CHECK (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (public.get_company_id_for_auth(auth.uid()))::text
    AND public.auth_has_role(auth.uid(), 'ceo')
  );

CREATE POLICY company_logos_delete_ceo ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (public.get_company_id_for_auth(auth.uid()))::text
    AND public.auth_has_role(auth.uid(), 'ceo')
  );

-- 6) Employee-avatars — company_id folder scoping
DROP POLICY IF EXISTS avatar_select_authenticated ON storage.objects;
CREATE POLICY avatar_select_same_company ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'employee-avatars'
    AND (storage.foldername(name))[1] = (public.get_company_id_for_auth(auth.uid()))::text
  );

-- 7) Revoke public/anon EXECUTE on internal security-definer helpers
REVOKE EXECUTE ON FUNCTION
  public.get_employee_roles_for_auth(uuid),
  public.auth_has_role(uuid, text),
  public.auth_has_any_role(uuid, text[]),
  public.is_admin_user(uuid),
  public.get_monthly_active_user_count(integer, uuid),
  public.get_mau_by_month(uuid),
  public.get_employee_by_auth_id(uuid),
  public.get_employee_role_for_auth(uuid),
  public.get_employee_id_for_auth(uuid),
  public.get_company_id_for_auth(uuid)
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION
  public.get_employee_roles_for_auth(uuid),
  public.auth_has_role(uuid, text),
  public.auth_has_any_role(uuid, text[]),
  public.get_employee_by_auth_id(uuid),
  public.get_employee_role_for_auth(uuid),
  public.get_employee_id_for_auth(uuid),
  public.get_company_id_for_auth(uuid)
TO authenticated;

GRANT EXECUTE ON FUNCTION
  public.is_admin_user(uuid),
  public.get_monthly_active_user_count(integer, uuid),
  public.get_mau_by_month(uuid)
TO service_role;
