CREATE OR REPLACE FUNCTION public.increment_job_view_count(job_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.job_listings
  SET view_count = view_count + 1
  WHERE id = job_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_job_view_count(UUID) TO anon, authenticated, service_role;