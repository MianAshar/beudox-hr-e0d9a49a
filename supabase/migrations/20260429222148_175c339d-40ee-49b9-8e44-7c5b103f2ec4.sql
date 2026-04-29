ALTER TABLE public.company_settings 
  ADD COLUMN IF NOT EXISTS lunch_break_hours NUMERIC NOT NULL DEFAULT 1;
ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS enable_ot_adjustment BOOLEAN NOT NULL DEFAULT true;