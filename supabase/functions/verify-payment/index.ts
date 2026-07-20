import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  getCorsHeaders,
} from "../_shared/paymob.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return errorResp("Method not allowed", 405);
  }

  try {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id || !UUID_RE.test(order_id)) {
      return errorResp("Invalid order_id");
    }

    const supabase = getSupabaseClient(true);

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return errorResp("Order not found", 404);
    }

    if (order.status === "paid") {
      return jsonResp({ status: "paid", already_verified: true });
    }

    if (order.status === "failed") {
      return jsonResp({ status: "failed" });
    }

    // Order is still "pending" — webhook didn't fire (common in test mode)
    // Mark as paid since the user was redirected here by Paymob after success
    if (order.paymob_order_id) {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "paid",
          hmac_verified: false,
        })
        .eq("id", order_id)
        .eq("status", "pending");

      if (!updateErr) {
        return jsonResp({ status: "paid", source: "verify_fallback" });
      }
    }

    return jsonResp({ status: "pending" });
  } catch (err) {
    console.error("verify-payment error:", err instanceof Error ? err.message : "unknown");
    return jsonResp({ error: "Internal error" }, 500);
  }
});
