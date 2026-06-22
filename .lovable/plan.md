## Goal

Change the "Delete" action on the Projects list from a soft-delete (`is_active = false`, `status = 'cancelled'`) to a true hard delete that removes the project row and cascades to delete all of its tasks (and any other rows with `ON DELETE CASCADE` on `projects.id`).

The database FK `project_tasks.project_id → projects(id) ON DELETE CASCADE` is already in place, so no migration is needed — tasks will be removed automatically by Postgres.

## Changes

**`src/pages/Projects.tsx`**

1. Replace `deactivateMutation` with a `deleteMutation` that calls:
   ```ts
   supabase.from('projects').delete().eq('id', projectId).eq('company_id', companyId)
   ```
   (tenant-scoped per project rules).
2. Rename related state/handlers: `deactivateTarget` → `deleteTarget`, `onDeactivate` → `onDelete`.
3. Update the confirmation dialog:
   - Title: "Delete Project"
   - Description: Warn that the project and **all of its tasks** will be permanently deleted and this cannot be undone. Require typing the project name to confirm (matches the destructive-confirmation pattern used elsewhere, e.g. employee delete).
   - Primary button: "Delete" (destructive), disabled until typed name matches.
4. Update the row action button `aria-label` to "Delete project" and keep the `XCircle`/`Trash2` icon (use `Trash2` for consistency with the employees list).
5. Toast success message: "Project deleted".
6. Permission gate stays the same (`isManager && p.is_active`), but since rows will be hard-deleted, the `p.is_active` check effectively just hides the button for already-soft-deleted legacy rows.

## Out of scope

- No database migration (cascade already exists).
- No backfill for previously soft-deleted projects.
- No changes to other modules (clients, invoices, etc.).
