import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller is authenticated
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify caller has hr_manager or ceo role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.rpc('get_employee_role_for_auth', {
      _auth_id: user.id,
    });
    if (!roleData || !['hr_manager', 'ceo'].includes(roleData)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: insufficient role' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate body
    const body = await req.json();
    const { email, employee_id } = body;
    console.log('Invite request:', { email, employee_id });

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!employee_id || typeof employee_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'employee_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const redirectTo = 'https://beudox-hr.lovable.app/set-password';

    // Try inviting the user. If they already exist, fall back to a password
    // recovery link so they can still set their password and gain access.
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo });

    let authUserId: string | undefined = inviteData?.user?.id;
    let message = `Invite sent to ${email}`;

    if (inviteError) {
      const alreadyExists =
        (inviteError as { code?: string }).code === 'email_exists' ||
        /already been registered/i.test(inviteError.message);

      if (!alreadyExists) {
        console.error('inviteUserByEmail error:', inviteError);
        return new Response(
          JSON.stringify({ error: inviteError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // User already exists in auth — find them and send a recovery link instead.
      console.log('User already exists, sending recovery link instead.');

      // Find the existing auth user id by paging through users
      let foundId: string | undefined;
      let page = 1;
      while (!foundId && page <= 20) {
        const { data: list, error: listErr } =
          await adminClient.auth.admin.listUsers({ page, perPage: 200 });
        if (listErr) {
          console.error('listUsers error:', listErr);
          break;
        }
        foundId = list?.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        )?.id;
        if (!list || list.users.length < 200) break;
        page += 1;
      }
      authUserId = foundId;

      const { error: linkErr } = await adminClient.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });
      if (linkErr) {
        console.error('generateLink (recovery) error:', linkErr);
        return new Response(
          JSON.stringify({ error: linkErr.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      message = `${email} already had an account — a password reset link was sent instead.`;
    }

    // Link the auth user to the employee record (covers both new and existing users)
    if (authUserId) {
      await adminClient
        .from('employees')
        .update({ auth_user_id: authUserId })
        .eq('id', employee_id);
      console.log('Linked auth_user_id to employee:', employee_id);
    }

    return new Response(
      JSON.stringify({ success: true, message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Invite employee error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
