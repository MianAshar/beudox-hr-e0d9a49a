ALTER TABLE evaluation_parameters
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;