import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  getCorsHeaders,
  timingSafeEqual,
} from "../_shared/paymob.ts";

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
    const url = new URL(req.url);
    const hmacParam = url.searchParams.get("hmac");

    if (!hmacParam) {
      return errorResp("Missing HMAC", 401);
    }

    const body = await req.json();
    const obj = body.obj;

    if (!obj) {
      return errorResp("Invalid payload", 400);
    }

    const hmacSecret = Deno.env.get("PAYMOB_HMAC_SECRET");
    if (!hmacSecret) {
      return errorResp("HMAC secret not configured", 500);
    }

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

    if (!timingSafeEqual(computedHmac, hmacParam)) {
      return errorResp("Invalid HMAC", 401);
    }

    const supabase = getSupabaseClient(true);

    const paymobOrderId = String(obj.order?.id || "");
    const transactionId = String(obj.id || "");
    const specialRef = obj.special_reference || "";

    let order = null;

    if (paymobOrderId) {
      const result = await supabase
        .from("orders")
        .select("*")
        .eq("paymob_order_id", paymobOrderId)
        .maybeSingle();
      order = result.data;
    }

    if (!order && specialRef) {
      const result = await supabase
        .from("orders")
        .select("*")
        .eq("id", specialRef)
        .maybeSingle();
      order = result.data;
    }

    if (!order) {
      return jsonResp({ message: "Order not found" }, 200);
    }

    if (order.status === "paid" || order.status === "failed") {
      return jsonResp({ message: "Already processed" });
    }

    if (obj.success) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          hmac_verified: true,
          paymob_transaction_id: transactionId,
        })
        .eq("id", order.id);
      if (error) throw error;
      return jsonResp({ message: "Paid" });
    } else {
      const { error } = await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
      if (error) throw error;
      return jsonResp({ message: "Failed" });
    }
  } catch (err) {
    console.error("paymob-webhook error:", err instanceof Error ? err.message : "unknown");
    return jsonResp({ error: "Internal error" }, 500);
  }
});
