CREATE POLICY "employees_update_own_must_change_password"
ON public.employees
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());