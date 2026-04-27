import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const TEMP_PASSWORD = 'Forte@123';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, employee_id, full_name } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1) Create the auth user with a temporary password.
    let authUserId: string | null = null;
    const { data: createData, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: full_name ?? null },
    });

    if (createErr) {
      // If user already exists, look it up by listing.
      const msg = (createErr.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
        const { data: list } = await admin.auth.admin.listUsers();
        const found = list?.users?.find(u => (u.email || '').toLowerCase() === email.toLowerCase());
        if (found) {
          authUserId = found.id;
          // Reset their password to the temp one so the welcome email is valid.
          await admin.auth.admin.updateUserById(found.id, { password: TEMP_PASSWORD });
        } else {
          console.error('createUser error:', createErr);
          return new Response(
            JSON.stringify({ error: createErr.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
      } else {
        console.error('createUser error:', createErr);
        return new Response(
          JSON.stringify({ error: createErr.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    } else {
      authUserId = createData?.user?.id ?? null;
    }

    // 2) Link the auth user to the employee row and flag must_change_password.
    if (authUserId && employee_id) {
      const { error: linkErr } = await admin
        .from('employees')
        .update({ auth_user_id: authUserId, must_change_password: true })
        .eq('id', employee_id);
      if (linkErr) {
        console.error('Failed to link auth_user_id to employee:', linkErr);
      }
    }

    // 3) Send welcome email via Resend (best effort).
    if (resendApiKey) {
      try {
        const portalUrl = 'https://beudox-hr.lovable.app/login';
        const html = `
          <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#120E36; max-width:520px; margin:0 auto;">
            <h2 style="color:#120E36;">Welcome${full_name ? `, ${full_name}` : ''}!</h2>
            <p>Your Beudox HR Portal account has been created. Use the credentials below to sign in for the first time.</p>
            <div style="background:#F6F5FF; border-radius:10px; padding:16px 20px; margin:20px 0;">
              <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin:0;"><strong>Temporary password:</strong> ${TEMP_PASSWORD}</p>
            </div>
            <p>For your security, you'll be required to set a new password the first time you sign in.</p>
            <p><a href="${portalUrl}" style="display:inline-block; background:#5B3FF8; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none;">Sign in to the portal</a></p>
            <p style="color:#9490B4; font-size:12px; margin-top:24px;">If you did not expect this email, please contact your HR administrator.</p>
          </div>
        `;
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Beudox HR <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to Beudox HR Portal — your login details',
            html,
          }),
        });
        if (!emailRes.ok) {
          const txt = await emailRes.text();
          console.error('Resend email failed:', txt);
        }
      } catch (emailErr) {
        console.error('Resend email exception:', emailErr);
      }
    } else {
      console.warn('RESEND_API_KEY not set — skipping welcome email');
    }

    return new Response(
      JSON.stringify({ success: true, auth_user_id: authUserId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('invite-employee error:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
