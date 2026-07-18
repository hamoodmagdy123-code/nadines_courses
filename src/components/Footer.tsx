import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/context'

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-olive-100/60 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="sticky-note sticky-note-1 !px-2.5 !py-1.5 text-base transition-transform duration-300 group-hover:rotate-6">
              ن
            </span>
            <span className="text-lg font-bold text-olive-900">نادين كورسز</span>
          </Link>

          <div className="flex gap-8 text-sm text-olive-500">
            {[
              { href: '/', key: 'footer_home' as const },
              { href: '#courses', key: 'footer_courses' as const },
              { href: '#faq', key: 'footer_faq' as const },
            ].map((item) => (
              <a key={item.href} href={item.href} className="transition-colors duration-200 hover:text-olive-700">
                {t(item.key)}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-olive-100/60 pt-6 text-center text-xs text-olive-400">
          <p>© {new Date().getFullYear()} Nadine Courses. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  )
}
