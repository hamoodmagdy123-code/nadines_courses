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

  if (req.method !== "POST") {
    return errorResp("Method not allowed", 405);
  }

  try {
    const url = new URL(req.url);
    const hmacParam = url.searchParams.get("hmac");
    const rawBody = await req.text();

    if (!hmacParam) {
      console.error("Webhook called without HMAC");
      return errorResp("Missing HMAC", 401);
    }

    const body = JSON.parse(rawBody);
    const obj = body.obj;

    if (!obj) {
      console.error("Webhook missing obj field");
      return errorResp("Invalid payload", 400);
    }

    const hmacSecret = Deno.env.get("PAYMOB_HMAC_SECRET");
    if (!hmacSecret) {
      console.error("PAYMOB_HMAC_SECRET not configured");
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

    if (computedHmac !== hmacParam) {
      console.error("HMAC verification failed");
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
      console.error("Order not found:", paymobOrderId, specialRef);
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
    console.error("paymob-webhook error:", err);
    return jsonResp({ error: "Internal error" }, 500);
  }
});
