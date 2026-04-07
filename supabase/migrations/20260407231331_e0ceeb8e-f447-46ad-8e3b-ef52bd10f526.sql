
-- RLS policies for notifications table

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Employees can read their own notifications
CREATE POLICY "notifications_select_own"
ON public.notifications FOR SELECT TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND recipient_id = get_employee_id_for_auth(auth.uid())
);

-- Employees can update (mark read) their own notifications
CREATE POLICY "notifications_update_own"
ON public.notifications FOR UPDATE TO authenticated
USING (
  company_id = get_company_id_for_auth(auth.uid())
  AND recipient_id = get_employee_id_for_auth(auth.uid())
)
WITH CHECK (
  company_id = get_company_id_for_auth(auth.uid())
  AND recipient_id = get_employee_id_for_auth(auth.uid())
);

-- Insert allowed for authenticated users in same company (edge function uses service role anyway)
CREATE POLICY "notifications_insert_company"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (company_id = get_company_id_for_auth(auth.uid()));
