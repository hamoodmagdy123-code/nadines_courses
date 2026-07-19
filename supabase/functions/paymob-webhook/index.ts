import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  corsHeaders,
  serve,
} from "../_shared/paymob.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { hmac, success, id: transaction_id, order: paymob_order } = body;

    if (!hmac) {
      return errorResp("Missing HMAC", 401);
    }

    // Verify HMAC
    const hmacSecret = Deno.env.get("PAYMOB_HMAC_SECRET")!;

    // Paymob HMAC fields in order (from their docs)
    const fields = [
      paymob_order?.id,
      paymob_order?.created_at,
      paymob_order?.processed_at,
      paymob_order?.currency,
      paymob_order?.amount_needed_cents,
      paymob_order?.amount_paid_cents,
      paymob_order?.captured_amount_cents,
      paymob_order?.refund_credit_cents,
      paymob_order?.is_refunded,
      paymob_order?.is_captured,
      body?.integration_id,
      body?.profile_id,
      transaction_id,
      body?.source_data?.type,
      body?.source_data?.subtype,
    ];

    const hmacString = fields.filter((f) => f !== undefined).join("");

    const encoder = new TextEncoder();
    const keyData = encoder.encode(hmacSecret);
    const msgData = encoder.encode(hmacString);

    // HMAC-SHA512
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    const computedHmac = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedHmac !== hmac) {
      console.error("HMAC mismatch:", { computed: computedHmac, received: hmac });
      return errorResp("Invalid HMAC", 401);
    }

    const supabase = getSupabaseClient(true);

    // Find the order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("paymob_order_id", String(paymob_order?.id))
      .single();

    if (orderErr || !order) {
      console.error("Order not found for paymob_order_id:", paymob_order?.id);
      return errorResp("Order not found", 404);
    }

    // Idempotency: skip if already processed
    if (order.status === "paid" || order.status === "failed") {
      return jsonResp({ message: "Order already processed", status: order.status });
    }

    if (success) {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "paid",
          hmac_verified: true,
          paymob_transaction_id: String(transaction_id),
        })
        .eq("id", order.id);

      if (updateErr) throw updateErr;
      return jsonResp({ message: "Order marked as paid", order_id: order.id });
    } else {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      if (updateErr) throw updateErr;
      return jsonResp({ message: "Order marked as failed", order_id: order.id });
    }
  } catch (err) {
    console.error("paymob-webhook error:", err);
    return errorResp("Internal server error", 500);
  }
});
