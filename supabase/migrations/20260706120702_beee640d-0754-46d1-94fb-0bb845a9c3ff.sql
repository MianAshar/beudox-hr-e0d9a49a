
-- monthly_expenses
DROP POLICY IF EXISTS monthly_expenses_select_finance_ceo ON public.monthly_expenses;
DROP POLICY IF EXISTS monthly_expenses_insert_finance_ceo ON public.monthly_expenses;
DROP POLICY IF EXISTS monthly_expenses_update_finance_ceo ON public.monthly_expenses;
DROP POLICY IF EXISTS monthly_expenses_delete_finance_ceo ON public.monthly_expenses;

CREATE POLICY monthly_expenses_select_finance_ceo ON public.monthly_expenses
  FOR SELECT USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY monthly_expenses_insert_finance_ceo ON public.monthly_expenses
  FOR INSERT WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY monthly_expenses_update_finance_ceo ON public.monthly_expenses
  FOR UPDATE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  ) WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY monthly_expenses_delete_finance_ceo ON public.monthly_expenses
  FOR DELETE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );

-- expense_line_items
DROP POLICY IF EXISTS expense_line_items_insert_finance_ceo ON public.expense_line_items;
DROP POLICY IF EXISTS expense_line_items_update_finance_ceo ON public.expense_line_items;
DROP POLICY IF EXISTS expense_line_items_delete_finance_ceo ON public.expense_line_items;

CREATE POLICY expense_line_items_insert_finance_ceo ON public.expense_line_items
  FOR INSERT WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY expense_line_items_update_finance_ceo ON public.expense_line_items
  FOR UPDATE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  ) WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY expense_line_items_delete_finance_ceo ON public.expense_line_items
  FOR DELETE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );

-- expense_categories
DROP POLICY IF EXISTS expense_categories_insert_finance_ceo ON public.expense_categories;
DROP POLICY IF EXISTS expense_categories_update_finance_ceo ON public.expense_categories;
DROP POLICY IF EXISTS expense_categories_delete_finance_ceo ON public.expense_categories;

CREATE POLICY expense_categories_insert_finance_ceo ON public.expense_categories
  FOR INSERT WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY expense_categories_update_finance_ceo ON public.expense_categories
  FOR UPDATE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  ) WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
CREATE POLICY expense_categories_delete_finance_ceo ON public.expense_categories
  FOR DELETE USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND public.auth_has_any_role(auth.uid(), ARRAY['finance_manager','ceo'])
  );
