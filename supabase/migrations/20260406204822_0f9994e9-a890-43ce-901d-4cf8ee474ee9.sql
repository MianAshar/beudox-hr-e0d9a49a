ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS phone text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS website text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS departments text[] DEFAULT ARRAY['GC Team', 'MEP Team', 'Admin', 'Director'];