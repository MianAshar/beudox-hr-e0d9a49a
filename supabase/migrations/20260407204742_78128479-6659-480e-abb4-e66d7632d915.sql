
-- Enable RLS on payroll_records
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- Finance manager + CEO can do everything
CREATE POLICY "payroll_select_finance_ceo"
ON public.payroll_records FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "payroll_insert_finance_ceo"
ON public.payroll_records FOR INSERT TO authenticated
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

CREATE POLICY "payroll_update_finance_ceo"
ON public.payroll_records FOR UPDATE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND get_employee_role_for_auth(auth.uid()) IN ('finance_manager', 'ceo')
);

-- Employees can view their own payroll records (for My Payslip)
CREATE POLICY "payroll_select_own"
ON public.payroll_records FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND employee_id = get_employee_id_for_auth(auth.uid())
);
