CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  description TEXT,
  requirements TEXT,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  expires_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  area_lahore TEXT,
  last_degree TEXT NOT NULL,
  degree_year INTEGER NOT NULL,
  linkedin_url TEXT,
  cv_url TEXT,
  cv_filename TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'shortlisted', 'interview_scheduled', 'hired', 'rejected')),
  is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
  duplicate_reason TEXT,
  interview_date TIMESTAMPTZ,
  interview_notes TEXT,
  reviewed_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_listings TO authenticated;
GRANT ALL ON public.job_listings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;

CREATE INDEX idx_job_listings_company_id ON public.job_listings(company_id);
CREATE INDEX idx_job_listings_status ON public.job_listings(status);
CREATE INDEX idx_job_listings_expires_at ON public.job_listings(expires_at);
CREATE INDEX idx_job_applications_company_id ON public.job_applications(company_id);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_email ON public.job_applications(email);
CREATE INDEX idx_job_applications_mobile ON public.job_applications(mobile);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

CREATE OR REPLACE FUNCTION public.update_job_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_job_listings_updated_at();

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_listings_company_access" ON public.job_listings
  FOR ALL
  USING (
    company_id IN (
      SELECT e.company_id FROM public.employees e
      WHERE e.auth_user_id = auth.uid()
    )
  );

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_applications_company_access" ON public.job_applications
  FOR ALL
  USING (
    company_id IN (
      SELECT e.company_id FROM public.employees e
      WHERE e.auth_user_id = auth.uid()
    )
  );