## Root cause

New projects **are** being assigned correctly. The breakage is on the read side.

In `src/pages/Projects.tsx` (lines 274–282), the query that loads projects for a **pure employee** (no `team_lead` / manager role) filters out projects whose status is `pending` or `submitted`:

```ts
.in('id', assignedIds)
.neq('status', 'pending')
.neq('status', 'submitted')
```

But in `src/pages/ProjectForm.tsx` line 183, every newly created project is inserted with:

```ts
if (!isEdit) payload.status = 'pending';
```

Result: the assignment row exists (so the project page correctly shows "assigned to all tech employees"), but when the employee logs in, the project is hidden by the `status != pending/submitted` filter. It only appears once a manager moves the status forward (e.g. to `in_progress`).

Team leads and managers don't hit this filter, which is why it looks fine from the admin/manager side.

## Fix

In `src/pages/Projects.tsx`, remove the two `.neq('status', ...)` lines from the pure-employee branch so assigned employees see their projects regardless of status (matching the team-lead branch, which has no status filter).

```text
Before:                                        After:
.in('id', assignedIds)                         .in('id', assignedIds)
.neq('status', 'pending')                      .order('created_at', { ascending: false })
.neq('status', 'submitted')
.order('created_at', { ascending: false })
```

No other files change. No DB / RLS / migration changes. Assignment logic in `ProjectForm.tsx` already covers all eligible (tech / estimation-team) employees via the `eligibleEmployees` prefill, so that side is correct.

## Out of scope

- Changing the default status of new projects.
- Changing which employees get auto-assigned (current rule: estimation team, excluding ceo/hr_manager/finance_manager/director/admin).
- Backfilling assignments for previously created projects.
