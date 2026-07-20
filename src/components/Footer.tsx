import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'

const SOCIALS = [
  {
    href: 'https://www.instagram.com/nadinemohamed2027/',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@nadine.t79',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.16 8.16 0 005.58 2.2v-3.45a4.85 4.85 0 01-5.58-2.73V6.69h5.58z" />
      </svg>
    ),
  },
]

export function Footer() {
  const { lang } = useLang()
  const { tr } = useSC()

  const links = [
    { href: '/', label: tr('footer', 'home') || (lang === 'ar' ? 'الرئيسية' : 'Home') },
    { href: '#courses', label: tr('footer', 'courses') || (lang === 'ar' ? 'الكورسات' : 'Courses') },
    { href: '#faq', label: tr('footer', 'faq') || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ') },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-olive-100/60">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-paper-dim to-paper" />
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-olive-100/30 blur-[80px]" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-sticky-yellow/10 blur-[60px]" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="sticky-note sticky-note-1 !px-3 !py-2 text-base transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              ن
            </span>
            <span className="text-lg font-bold text-olive-900">{lang === 'ar' ? 'نادين كورسز' : 'Nadine Courses'}</span>
          </Link>

          <div className="flex gap-8 text-sm text-olive-500">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="relative font-medium transition-colors duration-200 hover:text-olive-800 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-olive-400 after:transition-all after:duration-300 hover:after:w-full">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-100/80 text-olive-600 transition-all duration-300 hover:bg-olive-200 hover:text-olive-800 hover:scale-110 hover:shadow-sm"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="premium-divider mt-10" />

        <div className="mt-6 text-center text-xs text-olive-400">
          <p>© {new Date().getFullYear()} Nadine Courses. {tr('footer', 'rights') || (lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}
