-- Create client_categories first so clients.category_id can reference it
CREATE TABLE IF NOT EXISTS client_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, code)
);

-- Required grants for PostgREST access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_categories TO authenticated;
GRANT ALL ON public.client_categories TO service_role;

ALTER TABLE client_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_scoped_client_categories" ON client_categories
  FOR ALL USING (
    company_id = (SELECT company_id FROM employees WHERE auth_user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_client_categories_company
  ON client_categories(company_id);

-- Drop legacy sub_series column
ALTER TABLE clients DROP COLUMN IF EXISTS sub_series;

-- Add new client metadata columns
ALTER TABLE clients ADD COLUMN IF NOT EXISTS scope TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_requirements TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES client_categories(id) ON DELETE SET NULL;