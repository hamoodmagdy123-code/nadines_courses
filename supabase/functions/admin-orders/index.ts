import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  corsHeaders,
} from "../_shared/paymob.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify admin JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResp("Missing authorization", 401);

    const supabase = getSupabaseClient(true);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) return errorResp("Unauthorized", 401);

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return errorResp("Forbidden", 403);
    }

    // Fetch orders with course info
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const courseId = url.searchParams.get("course_id");
    const showArchived = url.searchParams.get("archived") === "true";

    let query = supabase
      .from("orders")
      .select("*, courses(slug, title, title_en)")
      .eq("is_archived", showArchived)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (courseId) query = query.eq("course_id", courseId);

    const { data: orders, error: ordersErr } = await query;

    if (ordersErr) throw ordersErr;

    return jsonResp({ orders });
  } catch (err) {
    console.error("admin-orders error:", err);
    return errorResp("Internal server error", 500);
  }
});
