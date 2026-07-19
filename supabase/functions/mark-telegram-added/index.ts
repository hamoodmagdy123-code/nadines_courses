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
    const { order_id } = body;

    if (!order_id) return errorResp("Missing order_id");

    // Check order exists and is paid
    const { data: order } = await supabase
      .from("orders")
      .select("status, telegram_added")
      .eq("id", order_id)
      .single();

    if (!order) return errorResp("Order not found", 404);
    if (order.status !== "paid") return errorResp("Order is not paid");
    if (order.telegram_added) return errorResp("Already marked as delivered");

    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        telegram_added: true,
        telegram_added_at: new Date().toISOString(),
        telegram_added_by: user.id,
      })
      .eq("id", order_id);

    if (updateErr) throw updateErr;

    return jsonResp({ message: "Order marked as delivered on Telegram" });
  } catch (err) {
    console.error("mark-telegram-added error:", err);
    return errorResp("Internal server error", 500);
  }
});
