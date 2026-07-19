import { supabase } from './supabase'

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function createOrder(payload: {
  course_id: string
  name: string
  email: string
  phone?: string
  country_code?: string
}) {
  const res = await fetch(`${FUNCTIONS_BASE}/create-order`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to create order')
  }
  return res.json()
}

export async function fetchAdminOrders(params?: {
  status?: string
  course_id?: string
}) {
  const url = new URL(`${FUNCTIONS_BASE}/admin-orders`)
  if (params?.status) url.searchParams.set('status', params.status)
  if (params?.course_id) url.searchParams.set('course_id', params.course_id)

  const res = await fetch(url.toString(), {
    headers: await getAuthHeaders(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to fetch orders')
  }
  return res.json()
}

export async function markTelegramAdded(order_id: string) {
  const res = await fetch(`${FUNCTIONS_BASE}/mark-telegram-added`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ order_id }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to mark as delivered')
  }
  return res.json()
}

export async function updateCourse(course_id: string, updates: Record<string, unknown>) {
  const res = await fetch(`${FUNCTIONS_BASE}/update-course`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ course_id, ...updates }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to update course')
  }
  return res.json()
}

export async function adminUpdateOrder(order_id: string, action: 'delete') {
  const res = await fetch(`${FUNCTIONS_BASE}/admin-update-order`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ order_id, action }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to update order')
  }
  return res.json()
}

export async function fetchAdminStats() {
  const res = await fetch(`${FUNCTIONS_BASE}/admin-stats`, {
    headers: await getAuthHeaders(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to fetch stats')
  }
  return res.json()
}
