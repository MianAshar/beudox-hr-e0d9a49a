CREATE POLICY "job_cvs_company_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'job-cvs'
    AND auth.uid() IN (
      SELECT e.auth_user_id FROM public.employees e
      WHERE e.auth_user_id IS NOT NULL
    )
  );

CREATE POLICY "job_cvs_service_insert" ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'job-cvs');