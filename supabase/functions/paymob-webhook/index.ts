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
    const url = new URL(req.url);
    const hmac = url.searchParams.get("hmac");
    const body = await req.json();
    const obj = body.obj;

    console.log("Webhook received:", JSON.stringify(body));

    if (!hmac) {
      return errorResp("Missing HMAC", 401);
    }

    if (!obj) {
      return errorResp("Missing obj in body", 400);
    }

    const hmacSecret = Deno.env.get("PAYMOB_HMAC_SECRET")!;

    if (!hmacSecret) {
      console.error("PAYMOB_HMAC_SECRET not set!");
      return errorResp("HMAC secret not configured", 500);
    }

    // Intention API HMAC fields in exact order
    const fields = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ];

    const hmacString = fields.filter((f) => f !== undefined).join("");

    const encoder = new TextEncoder();
    const keyData = encoder.encode(hmacSecret);
    const msgData = encoder.encode(hmacString);

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

    // Find order by special_reference (our order.id) or paymob_order_id
    const paymobOrderId = String(obj.order?.id);
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .or(`paymob_order_id.eq.${paymobOrderId},id.eq.${obj.special_reference || ""}`)
      .single();

    if (orderErr || !order) {
      console.error("Order not found for paymob_order_id:", paymobOrderId);
      return errorResp("Order not found", 404);
    }

    // Idempotency
    if (order.status === "paid" || order.status === "failed") {
      return jsonResp({ message: "Already processed", status: order.status });
    }

    if (obj.success) {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "paid",
          hmac_verified: true,
          paymob_transaction_id: String(obj.id),
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
