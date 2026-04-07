
-- expense_categories
CREATE TABLE public.expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expense_categories_select_company" ON public.expense_categories
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "expense_categories_insert_finance_ceo" ON public.expense_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );

CREATE POLICY "expense_categories_update_finance_ceo" ON public.expense_categories
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );

CREATE POLICY "expense_categories_delete_finance_ceo" ON public.expense_categories
  FOR DELETE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );

-- expense_line_items
CREATE TABLE public.expense_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.expense_categories(id) ON DELETE CASCADE,
  description text NOT NULL,
  is_recurring boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.expense_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expense_line_items_select_company" ON public.expense_line_items
  FOR SELECT TO authenticated
  USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "expense_line_items_insert_finance_ceo" ON public.expense_line_items
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );

CREATE POLICY "expense_line_items_update_finance_ceo" ON public.expense_line_items
  FOR UPDATE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  )
  WITH CHECK (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );

CREATE POLICY "expense_line_items_delete_finance_ceo" ON public.expense_line_items
  FOR DELETE TO authenticated
  USING (
    company_id = get_company_id_for_auth(auth.uid())
    AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager','ceo')
  );
