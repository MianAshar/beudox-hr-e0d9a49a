// One-off admin utility: regenerate signed URLs for existing rows in
// employees.avatar_url and invoices.pdf_url, since their storage buckets
// were flipped from public to private. Idempotent — safe to re-run.
//
// Auth: requires CEO caller (JWT). No body required.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ONE_YEAR = 60 * 60 * 24 * 365;

function extractPath(url: string, bucket: string): string | null {
  if (!url) return null;
  // matches /storage/v1/object/(public|sign)/<bucket>/<path>?...
  const re = new RegExp(`/object/(?:public|sign)/${bucket}/([^?]+)`);
  const m = url.match(re);
  return m ? decodeURIComponent(m[1]) : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authed = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await authed.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: isCeo } = await admin.rpc('auth_has_role', {
      _auth_id: claims.claims.sub,
      _role: 'ceo',
    });
    if (!isCeo) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const report: Record<string, { updated: number; skipped: number; failed: number }> = {
      'employee-avatars': { updated: 0, skipped: 0, failed: 0 },
      'invoice-pdfs': { updated: 0, skipped: 0, failed: 0 },
      'expense-receipts': { updated: 0, skipped: 0, failed: 0 },
    };

    // --- employees.avatar_url ---
    const { data: emps } = await admin
      .from('employees')
      .select('id, avatar_url')
      .not('avatar_url', 'is', null);
    for (const e of emps ?? []) {
      const path = extractPath(e.avatar_url, 'employee-avatars');
      if (!path) { report['employee-avatars'].skipped++; continue; }
      const { data: s, error } = await admin.storage
        .from('employee-avatars')
        .createSignedUrl(path, ONE_YEAR);
      if (error || !s?.signedUrl) { report['employee-avatars'].failed++; continue; }
      const url = `${s.signedUrl}${s.signedUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
      const upd = await admin.from('employees').update({ avatar_url: url }).eq('id', e.id);
      if (upd.error) report['employee-avatars'].failed++;
      else report['employee-avatars'].updated++;
    }

    // --- invoices.pdf_url ---
    const { data: invs } = await admin
      .from('invoices')
      .select('id, pdf_url')
      .not('pdf_url', 'is', null);
    for (const i of invs ?? []) {
      const path = extractPath(i.pdf_url, 'invoice-pdfs');
      if (!path) { report['invoice-pdfs'].skipped++; continue; }
      const { data: s, error } = await admin.storage
        .from('invoice-pdfs')
        .createSignedUrl(path, ONE_YEAR);
      if (error || !s?.signedUrl) { report['invoice-pdfs'].failed++; continue; }
      const upd = await admin.from('invoices').update({ pdf_url: s.signedUrl }).eq('id', i.id);
      if (upd.error) report['invoice-pdfs'].failed++;
      else report['invoice-pdfs'].updated++;
    }

    // --- monthly_expenses.receipt_url ---
    const { data: exps } = await admin
      .from('monthly_expenses')
      .select('id, receipt_url')
      .not('receipt_url', 'is', null);
    for (const x of exps ?? []) {
      const path = extractPath(x.receipt_url, 'expense-receipts');
      if (!path) { report['expense-receipts'].skipped++; continue; }
      const { data: s, error } = await admin.storage
        .from('expense-receipts')
        .createSignedUrl(path, ONE_YEAR);
      if (error || !s?.signedUrl) { report['expense-receipts'].failed++; continue; }
      const upd = await admin.from('monthly_expenses').update({ receipt_url: s.signedUrl }).eq('id', x.id);
      if (upd.error) report['expense-receipts'].failed++;
      else report['expense-receipts'].updated++;
    }

    return new Response(JSON.stringify({ ok: true, report }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
