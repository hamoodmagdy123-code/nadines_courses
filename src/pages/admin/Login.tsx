import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Loader2, Lock, Mail } from '@/components/icons'
import { useLang } from '@/i18n/context'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useLang()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError(t('admin_login_error'))
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-olive-200/20 blur-[120px]" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sticky-yellow/10 blur-[80px]" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-olive-100/15 blur-[60px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-olive-600 to-olive-800 text-white shadow-lg" style={{ boxShadow: '0 8px 30px -6px rgba(63,66,31,0.4)' }}>
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-olive-900">{t('admin_login')}</h1>
          <p className="mt-1.5 text-sm text-olive-500">{t('admin_login_sub')}</p>
        </div>

        <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-8" style={{ boxShadow: '0 20px 60px -15px rgba(42,44,20,0.15), 0 0 0 1px rgba(228,230,203,0.3)' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-olive-800">
                {t('admin_email')}
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-olive-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nadine.com"
                  className="input-field !pr-10"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-olive-800">
                {t('admin_password')}
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-olive-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pr-10"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-danger/10 p-3 text-center text-sm text-danger border border-danger/10">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 !rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('admin_login_loading')}</span>
                </>
              ) : (
                t('admin_login_btn')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
