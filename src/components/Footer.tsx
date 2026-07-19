import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'

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
        </div>

        <div className="mt-8 border-t border-olive-100/60 pt-6 text-center text-xs text-olive-400">
          <p>© {new Date().getFullYear()} Nadine Courses. {tr('footer', 'rights') || (lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}
