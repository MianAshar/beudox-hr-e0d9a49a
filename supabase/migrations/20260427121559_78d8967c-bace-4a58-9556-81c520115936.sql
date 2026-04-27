DELETE FROM auth.users
WHERE id = 'c07f01bf-f326-48ba-b8d4-24f33278fc80'
  AND NOT EXISTS (
    SELECT 1 FROM public.employees e WHERE e.auth_user_id = auth.users.id
  );