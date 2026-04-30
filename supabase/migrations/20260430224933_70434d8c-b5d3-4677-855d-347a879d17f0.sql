CREATE POLICY "leave_requests_delete_ceo"
ON public.leave_requests
FOR DELETE
TO authenticated
USING (
  company_id = public.get_company_id_for_auth(auth.uid())
  AND public.auth_has_role(auth.uid(), 'ceo')
);