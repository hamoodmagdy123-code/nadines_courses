import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  getCorsHeaders,
} from "../_shared/paymob.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req.headers.get("Origin")) });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResp("Missing authorization", 401);

    const supabase = getSupabaseClient(true);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) return errorResp("Unauthorized", 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return errorResp("Forbidden", 403);
    }

    // Total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Paid orders
    const { count: paidOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    // Pending orders
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Total revenue (from paid orders)
    const { data: paidData } = await supabase
      .from("orders")
      .select("amount, currency")
      .eq("status", "paid");

    const totalRevenueEGP = paidData
      ? paidData
          .filter((o) => o.currency === "EGP")
          .reduce((sum, o) => sum + Number(o.amount), 0)
      : 0;

    const totalRevenueUSD = paidData
      ? paidData
          .filter((o) => o.currency === "USD")
          .reduce((sum, o) => sum + Number(o.amount), 0)
      : 0;

    // Telegram delivery status (delivered = paid + telegram_added = true)
    const { count: deliveredCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("telegram_added", true);

    // Paid but NOT yet delivered (telegram_added is false OR null)
    const { count: deliveryPendingCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid")
      .not("telegram_added", "eq", true);

    // Orders by course
    const { data: courseOrders } = await supabase
      .from("orders")
      .select("course_id, courses(title, title_en, slug)")
      .eq("status", "paid");

    const courseStats: Record<string, number> = {};
    if (courseOrders) {
      for (const o of courseOrders) {
        const name = (o.courses as Record<string, string>)?.title_en || o.course_id;
        courseStats[name] = (courseStats[name] || 0) + 1;
      }
    }

    return jsonResp({
      total_orders: totalOrders || 0,
      paid_orders: paidOrders || 0,
      pending_orders: pendingOrders || 0,
      delivered_count: deliveredCount || 0,
      delivery_pending: deliveryPendingCount || 0,
      total_revenue_egp: totalRevenueEGP,
      total_revenue_usd: totalRevenueUSD,
      course_stats: courseStats,
    });
  } catch (err) {
    console.error("admin-stats error:", err);
    return errorResp("Internal server error", 500);
  }
});
