import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLang } from '@/i18n/context'
import { Globe } from 'lucide-react'

export function Navbar() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <nav
        className={`flex w-full max-w-2xl items-center justify-between gap-2 rounded-full px-3 py-2 transition-all duration-500 sm:px-5 sm:py-2.5 ${
          scrolled
            ? 'glass glass-scrolled'
            : 'bg-white/60 backdrop-blur-xl border border-white/40'
        }`}
        style={{
          boxShadow: scrolled
            ? '0 8px 32px -8px rgba(42,44,20,0.12), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 4px 20px -6px rgba(42,44,20,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="sticky-note sticky-note-1 !px-2 !py-1 text-xs sm:text-sm transition-transform duration-300 group-hover:rotate-6">
            ن
          </span>
          <span className="hidden text-sm font-bold text-olive-900 sm:inline">
            {lang === 'ar' ? 'نادين كورسز' : 'Nadine Courses'}
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {[
            { href: '#courses', key: 'nav_courses' as const },
            { href: '#faq', key: 'nav_faq' as const },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-olive-600 transition-all duration-200 hover:bg-olive-100/70 hover:text-olive-900 lg:text-sm"
            >
              {t(item.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-olive-600 transition-all duration-200 hover:bg-olive-100/70 hover:text-olive-800"
            title={lang === 'ar' ? 'English' : 'عربي'}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <a href="#courses" className="btn-primary !rounded-full !px-4 !py-1.5 !text-xs sm:!px-5 sm:!py-2 sm:!text-sm">
            {t('nav_cta')}
          </a>
        </div>
      </nav>
    </div>
  )
}
