import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REASON_LABELS: Record<string, string> = {
  resigned: "Employee Resigned",
  fired: "Employee Fired",
  other: "Other",
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

    // Prevent non-CEO managers from deactivating their own account
    const { data: callerEmployeeId } = await admin.rpc(
      "get_employee_id_for_auth",
      { _auth_id: callerAuthId }
    );

    const body = await req.json();
    const employee_id: string | undefined = body.employee_id;
    const reason: string | undefined = body.reason;
    const custom_reason: string | undefined = body.custom_reason;

    if (!employee_id || typeof employee_id !== "string") {
      return json(400, { error: "employee_id is required" });
    }
    if (callerRole !== "ceo" && callerEmployeeId === employee_id) {
      return json(403, { error: "You cannot deactivate your own account." });
    }
    if (!reason || !["resigned", "fired", "other"].includes(reason)) {
      return json(400, { error: "Invalid reason" });
    }
    if (reason === "other" && (!custom_reason || !custom_reason.trim())) {
      return json(400, { error: "custom_reason is required when reason is 'other'" });
    }
    if (custom_reason && custom_reason.length > 500) {
      return json(400, { error: "custom_reason must be 500 characters or fewer" });
    }

    const { data: emp, error: empError } = await admin
      .from("employees")
      .select("id, full_name, email, auth_user_id, status")
      .eq("id", employee_id)
      .single();

    if (empError || !emp) {
      return json(404, { error: "Employee not found" });
    }

    if (emp.status === "inactive") {
      return json(409, { error: "Employee is already deactivated" });
    }

    const reasonLabel =
      reason === "other" ? (custom_reason as string).trim() : REASON_LABELS[reason];

    const { error: updateErr } = await admin
      .from("employees")
      .update({
        status: "inactive",
        deactivation_reason: reasonLabel,
        deactivation_notes: reason === "other" ? (custom_reason as string).trim() : null,
      })
      .eq("id", employee_id);

    if (updateErr) {
      console.error("Failed to update employee status:", updateErr);
      return json(500, { error: "Failed to deactivate employee" });
    }

    // Ban auth user so login is blocked (LoginV1 catches user_banned)
    if (emp.auth_user_id) {
      const { error: banErr } = await admin.auth.admin.updateUserById(
        emp.auth_user_id,
        { ban_duration: "876000h" }
      );
      if (banErr) {
        console.error("Failed to ban auth user:", banErr);
      }
    }

    // Send Forte-branded email (best effort)
    if (resendApiKey && emp.email) {
      const html = `
        <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#120E36; max-width:520px; margin:0 auto;">
          <h2 style="color:#120E36;">Account Deactivated</h2>
          <p>Hi ${emp.full_name},</p>
          <p>Your Forte HR Portal account has been deactivated and you will no longer be able to sign in.</p>
          <p>If you believe this is a mistake, please contact your HR administrator.</p>
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
            subject: "Your Forte HR Portal account has been deactivated",
            html,
          }),
        });
        if (!emailRes.ok) {
          console.error("Resend deactivation email failed:", await emailRes.text());
        }
      } catch (e) {
        console.error("Resend network error:", e);
      }
    }

    return json(200, { success: true });
  } catch (err) {
    console.error("deactivate-employee error:", err);
    return json(500, { error: (err as Error).message });
  }
});
