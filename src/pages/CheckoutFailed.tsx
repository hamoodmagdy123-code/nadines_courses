import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import { XCircle, RefreshCcw } from 'lucide-react'

export default function CheckoutFailed() {
  const { t } = useLang()

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="card-elevated mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <XCircle className="h-10 w-10 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-olive-900">{t('fail_title')}</h1>
        <p className="mt-3 leading-relaxed text-olive-700">{t('fail_message')}</p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="btn-secondary flex-1">{t('go_home')}</Link>
          <Link to="/" className="btn-primary flex-1 !gap-1.5">
            <RefreshCcw className="h-4 w-4" />
            <span>{t('fail_retry')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
