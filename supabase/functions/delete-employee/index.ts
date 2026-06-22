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

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is hr_manager or ceo
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

    // Resolve caller's own employee id to block self-deletion by non-CEO managers
    const { data: callerEmployeeId } = await adminClient.rpc(
      "get_employee_id_for_auth",
      { _auth_id: callerAuthId }
    );

    // Parse body
    const body = await req.json();
    const employeeId = body.employee_id;

    if (!employeeId || typeof employeeId !== "string") {
      return new Response(
        JSON.stringify({ error: "employee_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (callerRole !== "ceo" && callerEmployeeId === employeeId) {
      return new Response(
        JSON.stringify({ error: "You cannot delete your own account." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the employee
    const { data: emp, error: empError } = await adminClient
      .from("employees")
      .select("auth_user_id, full_name")
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

    // Cascade delete in order — use service role to bypass RLS
    const tables: { table: string; column: string }[] = [
      { table: "daily_evaluation_scores", column: "daily_evaluation_id" },
    ];

    // Delete daily_evaluation_scores via daily_evaluations
    const { data: dailyEvals } = await adminClient
      .from("daily_evaluations")
      .select("id")
      .eq("reviewee_id", employeeId);

    if (dailyEvals && dailyEvals.length > 0) {
      const evalIds = dailyEvals.map((e) => e.id);
      await adminClient
        .from("daily_evaluation_scores")
        .delete()
        .in("daily_evaluation_id", evalIds);
    }

    // Delete evaluation_scores via evaluations
    const { data: evals } = await adminClient
      .from("evaluations")
      .select("id")
      .eq("employee_id", employeeId);

    if (evals && evals.length > 0) {
      const evalIds = evals.map((e) => e.id);
      await adminClient
        .from("evaluation_scores")
        .delete()
        .in("evaluation_id", evalIds);
    }

    // Delete loan_monthly_overrides via loans
    const { data: loans } = await adminClient
      .from("loans")
      .select("id")
      .eq("employee_id", employeeId);

    if (loans && loans.length > 0) {
      const loanIds = loans.map((l) => l.id);
      await adminClient
        .from("loan_monthly_overrides")
        .delete()
        .in("loan_id", loanIds);
    }

    // Delete leave_balance_history rows tied to this employee's leave_balances
    // BEFORE deleting leave_balances themselves.
    const { data: balances } = await adminClient
      .from("leave_balances")
      .select("id")
      .eq("employee_id", employeeId);

    if (balances && balances.length > 0) {
      const balanceIds = balances.map((b) => b.id);
      await adminClient
        .from("leave_balance_history")
        .delete()
        .in("leave_balance_id", balanceIds);
    }

    // Delete daily_evaluation_scores tied to evaluations where this employee was the reviewer
    const { data: reviewerEvals } = await adminClient
      .from("daily_evaluations")
      .select("id")
      .eq("reviewer_id", employeeId);

    if (reviewerEvals && reviewerEvals.length > 0) {
      const ids = reviewerEvals.map((e) => e.id);
      await adminClient
        .from("daily_evaluation_scores")
        .delete()
        .in("daily_evaluation_id", ids);
    }

    // Direct deletes (rows owned by this employee)
    const directDeletes: { table: string; column: string }[] = [
      { table: "employee_roles", column: "employee_id" },
      { table: "attendance_records", column: "employee_id" },
      { table: "payroll_records", column: "employee_id" },
      { table: "leave_requests", column: "employee_id" },
      { table: "leave_balances", column: "employee_id" },
      { table: "daily_evaluations", column: "reviewee_id" },
      { table: "daily_evaluations", column: "reviewer_id" },
      { table: "evaluations", column: "employee_id" },
      { table: "project_assignments", column: "employee_id" },
      { table: "loans", column: "employee_id" },
      { table: "salary_history", column: "employee_id" },
      { table: "login_logs", column: "employee_id" },
      { table: "notifications", column: "recipient_id" },
      { table: "notification_preferences", column: "employee_id" },
      { table: "project_activity_logs", column: "employee_id" },
    ];

    for (const { table, column } of directDeletes) {
      const { error } = await adminClient
        .from(table)
        .delete()
        .eq(column, employeeId);

      if (error) {
        console.error(`Error deleting from ${table}.${column}:`, error);
      }
    }

    // Nullify "actor" references on rows owned by other entities so the
    // employee row can be deleted without violating FK constraints.
    const nullifyRefs: { table: string; column: string }[] = [
      { table: "projects", column: "project_lead_id" },
      { table: "project_tasks", column: "completed_by" },
      { table: "project_tasks", column: "created_by" },
      { table: "project_tasks", column: "assigned_to" },
      { table: "project_assignments", column: "assigned_by" },
      { table: "attendance_imports", column: "uploaded_by" },
      { table: "leave_balance_history", column: "adjusted_by" },
      { table: "leave_requests", column: "actioned_by" },
      { table: "payroll_records", column: "approved_by" },
      { table: "payroll_records", column: "payment_processed_by" },
      { table: "loans", column: "granted_by" },
      { table: "loan_monthly_overrides", column: "created_by" },
      { table: "office_expenses", column: "approved_by" },
      { table: "office_expenses", column: "added_by" },
      { table: "outsourcing_records", column: "added_by" },
      { table: "evaluations", column: "evaluated_by" },
      { table: "salary_history", column: "approved_by" },
      { table: "salary_history", column: "rejected_by" },
      { table: "salary_history", column: "proposed_by" },
      { table: "invoices", column: "generated_by" },
      { table: "invoice_payments", column: "recorded_by" },
      { table: "hr_documents", column: "created_by" },
      { table: "hr_documents", column: "updated_by" },
    ];

    for (const { table, column } of nullifyRefs) {
      const { error } = await adminClient
        .from(table)
        .update({ [column]: null })
        .eq(column, employeeId);

      if (error) {
        console.error(`Error nullifying ${table}.${column}:`, error);
      }
    }

    // Delete the employee record itself
    const { error: deleteEmpError } = await adminClient
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (deleteEmpError) {
      console.error("Error deleting employee:", deleteEmpError);
      // Do NOT abort — we still want to remove the auth user below if possible,
      // otherwise we leave behind an orphaned auth.users row that blocks
      // re-inviting the same email later.
    }

    // Always attempt to hard-delete the auth user so the email can be reused.
    if (emp.auth_user_id) {
      const { error: authDeleteError } =
        await adminClient.auth.admin.deleteUser(emp.auth_user_id);

      if (authDeleteError) {
        console.error("Error deleting auth user:", authDeleteError);
      } else {
        console.log("Deleted auth user:", emp.auth_user_id);
      }
    }

    if (deleteEmpError) {
      return new Response(
        JSON.stringify({ error: "Failed to delete employee record" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, deleted: emp.full_name }),
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
