
-- Add half_day columns to leave_requests
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS half_day BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS half_day_period TEXT DEFAULT NULL;

-- RLS for leave_types
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_types_select_company" ON public.leave_types
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "leave_types_insert_hr_ceo" ON public.leave_types
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_types_update_hr_ceo" ON public.leave_types
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

-- RLS for leave_balances
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_balances_select_own" ON public.leave_balances
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()));

CREATE POLICY "leave_balances_select_hr_ceo" ON public.leave_balances
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_balances_insert_company" ON public.leave_balances
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "leave_balances_update_hr_ceo" ON public.leave_balances
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_balances_update_own" ON public.leave_balances
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()));

-- RLS for leave_requests
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_requests_select_own" ON public.leave_requests
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()));

CREATE POLICY "leave_requests_select_hr_ceo" ON public.leave_requests
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_requests_insert_company" ON public.leave_requests
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "leave_requests_update_hr_ceo" ON public.leave_requests
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_requests_update_own_cancel" ON public.leave_requests
FOR UPDATE TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()))
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND employee_id = get_employee_id_for_auth(auth.uid()));

-- RLS for leave_balance_history
ALTER TABLE public.leave_balance_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_balance_history_select_hr_ceo" ON public.leave_balance_history
FOR SELECT TO authenticated
USING (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));

CREATE POLICY "leave_balance_history_insert_hr_ceo" ON public.leave_balance_history
FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()) AND get_employee_role_for_auth(auth.uid()) IN ('hr_manager','ceo'));
