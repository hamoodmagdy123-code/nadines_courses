import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const PAYMOB_BASE = "https://accept.paymob.com";

async function paymobCreateIntention(params: {
  secretKey: string;
  amountCents: number;
  currency: string;
  integrationId: number;
  billingData: Record<string, string>;
  items: Array<{ name: string; amount: number }>;
  specialReference?: string;
  notificationUrl?: string;
  redirectionUrl?: string;
}): Promise<{ client_secret: string; intention_order_id: number }> {
  const {
    secretKey,
    amountCents,
    currency,
    integrationId,
    billingData,
    items,
    specialReference,
    notificationUrl,
    redirectionUrl,
  } = params;

  const payload: Record<string, unknown> = {
    amount: amountCents,
    currency,
    payment_methods: [integrationId],
    items,
    billing_data: billingData,
  };

  if (specialReference) payload.special_reference = specialReference;
  if (notificationUrl) payload.notification_url = notificationUrl;
  if (redirectionUrl) payload.redirection_url = redirectionUrl;

  console.log("Paymob intention payload:", JSON.stringify(payload));

  const res = await fetch(`${PAYMOB_BASE}/v1/intention/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${secretKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Paymob intention failed:", JSON.stringify(data));
    throw new Error(`Paymob intention failed: ${JSON.stringify(data)}`);
  }

  return {
    client_secret: data.client_secret,
    intention_order_id: data.intention_order_id,
  };
}

function buildCheckoutUrl(
  publicKey: string,
  clientSecret: string
): string {
  return `${PAYMOB_BASE}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
}

export {
  corsHeaders,
  getSupabaseClient,
  jsonResp,
  errorResp,
  paymobCreateIntention,
  buildCheckoutUrl,
};
