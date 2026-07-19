import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  paymobCreateIntention,
  buildCheckoutUrl,
  getCorsHeaders,
} from "../_shared/paymob.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    const { course_id, name, email, phone, country_code } = body;

    if (!course_id || !name || !email) {
      return errorResp("Missing required fields: course_id, name, email");
    }

    if (!UUID_RE.test(course_id)) {
      return errorResp("Invalid course_id format");
    }

    if (typeof name !== "string" || name.trim().length < 2 || name.length > 200) {
      return errorResp("Invalid name");
    }

    if (!EMAIL_RE.test(email)) {
      return errorResp("Invalid email format");
    }

    if (phone && (typeof phone !== "string" || phone.length > 20)) {
      return errorResp("Invalid phone number");
    }

    if (country_code && typeof country_code !== "string") {
      return errorResp("Invalid country_code");
    }

    const supabase = getSupabaseClient(true);

    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .select("*")
      .eq("id", course_id)
      .eq("is_active", true)
      .single();

    if (courseErr || !course) {
      return errorResp("Course not found");
    }

    const isEgypt = country_code === "EG";
    const amount = isEgypt
      ? Number(course.egypt_price)
      : Number(course.international_price_usd);

    // Always charge EGP through Paymob (integration only supports EGP)
    // Convert USD display price to EGP at fixed rate of 50 EGP per 1 USD
    const USD_TO_EGP = 50;
    const chargeAmount = isEgypt ? amount : Math.round(amount * USD_TO_EGP);
    const currency = "EGP";

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        course_id,
        customer_name: name.trim(),
        customer_email: email.trim().toLowerCase(),
        customer_phone: phone || null,
        country_code: country_code || null,
        currency,
        amount: chargeAmount,
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
      email: email.trim().toLowerCase(),
      phone_number: phone || "+201000000000",
      first_name: name.trim().split(" ")[0] || name.trim(),
      last_name: name.trim().split(" ").slice(1).join(" ") || "User",
      street: "N/A",
      building: "N/A",
      floor: "N/A",
      apartment: "N/A",
      city: "Cairo",
      country: country_code || "EG",
      state: "Cairo",
    };

    const amountCents = Math.round(chargeAmount * 100);

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

    await supabase
      .from("orders")
      .update({ paymob_order_id: String(intention.intention_order_id) })
      .eq("id", order.id);

    const checkoutUrl = buildCheckoutUrl(publicKey, intention.client_secret);

    return jsonResp({
      order_id: order.id,
      checkout_url: checkoutUrl,
      amount: chargeAmount,
      currency,
    });
  } catch (err) {
    console.error("create-order error:", err instanceof Error ? err.message : "unknown");
    return jsonResp({ error: "Internal server error" }, 500);
  }
});
