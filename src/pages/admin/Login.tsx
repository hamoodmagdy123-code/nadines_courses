import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Loader2 } from 'lucide-react'
import { useLang } from '@/i18n/context'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useLang()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // TODO: Replace with Supabase Auth
    await new Promise((r) => setTimeout(r, 1000))

    if (email === 'admin@nadine.com' && password === 'admin123') {
      localStorage.setItem('admin_token', 'mock-token')
      navigate('/admin')
    } else {
      setError(t('admin_login_error'))
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="card-elevated w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-olive-600 text-white">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-olive-800">{t('admin_login')}</h1>
          <p className="mt-1 text-sm text-olive-500">{t('admin_login_sub')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-olive-700">
              {t('admin_email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nadine.com"
              className="input-field"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-olive-700">
              {t('admin_password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              dir="ltr"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger/10 p-3 text-center text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3"
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
  )
}
