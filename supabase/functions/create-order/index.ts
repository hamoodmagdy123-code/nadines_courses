import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  paymobAuth,
  paymobCreateOrder,
  paymobPaymentKey,
  corsHeaders,
  serve,
} from "../_shared/paymob.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { course_id, name, email, phone, country_code } = body;

    if (!course_id || !name || !email) {
      return errorResp("Missing required fields: course_id, name, email");
    }

    const supabase = getSupabaseClient(true);

    // Fetch course
    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .select("*")
      .eq("id", course_id)
      .single();

    if (courseErr || !course) {
      return errorResp("Course not found");
    }

    // Determine currency and amount server-side
    const isEgypt = country_code === "EG";
    const currency = isEgypt ? "EGP" : "USD";
    const amount = isEgypt
      ? Number(course.egypt_price)
      : Number(course.international_price_usd);

    // Insert order (pending)
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        course_id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        country_code: country_code || null,
        currency,
        amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Paymob flow
    const paymobApiKey = Deno.env.get("PAYMOB_API_KEY")!;
    const paymobIntegrationId = Deno.env.get("PAYMOB_INTEGRATION_ID")!;

    const paymobToken = await paymobAuth(paymobApiKey);
    const paymobOrderId = await paymobCreateOrder(
      paymobToken,
      Math.round(amount * 100), // cents
      order.id
    );

    // Update order with paymob_order_id
    await supabase
      .from("orders")
      .update({ paymob_order_id: paymobOrderId })
      .eq("id", order.id);

    const billingData = {
      email: email,
      phone_number: phone || "+201000000000",
      first_name: name.split(" ")[0] || name,
      last_name: name.split(" ").slice(1).join(" ") || name,
      country: country_code || "EG",
    };

    const paymentToken = await paymobPaymentKey(
      paymobToken,
      paymobOrderId,
      paymobIntegrationId,
      Math.round(amount * 100),
      billingData
    );

    // Build iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/856332?payment_token=${paymentToken}`;

    return jsonResp({
      order_id: order.id,
      payment_token: paymentToken,
      iframe_url: iframeUrl,
      amount,
      currency,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return errorResp("Internal server error", 500);
  }
});
