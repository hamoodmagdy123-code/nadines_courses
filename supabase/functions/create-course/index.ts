import {
  getSupabaseClient,
  jsonResp,
  errorResp,
  getCorsHeaders,
} from "../_shared/paymob.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      .from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return errorResp("Forbidden", 403);

    const body = await req.json();
    const { title, title_en, description, description_en, curriculum, curriculum_en,
            egypt_price, original_egypt_price, international_price_usd,
            original_international_price_usd, image_url, icon, slug, sort_order } = body;

    if (!title || !slug) return errorResp("title and slug are required");
    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) return errorResp("Invalid slug format");
    if (egypt_price === undefined || international_price_usd === undefined) return errorResp("Prices are required");

    // Check slug uniqueness
    const { data: existing } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
    if (existing) return errorResp("Slug already exists");

    const { data: course, error: insertErr } = await supabase
      .from("courses")
      .insert({
        title,
        title_en: title_en || null,
        description: description || null,
        description_en: description_en || null,
        curriculum: curriculum || [],
        curriculum_en: curriculum_en || [],
        egypt_price: Number(egypt_price),
        original_egypt_price: original_egypt_price ? Number(original_egypt_price) : null,
        international_price_usd: Number(international_price_usd),
        original_international_price_usd: original_international_price_usd ? Number(original_international_price_usd) : null,
        image_url: image_url || null,
        icon: icon || "Package",
        slug,
        sort_order: sort_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return jsonResp({ message: "Course created", course });
  } catch (err) {
    console.error("create-course error:", err instanceof Error ? err.message : "unknown");
    return errorResp("Internal server error", 500);
  }
});
