CREATE POLICY "public_holidays_select_all_company"
ON public.public_holidays
FOR SELECT
TO authenticated
USING (
  company_id = (
    SELECT company_id FROM public.employees
    WHERE auth_user_id = auth.uid()
  )
);