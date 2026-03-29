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
    // Validate JWT from request
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

    // Verify the calling user is authenticated
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    console.log('Calling user ID:', user?.id);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user has hr_manager or ceo role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.rpc('get_employee_role_for_auth', {
      _auth_id: user.id,
    });
    console.log('Caller role:', roleData);
    if (!roleData || !['hr_manager', 'ceo'].includes(roleData)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: insufficient role' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate body
    const body = await req.json();
    const { email, employee_id } = body;
    console.log('Request body:', { email, employee_id });

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

    // Generate invite link
    console.log('Generating invite link for:', email);
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: 'invite',
        email,
      });
    console.log('generateLink result:', { userId: linkData?.user?.id, error: linkError?.message });

    if (linkError) {
      console.error('Generate link error:', linkError);
      return new Response(
        JSON.stringify({ error: linkError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the employee's auth_user_id if a new user was created
    if (linkData?.user?.id) {
      await adminClient
        .from('employees')
        .update({ auth_user_id: linkData.user.id })
        .eq('id', employee_id);
      console.log('Updated employee auth_user_id:', employee_id);
    }

    // Extract the action link
    const actionLink = linkData?.properties?.action_link;
    console.log('Action link:', actionLink);

    // Send invite email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're Invited to Beudox</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'DM Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px;text-align:center;">
              <h1 style="margin:0;font-family:'Outfit','DM Sans',Arial,sans-serif;font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;">
                Welcome to Beudox
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 40px 16px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4a68;">
                Hi there,
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a4a68;">
                You've been invited to join <strong style="color:#1a1a2e;">Beudox</strong> — your team's workspace for streamlined HR and project management.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#4a4a68;">
                Click the button below to accept your invitation and set up your password.
              </p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 28px;text-align:center;">
              <a href="${actionLink}" target="_blank" style="display:inline-block;background-color:#5B3FF8;color:#ffffff;font-family:'DM Sans',Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                Accept Invite &amp; Set Password
              </a>
            </td>
          </tr>
          <!-- Expiry note -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#9393ab;text-align:center;">
                This invitation link expires in 24 hours. If you didn't expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #ececf1;text-align:center;">
              <p style="margin:0;font-size:12px;color:#b0b0c3;">
                &copy; ${new Date().getFullYear()} Beudox. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Beudox <noreply@beudox.com>',
        to: [email],
        subject: 'You have been invited to Beudox',
        html: emailHtml,
      }),
    });

    const resendStatus = resendRes.status;
    const resendBody = await resendRes.json();
    console.log('Resend response:', resendStatus, resendBody);

    if (!resendRes.ok) {
      console.error('Resend error:', resendBody);
      return new Response(
        JSON.stringify({ error: 'Failed to send invite email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: `Invite sent to ${email}` }),
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
