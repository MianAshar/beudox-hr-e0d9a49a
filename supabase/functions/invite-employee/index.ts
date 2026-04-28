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

  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const { email, employee_id, full_name } = await req.json();

    if (!email || typeof email !== 'string') {
      return json(400, { error: 'email is required' });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return json(500, { error: 'Server is missing Supabase credentials.' });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log(`Inviting employee: ${email} ${employee_id ?? ''}`);

    // 1) Create the auth user with a temporary password (or reuse if exists).
    let authUserId: string | null = null;
    const { data: createData, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: full_name ?? null },
      });

    if (createErr) {
      const msg = (createErr.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
        const { data: list } = await admin.auth.admin.listUsers();
        const found = list?.users?.find(
          (u) => (u.email || '').toLowerCase() === email.toLowerCase(),
        );
        if (found) {
          authUserId = found.id;
          await admin.auth.admin.updateUserById(found.id, { password: TEMP_PASSWORD });
          console.log(`Existing auth user reused: ${authUserId}`);
        } else {
          console.error('createUser error:', createErr);
          return json(400, { error: createErr.message });
        }
      } else {
        console.error('createUser error:', createErr);
        return json(400, { error: createErr.message });
      }
    } else {
      authUserId = createData?.user?.id ?? null;
      console.log(`Auth user created: ${authUserId}`);
    }

    // 2) Link auth_user_id and require password change on first login.
    if (authUserId && employee_id) {
      const { error: linkErr } = await admin
        .from('employees')
        .update({ auth_user_id: authUserId, must_change_password: true })
        .eq('id', employee_id);
      if (linkErr) {
        console.error('Failed to link auth_user_id to employee:', linkErr);
      } else {
        console.log('Employee record updated');
      }
    }

    // 3) Send the welcome email via Resend.
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return json(502, {
        error:
          'Email provider is not configured (RESEND_API_KEY missing). Employee account was created but the welcome email was not sent.',
        auth_user_id: authUserId,
      });
    }

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

    let emailRes: Response;
    try {
      emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Beudox HR <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to Beudox HR Portal — your login details',
          html,
        }),
      });
    } catch (networkErr) {
      console.error('Resend network error:', networkErr);
      return json(502, {
        error: 'Could not reach email provider. Employee was created but the welcome email failed.',
        auth_user_id: authUserId,
      });
    }

    const responseText = await emailRes.text();
    let responseBody: any = null;
    try { responseBody = JSON.parse(responseText); } catch { /* ignore */ }

    if (!emailRes.ok) {
      console.error(`Resend rejected send [${emailRes.status}]:`, responseText);
      const providerMessage =
        responseBody?.message ||
        responseBody?.error ||
        responseText ||
        'Unknown email provider error';

      // Sandbox / unverified-domain hint
      const lower = String(providerMessage).toLowerCase();
      const looksLikeSandbox =
        lower.includes('verify a domain') ||
        lower.includes('testing emails') ||
        lower.includes('only send testing') ||
        lower.includes('domain is not verified') ||
        lower.includes('owner');

      return json(502, {
        error: looksLikeSandbox
          ? `Email could not be delivered: Resend is in sandbox mode and only allows sending to your verified Resend account email. Verify a sender domain in Resend (or change RESEND_API_KEY) to send to ${email}.`
          : `Email could not be delivered: ${providerMessage}`,
        provider_status: emailRes.status,
        auth_user_id: authUserId,
        email_sent: false,
      });
    }

    console.log(`Resend accepted email. id=${responseBody?.id ?? 'unknown'}`);

    return json(200, {
      success: true,
      email_sent: true,
      auth_user_id: authUserId,
      provider_message_id: responseBody?.id ?? null,
    });
  } catch (err) {
    console.error('invite-employee error:', err);
    return json(500, { error: (err as Error).message });
  }
});
