# Remove Project Category

## Goal
Remove the "Category" concept from the project user interface: hide it from the project list/detail views and remove the Category field from the Add/Edit Project form.

## What I found
- `ProjectForm.tsx` has a `category_id` form field and a `project_categories` lookup used by managers/CEOs.
- `Projects.tsx` fetches `project_categories(name)` and displays category metadata in project cards.
- `ProjectDetail.tsx` fetches `project_categories(name)` and shows the category on the info panel.
- `ProjectsSummary.tsx` may also reference project categories.
- `ProjectCategoriesTab.tsx` exists but is not currently wired into `Settings.tsx`, so it is already orphaned.

## Changes

### 1. Project Add/Edit form (`src/pages/ProjectForm.tsx`)
- Remove `category_id` from the `form` state object.
- Remove the `categories` React Query lookup.
- Remove the Category `<Select>` block from the manager/CEO form.
- Remove `category_id` from the create/update Supabase payload.
- Remove any validation that references `category_id`.

### 2. Project list (`src/pages/Projects.tsx`)
- Remove `project_categories(name)` from the project select string.
- Remove the category badge/display in project cards.

### 3. Project detail (`src/pages/ProjectDetail.tsx`)
- Remove `project_categories(name)` from the project select.
- Remove the "Category" row from the project info panel.

### 4. Projects summary (`src/components/projects/ProjectsSummary.tsx`)
- Remove any references to project categories if present.

### 5. Cleanup
- Delete the orphaned `src/components/settings/ProjectCategoriesTab.tsx` file to avoid dead code.

## Out of scope
- No database schema changes: the `project_categories` table and `category_id` column will remain in Supabase.
- No role/permission changes.
