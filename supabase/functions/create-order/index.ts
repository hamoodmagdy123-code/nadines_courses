import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  paymobCreateIntention,
  buildCheckoutUrl,
  corsHeaders,
} from "../_shared/paymob.ts";

Deno.serve(async (req) => {
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

    const secretKey = Deno.env.get("PAYMOB_SECRET_KEY")!;
    const publicKey = Deno.env.get("PAYMOB_PUBLIC_KEY")!;
    const integrationId = Number(Deno.env.get("PAYMOB_INTEGRATION_ID")!);
    const siteUrl = Deno.env.get("SITE_URL") || "https://nadines-courses.vercel.app";

    const billingData = {
      email,
      phone_number: phone || "+201000000000",
      first_name: name.split(" ")[0] || name,
      last_name: name.split(" ").slice(1).join(" ") || "User",
      street: "N/A",
      building: "N/A",
      floor: "N/A",
      apartment: "N/A",
      city: "Cairo",
      country: country_code || "EG",
      state: "Cairo",
    };

    const amountCents = Math.round(amount * 100);

    const intention = await paymobCreateIntention({
      secretKey,
      amountCents,
      currency,
      integrationId,
      billingData,
      items: [{ name: course.title_en || course.title, amount: amountCents }],
      specialReference: order.id,
      notificationUrl: `https://kzlbuxteyiyhjeaflplo.functions.supabase.co/paymob-webhook`,
      redirectionUrl: `${siteUrl}/checkout/success?order_id=${order.id}`,
    });

    // Update order with paymob_order_id
    await supabase
      .from("orders")
      .update({ paymob_order_id: String(intention.intention_order_id) })
      .eq("id", order.id);

    const checkoutUrl = buildCheckoutUrl(publicKey, intention.client_secret);

    return jsonResp({
      order_id: order.id,
      checkout_url: checkoutUrl,
      amount,
      currency,
    });
  } catch (err) {
    console.error("create-order error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return jsonResp({ error: "Internal server error", detail: message }, 500);
  }
});
