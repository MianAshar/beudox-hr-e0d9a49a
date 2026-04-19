import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1';
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.100.1/cors';

interface NotificationPayload {
  company_id: string;
  recipient_ids: string[];
  type: string;
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();

    if (!payload.company_id || !payload.type || !payload.title || !payload.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!payload.recipient_ids?.length) {
      return new Response(JSON.stringify({ success: true, count: 0, skipped_reason: 'no_recipients' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch recipient channel preferences (global toggles)
    const { data: employees } = await supabase
      .from('employees')
      .select('id, email, notifications_enabled, in_app_notifications_enabled')
      .in('id', payload.recipient_ids);

    const empMap = new Map(
      (employees || []).map((e: any) => [
        e.id,
        {
          email: e.email,
          email_enabled: e.notifications_enabled !== false,
          in_app_enabled: e.in_app_notifications_enabled !== false,
        },
      ]),
    );

    // Fetch per-type preferences for these recipients
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('employee_id, in_app_enabled, email_enabled')
      .in('employee_id', payload.recipient_ids)
      .eq('notification_type', payload.type);

    const prefMap = new Map(
      (prefs || []).map((p: any) => [
        p.employee_id,
        {
          in_app: p.in_app_enabled !== false,
          email: p.email_enabled !== false,
        },
      ]),
    );

    // Determine which recipients should receive in-app and which should receive email
    const inAppRecipients: string[] = [];
    const emailEnabledFor = new Set<string>();

    for (const id of payload.recipient_ids) {
      const emp = empMap.get(id);
      if (!emp) continue;
      // If no preference row, default true
      const pref = prefMap.get(id) || { in_app: true, email: true };
      const sendInApp = emp.in_app_enabled && pref.in_app;
      const sendEmail = emp.email_enabled && pref.email;
      if (sendInApp) inAppRecipients.push(id);
      if (sendEmail) emailEnabledFor.add(id);
    }

    if (inAppRecipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, count: 0, skipped: payload.recipient_ids.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Insert in-app notifications only for those that pass both filters
    const notifications = inAppRecipients.map((recipientId) => ({
      company_id: payload.company_id,
      recipient_id: recipientId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      reference_type: payload.reference_type || null,
      reference_id: payload.reference_id || null,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select('id, recipient_id');

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send emails only to those whose email channel + type pref are both enabled
    if (resendKey && inserted) {
      for (const notif of inserted) {
        if (!emailEnabledFor.has(notif.recipient_id)) continue;
        const emp = empMap.get(notif.recipient_id);
        const email = emp?.email;
        if (!email) continue;

        try {
          const resendResp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Beudox <noreply@beudox.com>',
              to: [email],
              subject: payload.title,
              html: `
                <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
                  <div style="margin-bottom: 24px;">
                    <p style="font-size: 16px; color: #1a1a2e;">${payload.message}</p>
                  </div>
                  <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 24px; color: #888; font-size: 12px;">
                    <p>This email was sent from Beudox HR Platform.</p>
                  </div>
                </div>
              `,
            }),
          });

          if (resendResp.ok) {
            await supabase
              .from('notifications')
              .update({ email_sent: true, email_sent_at: new Date().toISOString() })
              .eq('id', notif.id);
          }
        } catch (emailErr) {
          console.error('Email send failed for', email, emailErr);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, count: inserted?.length || 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-notification error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
