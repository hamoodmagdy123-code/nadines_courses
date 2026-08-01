import type { Course } from '@/lib/data'
import { formatPrice, getDiscountPercent, getDisplayPrice, getOriginalDisplayPrice } from '@/lib/pricing'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Package, Layers } from 'lucide-react'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'
import { useExchangeRates } from '@/hooks/useExchangeRates'

const ICON_MAP: Record<string, typeof Package> = { Package, Layers }

interface Props {
  course: Course
  countryCode: string
  variant?: 'primary' | 'secondary'
}

const THEMES = {
  primary: {
    photoBg: 'from-[#E8F5E9] via-[#F1F8E9] to-[#FFF8E1]',
    accentBar: 'from-olive-500 via-olive-600 to-olive-700',
    glow: 'rgba(124,128,80,0.18)',
    ring: 'ring-olive-200/30',
    iconBg: 'bg-olive-50',
    iconColor: 'text-olive-700',
    checkColor: 'text-olive-600',
    btnBg: 'bg-olive-800 hover:bg-olive-700',
    priceColor: 'text-olive-800',
    badge: 'from-olive-600 to-olive-800',
  },
  secondary: {
    photoBg: 'from-[#FFF3E0] via-[#FFF8E1] to-[#FFFDE7]',
    accentBar: 'from-[#E65100] via-[#F57C00] to-[#BF360C]',
    glow: 'rgba(230,81,0,0.12)',
    ring: 'ring-orange-200/30',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-700',
    checkColor: 'text-orange-600',
    btnBg: 'bg-[#E65100] hover:bg-[#BF360C]',
    priceColor: 'text-orange-800',
    badge: 'from-[#E65100] to-[#BF360C]',
  },
}

export function CourseCard({ course, countryCode, variant = 'primary' }: Props) {
  const { data: rates } = useExchangeRates()
  const price = getDisplayPrice(course, countryCode, rates)
  const originalPrice = getOriginalDisplayPrice(course, countryCode, rates)
  const discountPercent = originalPrice ? getDiscountPercent(price.amount, originalPrice.amount) : null
  const { lang, t } = useLang()
  const { tr } = useSC()
  const title = lang === 'ar' ? course.title : course.title_en
  const desc = lang === 'ar' ? course.description : course.description_en
  const curriculum = lang === 'ar' ? course.curriculum : course.curriculum_en
  const theme = THEMES[variant]
  const Icon = ICON_MAP[course.icon] || Package

  return (
    <div className="group relative">
      <div
        className={`relative overflow-hidden rounded-2xl ring-1 ${theme.ring} transition-all duration-500 hover:-translate-y-1 lg:grid lg:grid-cols-[1fr_1.15fr] sm:rounded-3xl`}
        style={{ boxShadow: `0 12px 40px -12px ${theme.glow}, 0 2px 8px rgba(42,44,20,0.04)` }}
      >
        <div className={`relative bg-gradient-to-br ${theme.photoBg} flex items-center justify-center p-6 sm:p-8 lg:p-10 min-h-[200px] sm:min-h-[280px] lg:min-h-[320px]`}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-[2px]" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/25 blur-[2px]" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[40px]" />
          </div>

          <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4">
            <div className={`rounded-xl bg-gradient-to-r ${theme.badge} px-3 py-2 text-white shadow-lg sm:px-4`}>
              {originalPrice && (
                <p className="text-[10px] font-medium text-white/70 line-through sm:text-xs">
                  {formatPrice(originalPrice.amount, originalPrice.currency)}
                </p>
              )}
              <p className="text-xs font-extrabold sm:text-sm">{formatPrice(price.amount, price.currency)}</p>
            </div>
          </div>
          {discountPercent !== null && (
            <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
              <span className="inline-flex items-center rounded-full border border-white/50 bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg ring-4 ring-red-600/10 sm:text-sm">
                {discountPercent}% {t('discount_label')}
              </span>
            </div>
          )}

          <div className="relative z-10 w-full max-w-[140px] sm:max-w-[180px] lg:max-w-[200px]">
            <img
              src={course.image_url || '/nadines.webp'}
              alt={title}
              className="w-full drop-shadow-xl transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="relative bg-white p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
          <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${theme.accentBar} lg:top-0 lg:left-0 lg:w-[3px] lg:h-full rounded-full`} />

          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} transition-all duration-300 group-hover:scale-110 sm:h-10 sm:w-10`}>
              <Icon className={`h-4 w-4 ${theme.iconColor} sm:h-5 sm:w-5`} strokeWidth={2} />
            </div>
            <h3 className="text-base font-extrabold text-olive-900 sm:text-lg lg:text-xl leading-tight">{title}</h3>
          </div>

          <p className="mb-3 text-[12px] leading-relaxed text-olive-500/90 sm:mb-4 sm:text-sm">{desc}</p>

          <div className="mb-4 space-y-1 sm:mb-5">
            {curriculum.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-olive-600 sm:text-xs">
                <Check className={`h-3 w-3 shrink-0 ${theme.checkColor} sm:h-3.5 sm:w-3.5`} strokeWidth={2.5} />
                <span className="truncate">{item}</span>
              </div>
            ))}
            {curriculum.length > 3 && (
              <p className="text-[11px] text-olive-400 pl-4 sm:text-xs">
                +{curriculum.length - 3} {tr('courses_header', 'lessons_label')}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className={originalPrice ? 'rounded-xl bg-olive-50/70 px-3 py-2' : ''}>
              {originalPrice ? (
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p className={`text-lg font-extrabold ${theme.priceColor} sm:text-xl`}>
                    {formatPrice(price.amount, price.currency)}
                  </p>
                  <p className="text-xs font-semibold text-olive-400 line-through sm:text-sm">
                    {formatPrice(originalPrice.amount, originalPrice.currency)}
                  </p>
                </div>
              ) : (
                <p className={`text-lg font-extrabold ${theme.priceColor} sm:text-xl`}>
                  {formatPrice(price.amount, price.currency)}
                </p>
              )}
              {!price.isEgypt && (
                <p className="text-[10px] text-olive-400 sm:text-xs">
                  {formatPrice(course.international_price_usd, 'USD')}
                </p>
              )}
            </div>

            <Link
              to={`/course/${course.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all duration-300 active:scale-[0.97] hover:shadow-lg sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm ${theme.btnBg}`}
            >
              <span>{tr('courses_header', 'details_label')}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
