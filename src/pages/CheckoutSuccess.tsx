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
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="card-elevated mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          {verifying ? (
            <Loader2 className="h-10 w-10 text-success animate-spin" />
          ) : (
            <CheckCircle className="h-10 w-10 text-success" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-olive-900">{tr('success', 'title')}</h1>
        <p className="mt-3 leading-relaxed text-olive-700">{tr('success', 'message')}</p>
        <div className="mt-6 rounded-xl bg-olive-50 p-4">
          <div className="flex items-center justify-center gap-2 text-olive-800">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">{tr('success', 'next')}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-olive-600">{tr('success', 'next_text')}</p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-olive-500">
          <MessageCircle className="h-4 w-4" />
          <span>{tr('success', 'contact')}</span>
        </div>
        <Link to="/" className="btn-primary mt-6 w-full">Home</Link>
      </div>
    </div>
  )
}
