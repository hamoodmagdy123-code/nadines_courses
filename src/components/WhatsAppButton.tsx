import { useEffect, useState } from 'react'
import { useLang } from '@/i18n/context'
import { useLocation } from 'react-router-dom'
import { useCourseBySlug } from '@/hooks/useCourses'

const WHATSAPP_NUMBER = '201063167656'

export function WhatsAppButton() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const courseSlug = pathname.match(/^\/course\/([^/]+)\/?$/)?.[1] || ''
  const { data: course } = useCourseBySlug(decodeURIComponent(courseSlug))

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 250) setVisible(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const label = lang === 'ar' ? 'احجز كورسك الآن' : 'Book your course now'
  const courseTitle = course
    ? (lang === 'ar' ? course.title : course.title_en)
    : ''
  const message = courseTitle
    ? (lang === 'ar'
        ? `احجز كورس ${courseTitle}`
        : `I'd like to book the ${courseTitle} course`)
    : (lang === 'ar'
        ? 'عايزة أعرف تفاصيل الكورسات المتاحة'
        : "I'd like to know more about the available courses")
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-4 end-4 z-50 flex items-center gap-3 sm:bottom-6 sm:end-6"
    >
      <span
        aria-hidden="true"
        className={`relative max-w-[11rem] rounded-2xl border border-olive-100 bg-white px-3.5 py-2 text-xs font-bold text-olive-800 shadow-[var(--shadow-elevated)] transition-all duration-500 ease-out sm:max-w-none sm:px-4 sm:py-2.5 sm:text-sm ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
        }`}
      >
        <span className="absolute -end-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white" />
        {label}
      </span>

      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[0_6px_20px_-4px_rgba(37,211,102,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1fbd5a] active:scale-95 sm:h-16 sm:w-16">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <svg viewBox="0 0 24 24" fill="white" className="relative h-7 w-7 sm:h-8 sm:w-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </a>
  )
}
