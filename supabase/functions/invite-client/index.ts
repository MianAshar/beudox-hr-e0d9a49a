import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { clientId, clientName, email, fullName, companyId } = await req.json();

    if (!clientId || !email || !companyId) {
      return json(400, { error: 'clientId, email, and companyId are required' });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return json(500, { error: 'Missing Supabase credentials' });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Check for existing client_users row
    const { data: existing } = await admin
      .from('client_users')
      .select('*')
      .eq('client_id', clientId)
      .eq('email', email.trim())
      .maybeSingle();

    let clientUserRow = existing;
    let authUserId: string | null = existing?.auth_user_id ?? null;

    // 2. Create auth user if no existing row
    if (!clientUserRow) {
      const { data: createData, error: createErr } = await admin.auth.admin.createUser({
        email: email.trim(),
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: fullName ?? null, role: 'client', client_id: clientId, company_id: companyId },
      });

      if (createErr) {
        const msg = (createErr.message || '').toLowerCase();
        if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
          const { data: list } = await admin.auth.admin.listUsers();
          const found = list?.users?.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
          if (found) {
            authUserId = found.id;
            await admin.auth.admin.updateUserById(found.id, { password: TEMP_PASSWORD });
          } else {
            return json(400, { error: createErr.message });
          }
        } else {
          return json(400, { error: createErr.message });
        }
      } else {
        authUserId = createData?.user?.id ?? null;
      }

      // Insert client_users row
      const { data: inserted, error: insertErr } = await admin
        .from('client_users')
        .insert({
          company_id: companyId,
          client_id: clientId,
          email: email.trim(),
          full_name: fullName || null,
          auth_user_id: authUserId,
          status: 'invited',
          invited_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (insertErr) return json(500, { error: insertErr.message });
      clientUserRow = inserted;
    } else if (!authUserId) {
      // Row exists but no auth user — create one
      const { data: createData, error: createErr } = await admin.auth.admin.createUser({
        email: email.trim(),
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: fullName ?? null, role: 'client', client_id: clientId, company_id: companyId },
      });
      if (!createErr) {
        authUserId = createData?.user?.id ?? null;
        if (authUserId) {
          await admin.from('client_users').update({ auth_user_id: authUserId }).eq('id', clientUserRow.id);
        }
      }
    }

    // 3. Send branded email via Resend
    if (!resendApiKey) {
      return json(200, { success: true, email_sent: false, error: 'RESEND_API_KEY not configured' });
    }

    const portalUrl = 'https://clients.forteestimating.com/login';
    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#120E36;max-width:520px;margin:0 auto;">
        <h2 style="color:#120E36;">Welcome${fullName ? `, ${fullName}` : ''}!</h2>
        <p>Forte Construction Estimating Services has invited you to view your project updates on the <strong>Forte Client Portal</strong>.</p>
        <div style="background:#F6F5FF;border-radius:10px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0;"><strong>Temporary password:</strong> ${TEMP_PASSWORD}</p>
        </div>
        <p>For your security, you will be asked to set a new password the first time you sign in.</p>
        <p><a href="${portalUrl}" style="display:inline-block;background:#5B3FF8;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">Access the Client Portal →</a></p>
        <p style="color:#9490B4;font-size:12px;margin-top:24px;">If you were not expecting this email, please ignore it or contact Forte Construction Estimating Services.</p>
      </div>
    `;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Forte Construction <noreply@beudox.com>',
        to: [email.trim()],
        subject: `You've been invited to the Forte Client Portal`,
        html,
      }),
    });

    const emailBody = await emailRes.text().catch(() => '');
    if (!emailRes.ok) {
      return json(200, { success: true, email_sent: false, email_error: emailBody, auth_user_id: authUserId });
    }

    return json(200, { success: true, email_sent: true, auth_user_id: authUserId, client_user: clientUserRow });

  } catch (err) {
    return json(500, { error: (err as Error).message });
  }
});
