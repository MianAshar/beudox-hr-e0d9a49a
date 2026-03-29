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

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is authenticated
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerAuthId = claimsData.claims.sub as string;

    // Verify caller is hr_manager or ceo
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerRole } = await adminClient.rpc(
      "get_employee_role_for_auth",
      { _auth_id: callerAuthId }
    );

    if (!callerRole || !["hr_manager", "ceo"].includes(callerRole)) {
      return new Response(
        JSON.stringify({ error: "Forbidden: insufficient role" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse body
    const body = await req.json();
    const employeeId = body.employee_id;
    const reactivate = body.reactivate === true;

    if (!employeeId || typeof employeeId !== "string") {
      return new Response(
        JSON.stringify({ error: "employee_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the employee's auth_user_id
    const { data: emp, error: empError } = await adminClient
      .from("employees")
      .select("auth_user_id")
      .eq("id", employeeId)
      .single();

    if (empError || !emp) {
      return new Response(
        JSON.stringify({ error: "Employee not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Ban or unban the auth user
    if (emp.auth_user_id) {
      const { error: updateError } =
        await adminClient.auth.admin.updateUserById(emp.auth_user_id, {
          ban_duration: reactivate ? "none" : "876600h", // ~100 years
        });

      if (updateError) {
        console.error("Auth user update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update auth user" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: reactivate ? "reactivated" : "deactivated",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
