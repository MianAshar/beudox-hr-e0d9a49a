-- Rename main tables
ALTER TABLE evaluations RENAME TO employee_reviews;
ALTER TABLE evaluation_scores RENAME TO employee_review_scores;

-- Rename FK column in employee_review_scores
ALTER TABLE employee_review_scores
RENAME COLUMN evaluation_id TO employee_review_id;

-- Rename RLS policies on employee_reviews (safe, continue if names differ)
DO $$
BEGIN
  ALTER POLICY "evaluations_company_scoped_read" ON employee_reviews
  RENAME TO "employee_reviews_company_scoped_read";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy not found, skipping';
END $$;

DO $$
BEGIN
  ALTER POLICY "evaluations_company_scoped_write" ON employee_reviews
  RENAME TO "employee_reviews_company_scoped_write";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy not found, skipping';
END $$;

-- Rename RLS policies on employee_review_scores
DO $$
BEGIN
  ALTER POLICY "evaluation_scores_company_scoped_read" ON employee_review_scores
  RENAME TO "employee_review_scores_company_scoped_read";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy not found, skipping';
END $$;

DO $$
BEGIN
  ALTER POLICY "evaluation_scores_company_scoped_write" ON employee_review_scores
  RENAME TO "employee_review_scores_company_scoped_write";
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Policy not found, skipping';
END $$;