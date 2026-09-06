-- Step 1: Rename tables
ALTER TABLE daily_evaluations RENAME TO project_evaluations;
ALTER TABLE daily_evaluation_scores RENAME TO project_evaluation_scores;

-- Step 2: Rename the FK column in project_evaluation_scores
ALTER TABLE project_evaluation_scores 
RENAME COLUMN daily_evaluation_id TO project_evaluation_id;

-- Step 3: Rename RLS policies on project_evaluations (continue if names differ)
DO $$
BEGIN
  ALTER POLICY "daily_evaluations_company_scoped_read" ON project_evaluations 
  RENAME TO "project_evaluations_company_scoped_read";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy daily_evaluations_company_scoped_read not found on project_evaluations, skipping';
END $$;

DO $$
BEGIN
  ALTER POLICY "daily_evaluations_company_scoped_write" ON project_evaluations 
  RENAME TO "project_evaluations_company_scoped_write";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy daily_evaluations_company_scoped_write not found on project_evaluations, skipping';
END $$;

-- Step 4: Rename RLS policies on project_evaluation_scores (continue if names differ)
DO $$
BEGIN
  ALTER POLICY "daily_evaluation_scores_company_scoped_read" ON project_evaluation_scores 
  RENAME TO "project_evaluation_scores_company_scoped_read";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy daily_evaluation_scores_company_scoped_read not found on project_evaluation_scores, skipping';
END $$;

DO $$
BEGIN
  ALTER POLICY "daily_evaluation_scores_company_scoped_write" ON project_evaluation_scores 
  RENAME TO "project_evaluation_scores_company_scoped_write";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy daily_evaluation_scores_company_scoped_write not found on project_evaluation_scores, skipping';
END $$;