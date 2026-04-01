import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1';
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.100.1/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invoice_id, to_email, subject, message } = await req.json();

    if (!invoice_id || !to_email) {
      return new Response(JSON.stringify({ error: 'invoice_id and to_email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch invoice
    const { data: invoice, error: invErr } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .eq('id', invoice_id)
      .single();

    if (invErr || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build attachments
    const attachments: any[] = [];

    if (invoice.pdf_url) {
      try {
        const pdfResp = await fetch(invoice.pdf_url);
        if (pdfResp.ok) {
          const pdfBuffer = await pdfResp.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(pdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          attachments.push({
            filename: `${invoice.invoice_number}.pdf`,
            content: base64,
          });
        }
      } catch {
        console.error('Failed to fetch PDF for attachment');
      }
    }

    // Format message as HTML
    const htmlMessage = (message || '').replace(/\n/g, '<br/>');

    // Send via Resend
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Beudox <noreply@beudox.com>',
        to: [to_email],
        subject: subject || invoice.title,
        html: `
          <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="margin-bottom: 24px;">
              ${htmlMessage}
            </div>
            <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 24px; color: #888; font-size: 12px;">
              <p>This email was sent from Beudox HR Platform.</p>
            </div>
          </div>
        `,
        attachments,
      }),
    });

    if (!resendResp.ok) {
      const errBody = await resendResp.text();
      return new Response(JSON.stringify({ error: `Resend error: ${errBody}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update invoice status and sent_at
    await supabase
      .from('invoices')
      .update({ sent_at: new Date().toISOString(), status: 'sent' })
      .eq('id', invoice_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
