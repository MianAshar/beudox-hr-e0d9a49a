import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Unauthorized" });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return json(401, { error: "Unauthorized" });
    }

    const callerAuthId = claimsData.claims.sub as string;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: callerRole } = await admin.rpc(
      "get_employee_role_for_auth",
      { _auth_id: callerAuthId }
    );

    if (!callerRole || !["hr_manager", "ceo"].includes(callerRole)) {
      return json(403, { error: "Forbidden: insufficient role" });
    }

    const body = await req.json();
    const employee_id: string | undefined = body.employee_id;
    const reason: string | undefined = body.reason;

    if (!employee_id || typeof employee_id !== "string") {
      return json(400, { error: "employee_id is required" });
    }
    if (!reason || !reason.trim()) {
      return json(400, { error: "reason is required" });
    }
    if (reason.length > 500) {
      return json(400, { error: "reason must be 500 characters or fewer" });
    }

    const { data: emp, error: empError } = await admin
      .from("employees")
      .select("id, full_name, email, auth_user_id, status")
      .eq("id", employee_id)
      .single();

    if (empError || !emp) {
      return json(404, { error: "Employee not found" });
    }

    if (emp.status !== "inactive") {
      return json(409, { error: "Employee is not currently deactivated" });
    }

    const { error: updateErr } = await admin
      .from("employees")
      .update({
        status: "active",
        deactivation_reason: null,
        deactivation_notes: null,
      })
      .eq("id", employee_id);

    if (updateErr) {
      console.error("Failed to update employee status:", updateErr);
      return json(500, { error: "Failed to reactivate employee" });
    }

    if (emp.auth_user_id) {
      const { error: unbanErr } = await admin.auth.admin.updateUserById(
        emp.auth_user_id,
        { ban_duration: "none" }
      );
      if (unbanErr) {
        console.error("Failed to unban auth user:", unbanErr);
      }
    }

    if (resendApiKey && emp.email) {
      const portalUrl = "https://beudox-hr.lovable.app/login";
      const html = `
        <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#120E36; max-width:520px; margin:0 auto;">
          <h2 style="color:#120E36;">Account Reactivated</h2>
          <p>Hi ${emp.full_name},</p>
          <p>Good news — your Forte HR Portal account has been reactivated. You can now sign in again.</p>
          <div style="background:#F6F5FF; border-left:3px solid #5B3FF8; border-radius:8px; padding:14px 18px; margin:20px 0;">
            <p style="margin:0 0 4px 0; color:#9490B4; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Reason for reactivation</p>
            <p style="margin:0; font-weight:600;">${reason.trim()}</p>
          </div>
          <p><a href="${portalUrl}" style="display:inline-block; background:#5B3FF8; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none;">Sign in to the portal</a></p>
          <p style="color:#9490B4; font-size:12px; margin-top:24px;">— Forte HR</p>
        </div>
      `;

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Forte HR <noreply@beudox.com>",
            to: [emp.email],
            subject: "Your Forte HR Portal account has been reactivated",
            html,
          }),
        });
        if (!emailRes.ok) {
          console.error("Resend reactivation email failed:", await emailRes.text());
        }
      } catch (e) {
        console.error("Resend network error:", e);
      }
    }

    return json(200, { success: true });
  } catch (err) {
    console.error("reactivate-employee error:", err);
    return json(500, { error: (err as Error).message });
  }
});
