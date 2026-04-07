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

    if (!payload.company_id || !payload.recipient_ids?.length || !payload.type || !payload.title || !payload.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, serviceKey);

    // Insert notifications for each recipient
    const notifications = payload.recipient_ids.map((recipientId) => ({
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

    // Send emails if Resend key is available
    if (resendKey && inserted) {
      // Fetch recipient emails
      const { data: employees } = await supabase
        .from('employees')
        .select('id, email')
        .in('id', payload.recipient_ids);

      const emailMap = new Map((employees || []).map((e: any) => [e.id, e.email]));

      for (const notif of inserted) {
        const email = emailMap.get(notif.recipient_id);
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
          // Don't block - notification is still saved
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
