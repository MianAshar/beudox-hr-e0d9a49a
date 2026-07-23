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
    const { email } = await req.json();

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

    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Resetting password for: ${normalizedEmail}`);

    // 1) Find the active employee by email.
    const { data: employee, error: findErr } = await admin
      .from('employees')
      .select('id, auth_user_id, full_name, status, email')
      .eq('email', normalizedEmail)
      .eq('status', 'active')
      .maybeSingle();

    if (findErr) {
      console.error('employee lookup error:', findErr);
      return json(500, { error: 'Could not look up employee record.' });
    }

    if (!employee) {
      // Return the same generic message as a successful send to avoid leaking account existence.
      console.log(`No active employee found for ${normalizedEmail}`);
      return json(200, {
        success: true,
        email_sent: true,
        message:
          'If an active employee account exists for this email, a password reset message has been sent.',
      });
    }

    if (!employee.auth_user_id) {
      console.log(`Employee found but no auth_user_id: ${employee.id}`);
      return json(400, {
        error:
          'This employee account is not linked to a login identity. Please contact your administrator.',
      });
    }

    // 2) Reset the auth password to the temporary password.
    const { error: updateAuthErr } = await admin.auth.admin.updateUserById(
      employee.auth_user_id,
      { password: TEMP_PASSWORD },
    );

    if (updateAuthErr) {
      console.error('auth password reset error:', updateAuthErr);
      return json(500, {
        error: 'Could not reset password. Please contact your administrator.',
      });
    }

    // 3) Mark the employee record so they must change the password on next login.
    const { error: updateDbErr } = await admin
      .from('employees')
      .update({ must_change_password: true })
      .eq('id', employee.id);

    if (updateDbErr) {
      console.error('employee must_change_password update error:', updateDbErr);
      return json(500, {
        error: 'Password was reset but the account flag could not be updated.',
      });
    }

    console.log(
      `Password reset for employee ${employee.id} / auth ${employee.auth_user_id}`,
    );

    // 4) Send the reset email via Resend.
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return json(502, {
        error:
          'Email provider is not configured (RESEND_API_KEY missing). The password was reset but the notification email was not sent.',
      });
    }

    const portalUrl = 'https://portal.forteestimating.com/login';
    const html = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#120E36; max-width:520px; margin:0 auto;">
        <h2 style="color:#120E36;">Password reset${employee.full_name ? `, ${employee.full_name}` : ''}</h2>
        <p>Your Forte HR Portal password has been reset. Use the credentials below to sign in.</p>
        <div style="background:#F6F5FF; border-radius:10px; padding:16px 20px; margin:20px 0;">
          <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${normalizedEmail}</p>
          <p style="margin:0;"><strong>Temporary password:</strong> ${TEMP_PASSWORD}</p>
        </div>
        <p>For your security, you'll be required to set a new password as soon as you sign in.</p>
        <p><a href="${portalUrl}" style="display:inline-block; background:#5B3FF8; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none;">Sign in to the portal</a></p>
        <p style="color:#9490B4; font-size:12px; margin-top:24px;">If you did not request this reset, please contact your HR administrator immediately.</p>
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
          from: 'Forte HR <noreply@beudox.com>',
          to: [normalizedEmail],
          subject: 'Your Forte HR Portal password has been reset',
          html,
        }),
      });
    } catch (networkErr) {
      console.error('Resend network error:', networkErr);
      return json(502, {
        error:
          'Could not reach email provider. The password was reset but the notification email failed.',
      });
    }

    const responseText = await emailRes.text();
    let responseBody: any = null;
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      /* ignore */
    }

    if (!emailRes.ok) {
      console.error(`Resend rejected send [${emailRes.status}]:`, responseText);
      const providerMessage =
        responseBody?.message ||
        responseBody?.error ||
        responseText ||
        'Unknown email provider error';

      const lower = String(providerMessage).toLowerCase();
      const looksLikeSandbox =
        lower.includes('verify a domain') ||
        lower.includes('testing emails') ||
        lower.includes('only send testing') ||
        lower.includes('domain is not verified') ||
        lower.includes('owner');

      return json(502, {
        error: looksLikeSandbox
          ? `Email could not be delivered: Resend is in sandbox mode and only allows sending to your verified Resend account email. Verify a sender domain in Resend (or change RESEND_API_KEY) to send to ${normalizedEmail}.`
          : `Email could not be delivered: ${providerMessage}`,
        provider_status: emailRes.status,
        email_sent: false,
      });
    }

    console.log(`Resend accepted email. id=${responseBody?.id ?? 'unknown'}`);

    return json(200, {
      success: true,
      email_sent: true,
      message:
        'If an active employee account exists for this email, a password reset message has been sent.',
    });
  } catch (err) {
    console.error('reset-employee-password error:', err);
    return json(500, { error: (err as Error).message });
  }
});
