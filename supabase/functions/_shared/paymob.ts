import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function getSupabaseClient(serviceRole = false) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const key = serviceRole
    ? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    : Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(supabaseUrl, key);
}

function jsonResp(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResp(message: string, status = 400) {
  return jsonResp({ error: message }, status);
}

// Paymob API calls
const PAYMOB_BASE = "https://accept.paymob.com/api";

async function paymobAuth(paymobApiKey: string): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: paymobApiKey }),
  });
  if (!res.ok) throw new Error("Paymob auth failed");
  const data = await res.json();
  return data.token;
}

async function paymobCreateOrder(
  token: string,
  amountCents: number,
  merchantOrderId: string
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_needed_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paymob create order failed: ${err}`);
  }
  const data = await res.json();
  return data.id;
}

async function paymobPaymentKey(
  token: string,
  orderId: string,
  integrationId: string,
  amountCents: number,
  billingData: Record<string, string>
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: integrationId,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paymob payment key failed: ${err}`);
  }
  const data = await res.json();
  return data.token;
}

export {
  corsHeaders,
  getSupabaseClient,
  jsonResp,
  errorResp,
  paymobAuth,
  paymobCreateOrder,
  paymobPaymentKey,
  serve,
};
