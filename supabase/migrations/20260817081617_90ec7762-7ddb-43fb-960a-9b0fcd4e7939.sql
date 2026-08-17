-- Patch all existing deactivated projects back to is_active = true
-- Archiving is now determined purely by status (submitted/cancelled)
-- so is_active is no longer used as a UI filter
UPDATE projects 
SET is_active = true 
WHERE is_active = false;