
-- RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_company" ON public.invoices
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "invoices_insert_finance_ceo" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

CREATE POLICY "invoices_update_finance_ceo" ON public.invoices
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

CREATE POLICY "invoices_delete_ceo" ON public.invoices
  FOR DELETE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) = 'ceo'
  );

-- RLS policies for invoice_line_items
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_line_items_select_company" ON public.invoice_line_items
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "invoice_line_items_insert_finance_ceo" ON public.invoice_line_items
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

CREATE POLICY "invoice_line_items_update_finance_ceo" ON public.invoice_line_items
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

CREATE POLICY "invoice_line_items_delete_finance_ceo" ON public.invoice_line_items
  FOR DELETE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

-- RLS policies for invoice_payments
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_payments_select_company" ON public.invoice_payments
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "invoice_payments_insert_finance_ceo" ON public.invoice_payments
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

CREATE POLICY "invoice_payments_update_finance_ceo" ON public.invoice_payments
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
  );

-- Storage bucket for invoice PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-pdfs', 'invoice-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "invoice_pdfs_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'invoice-pdfs');

CREATE POLICY "invoice_pdfs_insert_finance_ceo" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'invoice-pdfs'
  );

CREATE POLICY "invoice_pdfs_update_finance_ceo" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'invoice-pdfs');

CREATE POLICY "invoice_pdfs_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'invoice-pdfs');
