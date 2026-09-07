import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteClientBody {
  clientId: string
  clientName: string
  email: string
  fullName: string
  companyId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase environment variables' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as Partial<InviteClientBody>
    const { clientId, clientName, email, fullName, companyId } = body

    if (!clientId || !email || !companyId) {
      return new Response(JSON.stringify({ error: 'clientId, email, and companyId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1. Check for existing client_users row for this email + client_id
    const { data: existing, error: lookupError } = await supabase
      .from('client_users')
      .select('*')
      .eq('client_id', clientId)
      .eq('email', email)
      .maybeSingle()

    if (lookupError) {
      return new Response(JSON.stringify({ error: lookupError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Insert only if no row exists
    let clientUserRow = existing
    if (!clientUserRow) {
      const { data: inserted, error: insertError } = await supabase
        .from('client_users')
        .insert({
          company_id: companyId,
          client_id: clientId,
          email,
          full_name: fullName || null,
          status: 'invited',
          invited_at: new Date().toISOString(),
        })
        .select('*')
        .single()

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      clientUserRow = inserted
    }

    // 3. Send auth invite email (soft fail — row creation is the source of truth)
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://clients.forteestimating.com/auth/callback',
      data: {
        client_id: clientId,
        company_id: companyId,
        role: 'client',
        full_name: fullName || null,
        client_name: clientName || null,
        email_subject: 'Forte Construction — Your project portal is ready',
      },
    })

    if (inviteError) {
      // Soft fail on email: still return the client_users row
      return new Response(
        JSON.stringify({
          success: true,
          emailSent: false,
          emailError: inviteError.message,
          clientUser: clientUserRow,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // 4. Success
    return new Response(
      JSON.stringify({ success: true, emailSent: true, clientUser: clientUserRow }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
