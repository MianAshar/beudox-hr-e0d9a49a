ALTER TABLE project_tasks 
ADD COLUMN IF NOT EXISTS complexity TEXT CHECK (complexity IN ('easy', 'medium', 'hard'));