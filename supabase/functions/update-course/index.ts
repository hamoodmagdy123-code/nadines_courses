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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResp("Missing authorization", 401);

    const supabase = getSupabaseClient(true);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) return errorResp("Unauthorized", 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return errorResp("Forbidden", 403);
    }

    const body = await req.json();
    const { course_id, ...updates } = body;

    if (!course_id) return errorResp("Missing course_id");

    // Only allow safe fields
    const allowed = [
      "title", "title_en", "description", "description_en",
      "curriculum", "curriculum_en", "egypt_price",
      "international_price_usd", "is_active", "sort_order",
      "image_url", "icon",
    ];
    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) safeUpdates[key] = updates[key];
    }

    if (Object.keys(safeUpdates).length === 0) {
      return errorResp("No valid fields to update");
    }

    const { error: updateErr } = await supabase
      .from("courses")
      .update(safeUpdates)
      .eq("id", course_id);

    if (updateErr) throw updateErr;

    return jsonResp({ message: "Course updated" });
  } catch (err) {
    console.error("update-course error:", err);
    return errorResp("Internal server error", 500);
  }
});
