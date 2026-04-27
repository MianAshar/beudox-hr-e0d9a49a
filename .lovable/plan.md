## Root cause

The password itself is updating successfully, but `must_change_password` remains `true` in the `employees` row. The client sends the update request, but current RLS only allows `hr_manager` and `ceo` to update `employees`, so a normal `employee` cannot clear their own onboarding flag. That leaves the user in a loop: new password works, dashboard tries to load, refresh reads `must_change_password = true`, and the modal appears again.

## Plan

1. Add a narrowly scoped Supabase migration
   - Add an `employees_update_own_must_change_password` policy for authenticated users.
   - Allow a user to update only their own employee row by `auth_user_id = auth.uid()`.
   - Keep the row constrained to the same authenticated user after update.
   - This will unblock clearing `must_change_password` without granting employees broad profile-edit access.

2. Update the modal submission handler only where needed
   - Keep the strict order: `getUser()` → `updateUser({ password })` → update `employees.must_change_password = false` → confirm the flag is now false → refresh session/user state → dismiss modal → navigate.
   - Add `.eq('auth_user_id', user.id).select('must_change_password').maybeSingle()` to the flag update so the code can confirm the row actually changed instead of treating a no-op as success.
   - If the update returns no row or still returns `true`, show a clear setup-completion error and stop.

3. Fix the auth refresh race that causes the blank dashboard
   - Make `refreshEmployee()` return the `fetchEmployee` promise so the modal can `await` it.
   - After the flag is cleared and `refreshSession()` completes, await the employee refresh before navigating.
   - Ensure the modal sets loading false before unmounting and navigation.

4. Keep scope limited
   - Do not touch deactivation login checks.
   - Do not change the broader auth flow, routes, dashboard, or employee creation logic.
   - Only change the employee self-update RLS policy, the password-change modal handler, and the auth refresh helper needed by that handler.

## Technical details

Expected final success sequence:

```ts
const { data: { user } } = await supabase.auth.getUser();
await supabase.auth.updateUser({ password: newPassword });

const { data, error } = await supabase
  .from('employees')
  .update({ must_change_password: false })
  .eq('auth_user_id', user.id)
  .select('must_change_password')
  .maybeSingle();

if (error || data?.must_change_password !== false) {
  // show error and keep modal open
  return;
}

await supabase.auth.refreshSession();
await refreshEmployee();
setSubmitting(false);
setVisible(false);
navigate('/dashboard', { replace: true });
toast.success('Password updated. Welcome to Forte HR Portal!');
```

Migration intent:

```sql
CREATE POLICY "employees_update_own_must_change_password"
ON public.employees
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());
```

If column-level restriction is available in the migration approach, I will restrict the policy grant to only `must_change_password`; otherwise the existing UI will still only perform the one-field update, and broader manager update policies remain unchanged.