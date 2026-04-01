
CREATE POLICY "invoice_payments_delete_ceo"
ON public.invoice_payments
FOR DELETE
TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);

CREATE POLICY "invoice_line_items_delete_ceo"
ON public.invoice_line_items
FOR DELETE
TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);
