import { Link } from 'react-router-dom'
import { useSC } from '@/hooks/useSiteContent'
import { XCircle, RefreshCcw } from '@/components/icons'

export default function CheckoutFailed() {
  const { tr } = useSC()

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-danger/5 blur-[80px]" />
        <div className="absolute right-1/3 bottom-1/4 h-48 w-48 rounded-full bg-olive-100/20 blur-[60px]" />
      </div>
      <div className="relative mx-auto max-w-md w-full p-8 text-center rounded-3xl bg-white/80 backdrop-blur-sm" style={{ boxShadow: '0 20px 60px -15px rgba(42,44,20,0.15), 0 0 0 1px rgba(228,230,203,0.3)' }}>
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-danger/10 to-danger/5">
          <XCircle className="h-10 w-10 text-danger" />
        </div>
        <h1 className="text-2xl font-extrabold text-olive-900">{tr('fail', 'title')}</h1>
        <p className="mt-3 leading-relaxed text-olive-700">{tr('fail', 'message')}</p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="btn-secondary flex-1 !rounded-xl">Home</Link>
          <Link to="/" className="btn-primary flex-1 !gap-1.5 !rounded-xl">
            <RefreshCcw className="h-4 w-4" />
            <span>{tr('fail', 'retry')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
