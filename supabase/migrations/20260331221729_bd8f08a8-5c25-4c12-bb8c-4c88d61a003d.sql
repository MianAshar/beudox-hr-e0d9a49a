
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Storage RLS for company-logos bucket
CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can update company logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'company-logos')
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can delete company logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-logos');

CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'company-logos');

-- Allow CEO to update companies (for logo_url)
CREATE POLICY "ceo_can_update_company"
ON public.companies FOR UPDATE TO authenticated
USING (
  id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
)
WITH CHECK (
  id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) = 'ceo'
);
