
CREATE TABLE public.monthly_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  month_year TEXT NOT NULL,
  line_item_id UUID REFERENCES public.expense_line_items(id),
  category_id UUID NOT NULL REFERENCES public.expense_categories(id),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, month_year, line_item_id)
);

ALTER TABLE public.monthly_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "monthly_expenses_select_finance_ceo"
ON public.monthly_expenses FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "monthly_expenses_insert_finance_ceo"
ON public.monthly_expenses FOR INSERT TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "monthly_expenses_update_finance_ceo"
ON public.monthly_expenses FOR UPDATE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "monthly_expenses_delete_finance_ceo"
ON public.monthly_expenses FOR DELETE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);
