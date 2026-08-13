CREATE TABLE IF NOT EXISTS public.employee_jd_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  jd_id UUID REFERENCES public.hr_documents(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.employees(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, jd_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_jd_assignments TO authenticated;
GRANT ALL ON public.employee_jd_assignments TO service_role;

ALTER TABLE public.employee_jd_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_scoped_read" ON public.employee_jd_assignments
  FOR SELECT TO authenticated USING (
    company_id = public.get_company_id_for_auth(auth.uid())
  );

CREATE POLICY "hr_ceo_write" ON public.employee_jd_assignments
  FOR ALL TO authenticated USING (
    company_id = public.get_company_id_for_auth(auth.uid())
  );