export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response.status(500).json({ ok: false, error: 'Supabase configuration is missing' })
  }

  try {
    const ping = await fetch(`${supabaseUrl}/rest/v1/courses?select=id&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })

    if (!ping.ok) {
      return response.status(502).json({
        ok: false,
        error: 'Supabase ping failed',
        status: ping.status,
      })
    }

    return response.status(200).json({
      ok: true,
      service: 'supabase',
      checkedAt: new Date().toISOString(),
    })
  } catch {
    return response.status(502).json({ ok: false, error: 'Supabase is unreachable' })
  }
}
