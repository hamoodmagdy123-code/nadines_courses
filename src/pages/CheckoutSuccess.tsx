import { Link, useSearchParams } from 'react-router-dom'
import { useSC } from '@/hooks/useSiteContent'
import { CheckCircle, Clock, MessageCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function CheckoutSuccess() {
  const { tr } = useSC()
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get('order_id')
    if (!orderId) {
      setVerifying(false)
      return
    }

    fetch(`${FUNCTIONS_BASE}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ order_id: orderId }),
    })
      .then(() => setVerifying(false))
      .catch(() => setVerifying(false))
  }, [searchParams])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-success/5 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-sticky-yellow/10 blur-[60px]" />
      </div>
      <div className="relative mx-auto max-w-md w-full p-8 text-center rounded-3xl bg-white/80 backdrop-blur-sm" style={{ boxShadow: '0 20px 60px -15px rgba(42,44,20,0.15), 0 0 0 1px rgba(228,230,203,0.3)' }}>
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-success/10 to-success/5">
          {verifying ? (
            <Loader2 className="h-10 w-10 text-success animate-spin" />
          ) : (
            <CheckCircle className="h-10 w-10 text-success" />
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-olive-900">{tr('success', 'title')}</h1>
        <p className="mt-3 leading-relaxed text-olive-700">{tr('success', 'message')}</p>
        <div className="mt-6 rounded-2xl bg-olive-50/60 p-5 border border-olive-100/50">
          <div className="flex items-center justify-center gap-2 text-olive-800">
            <Clock className="h-5 w-5 text-olive-600" />
            <span className="font-bold">{tr('success', 'next')}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-olive-600">{tr('success', 'next_text')}</p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-olive-500">
          <MessageCircle className="h-4 w-4" />
          <span>{tr('success', 'contact')}</span>
        </div>
        <Link to="/" className="btn-primary mt-6 w-full !rounded-xl">Home</Link>
      </div>
    </div>
  )
}
