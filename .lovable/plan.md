## Fix: Finance Manager cannot add/update expenses

### Root cause
The RLS policies on `monthly_expenses`, `expense_line_items`, and `expense_categories` gate writes with:

```
get_employee_role_for_auth(auth.uid()) = ANY (ARRAY['finance_manager','ceo'])
```

`get_employee_role_for_auth` returns only the **single highest-priority** role. The finance manager account (`tahaijaz147@gmail.com`) holds both `hr_manager` and `finance_manager`, and `hr_manager` outranks `finance_manager` in the priority order — so the function returns `'hr_manager'`, the check fails, and every INSERT/UPDATE/DELETE on expense tables is blocked by RLS.

### Fix
Replace the single-role check with the existing multi-role helper `auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])` on all expense-related policies. This helper already scans every role the user holds.

### Migration (one call)
Drop and recreate these policies on `monthly_expenses`, `expense_line_items`, and `expense_categories`:
- `*_insert_finance_ceo` (WITH CHECK)
- `*_update_finance_ceo` (USING + WITH CHECK)
- `*_delete_finance_ceo` (USING)
- `monthly_expenses_select_finance_ceo` (USING) — same bug affects reads

New predicate everywhere:
```
company_id = get_company_id_for_auth(auth.uid())
AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
```

No frontend or edge-function changes required.

### Verification
After the migration, signing in as Taha and adding/editing a row in Finance Sheet should succeed with no RLS error.
