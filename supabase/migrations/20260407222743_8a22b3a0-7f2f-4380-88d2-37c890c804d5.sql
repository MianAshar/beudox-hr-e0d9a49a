-- Add receipt_url column to monthly_expenses
ALTER TABLE monthly_expenses ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Create expense-receipts storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('expense-receipts', 'expense-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for expense-receipts bucket
CREATE POLICY "expense_receipts_insert_finance_ceo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'expense-receipts'
  AND (storage.foldername(name))[1] = (get_company_id_for_auth(auth.uid()))::text
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "expense_receipts_select_finance_ceo"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'expense-receipts'
  AND (storage.foldername(name))[1] = (get_company_id_for_auth(auth.uid()))::text
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "expense_receipts_delete_finance_ceo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'expense-receipts'
  AND (storage.foldername(name))[1] = (get_company_id_for_auth(auth.uid()))::text
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);