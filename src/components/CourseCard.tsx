import type { Course } from '@/lib/data'
import { formatPrice, getDisplayPrice } from '@/lib/pricing'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Package, Layers, type LucideIcon } from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'

const ICON_MAP: Record<string, LucideIcon> = { Package, Layers }

interface Props {
  course: Course
  countryCode: string
  variant?: 'primary' | 'secondary'
}

const THEMES = {
  primary: {
    photoBg: 'from-[#E8F5E9] via-[#F1F8E9] to-[#FFF8E1]',
    accentBar: 'bg-olive-600',
    glow: 'rgba(124,128,80,0.18)',
    ring: 'ring-olive-200/50',
    iconBg: 'bg-olive-50',
    iconColor: 'text-olive-700',
    checkColor: 'text-olive-600',
    btnBg: 'bg-olive-800 hover:bg-olive-700',
    priceColor: 'text-olive-800',
  },
  secondary: {
    photoBg: 'from-[#FFF3E0] via-[#FFF8E1] to-[#FFFDE7]',
    accentBar: 'bg-[#E65100]',
    glow: 'rgba(230,81,0,0.12)',
    ring: 'ring-orange-200/50',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-700',
    checkColor: 'text-orange-600',
    btnBg: 'bg-[#E65100] hover:bg-[#BF360C]',
    priceColor: 'text-orange-800',
  },
}

export function CourseCard({ course, countryCode, variant = 'primary' }: Props) {
  const price = getDisplayPrice(course, countryCode)
  const { lang } = useLang()
  const { tr } = useSC()
  const title = lang === 'ar' ? course.title : course.title_en
  const desc = lang === 'ar' ? course.description : course.description_en
  const curriculum = lang === 'ar' ? course.curriculum : course.curriculum_en
  const theme = THEMES[variant]
  const Icon = ICON_MAP[course.icon] || Package

  return (
    <div className="group relative">
      <div
        className={`relative overflow-hidden rounded-3xl ring-1 ${theme.ring} transition-all duration-500 hover:-translate-y-1 lg:grid lg:grid-cols-[1fr_1.1fr]`}
        style={{ boxShadow: `0 12px 40px -12px ${theme.glow}, 0 2px 8px rgba(42,44,20,0.04)` }}
      >
        {/* Photo side */}
        <div className={`relative bg-gradient-to-br ${theme.photoBg} flex items-center justify-center p-8 sm:p-10 min-h-[240px] sm:min-h-[300px]`}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-[2px]" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/25 blur-[2px]" />
          </div>

          <div className="absolute top-4 left-4 z-20">
            <span className="sticky-note sticky-note-1 !text-xs sm:!text-sm">
              {formatPrice(price.amount, price.currency)}
            </span>
          </div>

          <div className="relative z-10 w-full max-w-[160px] sm:max-w-[190px]">
            <img
              src="/nadines.png"
              alt={title}
              className="w-full drop-shadow-xl transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content side */}
        <div className="relative bg-white p-6 sm:p-7 lg:p-8 flex flex-col justify-center">
          <div className={`absolute top-0 left-0 w-full h-[3px] ${theme.accentBar} lg:top-0 lg:left-0 lg:w-[3px] lg:h-full rounded-full`} />

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.iconBg}`}>
              <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-olive-900 sm:text-xl leading-tight">{title}</h3>
          </div>

          {/* Description */}
          <p className="mb-4 text-[13px] leading-relaxed text-olive-500/90 sm:text-sm">{desc}</p>

          {/* Curriculum preview */}
          <div className="mb-5 space-y-1.5">
            {curriculum.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-olive-600">
                <Check className={`h-3.5 w-3.5 shrink-0 ${theme.checkColor}`} strokeWidth={2.5} />
                <span>{item}</span>
              </div>
            ))}
            {curriculum.length > 3 && (
              <p className="text-xs text-olive-400 pl-5">
                +{curriculum.length - 3} {tr('courses_header', 'lessons_label')}
              </p>
            )}
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-xl font-extrabold ${theme.priceColor}`}>
                {formatPrice(price.amount, price.currency)}
              </p>
              {!price.isEgypt && (
                <p className="text-xs text-olive-400">
                  {formatPrice(course.international_price_usd, 'USD')}
                </p>
              )}
            </div>

            <Link
              to={`/course/${course.slug}`}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 active:scale-[0.97] ${theme.btnBg}`}
            >
              <span>{tr('courses_header', 'details_label')}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
