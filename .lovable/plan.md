## Goal
Allow any signed-in employee in the company to change a project's status (on both Projects and Projects V2 lists, and Project Detail).

## Changes

### 1. Database (RLS) — `supabase/migrations`
The `projects` table currently only allows UPDATE for `hr_manager`, `ceo`, and `team_lead`. Add a new policy that lets any active employee in the same company UPDATE projects:

```sql
CREATE POLICY projects_update_any_company_member
ON public.projects
FOR UPDATE
TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));
```

Note: Postgres RLS cannot restrict which columns are updated. Since the request is "any user can update status," this policy will technically permit other column updates too — the UI only exposes the status control, so non-managers won't see edit affordances for other fields. If column-level restriction is required, flag it and we'll add a trigger.

### 2. Frontend — unlock the status control for everyone

- `src/pages/Projects.tsx` (line 185): change `canEditStatus = ['hr_manager','ceo','team_lead']...` → `canEditStatus = true`. Keep `canEditDeadline` tied to the manager check (only status is being opened up).
- `src/pages/ProjectsV2.tsx` (line 629): same — `canEditStatus = true`, keep `canEditDeadline` as manager-only (re-derive it from the prior manager/team-lead check rather than from `canEditStatus`).
- `src/pages/ProjectDetail.tsx`: 
  - Allow the status badge to be clickable for everyone (mirror the dropdown used in the list views) so a user landing on a project detail page can change status too.
  - "Start project" (pending → in_progress) currently gated by `canStartProject` — extend to all roles so a pending project isn't a dead end for non-managers.

### 3. Activity log
Status changes already write to `project_activity_logs` via `logProjectActivity`. No change needed; the actor will be the current user, so audit trail is preserved.

## Out of scope
- No changes to who can edit deadline, fee, client, team, or other project fields.
- No changes to who can create/delete projects.
