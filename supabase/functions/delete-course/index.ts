import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  getCorsHeaders,
} from "../_shared/paymob.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req.headers.get("Origin")) });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResp("Missing authorization", 401);

    const supabase = getSupabaseClient(true);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return errorResp("Unauthorized", 401);

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return errorResp("Forbidden", 403);

    const body = await req.json();
    const { course_id } = body;

    if (!course_id) return errorResp("Missing course_id");

    // Check if course has orders
    const { count } = await supabase
      .from("orders").select("*", { count: "exact", head: true }).eq("course_id", course_id);

    if (count && count > 0) {
      return errorResp("Cannot delete course with existing orders. Deactivate it instead.");
    }

    const { error: deleteErr } = await supabase
      .from("courses").delete().eq("id", course_id);
    if (deleteErr) throw deleteErr;

    return jsonResp({ message: "Course deleted" });
  } catch (err) {
    console.error("delete-course error:", err instanceof Error ? err.message : "unknown");
    return errorResp("Internal server error", 500);
  }
});
