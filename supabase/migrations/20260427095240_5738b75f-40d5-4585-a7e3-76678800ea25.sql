ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS deactivation_reason TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS deactivation_notes TEXT;