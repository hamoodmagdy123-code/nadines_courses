import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'

const SOCIALS = [
  {
    href: 'https://www.instagram.com/nadinemohamed2027/',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
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
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
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
    <footer className="border-t border-olive-100/60 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="sticky-note sticky-note-1 !px-2.5 !py-1.5 text-base transition-transform duration-300 group-hover:rotate-6">
              ن
            </span>
            <span className="text-lg font-bold text-olive-900">{lang === 'ar' ? 'نادين كورسز' : 'Nadine Courses'}</span>
          </Link>

          <div className="flex gap-8 text-sm text-olive-500">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors duration-200 hover:text-olive-700">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-olive-100 text-olive-600 transition-all duration-200 hover:bg-olive-200 hover:text-olive-800 hover:scale-110"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-olive-100/60 pt-6 text-center text-xs text-olive-400">
          <p>© {new Date().getFullYear()} Nadine Courses. {tr('footer', 'rights') || (lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}
