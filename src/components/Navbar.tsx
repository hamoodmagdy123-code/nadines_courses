import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLang } from '@/i18n/context'
import { Globe, Menu, X } from 'lucide-react'

export function Navbar() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <nav
          className={`flex w-full max-w-3xl items-center justify-between gap-2 rounded-xl px-3 py-2 transition-all duration-500 sm:px-5 sm:py-2.5 ${
            scrolled
              ? 'glass glass-scrolled'
              : 'bg-white/50 backdrop-blur-xl border border-white/30'
          }`}
          style={{
            boxShadow: scrolled
              ? '0 8px 32px -8px rgba(42,44,20,0.12), inset 0 1px 0 rgba(255,255,255,0.6)'
              : '0 4px 20px -6px rgba(42,44,20,0.05), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          <Link to="/" className="group flex items-center gap-2">
            <span className="sticky-note sticky-note-1 !px-2 !py-1 text-[10px] sm:text-xs transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              ن
            </span>
            <span className="hidden text-sm font-bold text-olive-900 sm:inline">
              {lang === 'ar' ? 'نادين كورسز' : 'Nadine Courses'}
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 sm:flex">
            {[
              { href: '#courses', key: 'nav_courses' as const },
              { href: '#faq', key: 'nav_faq' as const },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-olive-600 transition-all duration-200 hover:bg-olive-100/70 hover:text-olive-900 lg:text-sm"
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-olive-600 transition-all duration-200 hover:bg-olive-100/70 hover:text-olive-800 sm:px-3"
              title={lang === 'ar' ? 'English' : 'عربي'}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <a href="#courses" className="btn-primary !rounded-lg !px-3 !py-1.5 !text-[11px] sm:!px-4 sm:!py-2 sm:!text-xs">
              {t('nav_cta')}
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-1.5 text-olive-600 transition-all duration-200 hover:bg-olive-100/70 sm:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-olive-900/20 backdrop-blur-sm sm:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`fixed top-[60px] inset-x-0 z-40 mx-3 transition-all duration-300 sm:hidden ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="rounded-xl bg-white/95 backdrop-blur-xl p-3 border border-olive-100/50" style={{ boxShadow: '0 12px 40px -10px rgba(42,44,20,0.15)' }}>
          {[
            { href: '#courses', key: 'nav_courses' as const },
            { href: '#faq', key: 'nav_faq' as const },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-olive-700 transition-colors hover:bg-olive-50"
            >
              {t(item.key)}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
