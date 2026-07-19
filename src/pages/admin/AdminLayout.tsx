import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  FileText,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

function AdminNavItems() {
  const { t } = useLang()
  return [
    { to: '/admin', icon: LayoutDashboard, label: t('admin_nav_home'), exact: true },
    { to: '/admin/courses', icon: BookOpen, label: t('admin_nav_courses') },
    { to: '/admin/orders', icon: ShoppingCart, label: t('admin_nav_orders') },
    { to: '/admin/content', icon: FileText, label: t('admin_nav_content') },
  ]
}

export function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useLang()
  const { user, loading, signOut } = useAuth()
  const NAV_ITEMS = AdminNavItems()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 border-l border-olive-100 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-olive-100 px-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-olive-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-olive-800">{t('admin_login')}</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-olive-400 hover:bg-olive-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
              const active = exact
                ? location.pathname === to
                : location.pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-olive-50 text-olive-700'
                      : 'text-olive-600 hover:bg-paper hover:text-olive-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-olive-100 p-3">
            <button
              onClick={async () => {
                await signOut()
                window.location.href = '/admin/login'
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('admin_logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-olive-100 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-olive-600 hover:bg-olive-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-olive-800">{t('admin_login')}</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
