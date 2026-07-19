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
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser(token);

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
    const { order_id, action } = body;

    if (!order_id || !action) {
      return errorResp("Missing order_id or action");
    }

    if (action === "archive") {
      const { error } = await supabase
        .from("orders")
        .update({ is_archived: true })
        .eq("id", order_id);
      if (error) throw error;
      return jsonResp({ message: "Order archived" });
    }

    if (action === "restore") {
      const { error } = await supabase
        .from("orders")
        .update({ is_archived: false })
        .eq("id", order_id);
      if (error) throw error;
      return jsonResp({ message: "Order restored" });
    }

    if (action === "permanent-delete") {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", order_id);
      if (error) throw error;
      return jsonResp({ message: "Order permanently deleted" });
    }

    return errorResp("Unknown action");
  } catch (err) {
    console.error("admin-update-order error:", err);
    return errorResp("Internal server error", 500);
  }
});
