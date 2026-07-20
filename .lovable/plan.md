Change the default status filter on the Loans listing screen from "All Statuses" to "Active" so managers land on a focused view of currently outstanding loans.

### Change
- File: `src/pages/Loans.tsx`
- Update the `statusFilter` React state initializer on line 59 from `'all'` to `'active'`.

This keeps the status dropdown available so users can still switch to All / Settled / On Hold when needed.