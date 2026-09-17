-- 1. Add approved_dates column to leave_requests (array of approved date strings)
ALTER TABLE leave_requests 
ADD COLUMN IF NOT EXISTS approved_dates DATE[] DEFAULT NULL;

-- 2. Add approved_days column
ALTER TABLE leave_requests 
ADD COLUMN IF NOT EXISTS approved_days NUMERIC DEFAULT NULL;

-- 3. Add partial_approval_reason column
ALTER TABLE leave_requests 
ADD COLUMN IF NOT EXISTS partial_approval_reason TEXT DEFAULT NULL;

-- 4. Add partially_approved to status check constraint
-- First drop existing constraint if any, then re-add with new value
DO $$
BEGIN
  ALTER TABLE leave_requests 
    DROP CONSTRAINT IF EXISTS leave_requests_status_check;
  ALTER TABLE leave_requests 
    ADD CONSTRAINT leave_requests_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'partially_approved'));
EXCEPTION WHEN others THEN
  NULL; -- constraint may not exist, safe to continue
END $$;

-- 5. Index for querying partially approved leaves in payroll/attendance
CREATE INDEX IF NOT EXISTS idx_leave_requests_status_company 
ON leave_requests(company_id, status);

ANALYZE leave_requests;