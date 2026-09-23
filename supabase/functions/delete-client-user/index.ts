import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    // Validate auth — only HR Manager or CEO may delete client users
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json(401, { error: 'Unauthorized' });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return json(500, { error: 'Missing Supabase credentials' });
    }

    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return json(401, { error: 'Unauthorized' });
    }

    const callerAuthId = claimsData.claims.sub as string;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: callerRole } = await admin.rpc('get_employee_role_for_auth', { _auth_id: callerAuthId });
    if (!callerRole || !['hr_manager', 'ceo'].includes(callerRole)) {
      return json(403, { error: 'Forbidden: insufficient role' });
    }

    const { authUserId } = await req.json();

    if (!authUserId) {
      return json(400, { error: 'authUserId is required' });
    }

    const { error } = await admin.auth.admin.deleteUser(authUserId);

    if (error) {
      console.error('Failed to delete auth user:', error);
      return json(500, { error: error.message });
    }

    return json(200, { success: true, deleted: authUserId });

  } catch (err) {
    return json(500, { error: (err as Error).message });
  }
});
