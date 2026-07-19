import { getSupabaseClient, jsonResp, errorResp, corsHeaders } from "../_shared/paymob.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient(true);
    const body = await req.json().catch(() => ({}));
    const action = body.action || "reset";

    if (action === "reset") {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "pending" })
        .eq("status", "paid")
        .select("id");
      if (error) throw error;
      return jsonResp({ message: `Reset ${data.length} orders to pending` });
    }

    if (action === "mark_paid") {
      const orderIds = body.order_ids as string[];
      if (!orderIds?.length) return errorResp("Missing order_ids");
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .in("id", orderIds)
        .select("id, customer_name, customer_email, amount");
      if (error) throw error;
      return jsonResp({ message: `Marked ${data.length} as paid`, orders: data });
    }

    return errorResp("Unknown action");
  } catch (err) {
    console.error("fix-orders error:", err);
    return errorResp("Internal server error", 500);
  }
});
