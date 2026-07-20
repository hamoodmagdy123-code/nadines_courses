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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
          <p className="text-sm text-olive-400">...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-paper-dim">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-olive-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ backdropFilter: 'blur(4px)' }}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 border-l border-olive-100/60 bg-white/95 backdrop-blur-sm transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: sidebarOpen ? '-4px 0 20px rgba(42,44,20,0.08)' : 'none' }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-olive-100/60 px-5">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-olive-600 to-olive-800 text-white shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-olive-800">{t('admin_login')}</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-1.5 text-olive-400 transition-all duration-200 hover:bg-olive-100 hover:text-olive-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
              const active = exact
                ? location.pathname === to
                : location.pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-olive-50 text-olive-800 shadow-sm'
                      : 'text-olive-600 hover:bg-olive-50/50 hover:text-olive-800'
                  }`}
                >
                  {active && (
                    <div className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l-full bg-olive-600" />
                  )}
                  <Icon className={`h-5 w-5 ${active ? 'text-olive-700' : ''}`} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-olive-100/60 p-3">
            <button
              onClick={async () => {
                await signOut()
                window.location.href = '/admin/login'
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-danger transition-all duration-200 hover:bg-danger/5 hover:text-danger/90"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('admin_logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center gap-4 border-b border-olive-100/60 bg-white/80 backdrop-blur-sm px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-olive-600 transition-all duration-200 hover:bg-olive-100"
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
