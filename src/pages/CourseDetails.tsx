import { useParams, Link } from 'react-router-dom'
import { useCourseBySlug } from '@/hooks/useCourses'
import { useGeo } from '@/hooks/useGeo'
import { formatPrice, getDisplayPrice } from '@/lib/pricing'
import { Navbar } from '@/components/Navbar'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useLang } from '@/i18n/context'
import { createOrder } from '@/lib/functions'
import { ArrowRight, CheckCircle, Loader2, Shield, CreditCard, Package, Layers, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { Package, Layers }

const purchaseSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
})

type PurchaseForm = z.infer<typeof purchaseSchema>

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { data: course, isLoading } = useCourseBySlug(slug || '')
  const { countryCode } = useGeo()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, lang } = useLang()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const { register, handleSubmit, formState: { errors } } = useForm<PurchaseForm>({
    resolver: zodResolver(purchaseSchema),
  })

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-olive-500" />
        </div>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-6xl">😕</p>
            <h2 className="mt-4 text-2xl font-bold text-olive-900">{t('course_not_found')}</h2>
            <Link to="/" className="btn-primary mt-6">{t('go_home')}</Link>
          </div>
        </div>
      </>
    )
  }

  const onSubmit = async (data: PurchaseForm) => {
    setSubmitting(true)
    setError(null)
    try {
      const result = await createOrder({
        course_id: course.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        country_code: countryCode,
      })
      // Redirect to Paymob Unified Checkout
      window.location.href = result.checkout_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const title = lang === 'ar' ? course.title : course.title_en
  const desc = lang === 'ar' ? course.description : course.description_en
  const curriculum = lang === 'ar' ? course.curriculum : course.curriculum_en
  const price = getDisplayPrice(course, countryCode)

  return (
    <>
      <Navbar />
      <div className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <Link to="/" className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-olive-500 transition-colors hover:text-olive-700 ${dir === 'ltr' ? 'flex-row-reverse' : ''}`}>
            <ArrowRight className={`h-4 w-4 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
            <span>{t('back')}</span>
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-[2rem]">
                <img src={course.image_url} alt={title} className="h-64 w-full object-cover sm:h-80" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                  {(() => { const CI = ICON_MAP[course.icon] || Package; return <CI className="mb-2 h-8 w-8 text-white/80" strokeWidth={1.5} />; })()}
                  <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
                  <p className="mt-2 max-w-lg text-lg text-white/85">{desc}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-olive-900">{t('course_curriculum')}</h2>
                <div className="space-y-3">
                  {curriculum.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-olive-100 text-sm font-bold text-olive-700">
                        {i + 1}
                      </div>
                      <span className="font-medium text-olive-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="card-elevated p-6">
                  <div className="mb-6 text-center">
                    <p className="text-3xl font-bold text-olive-900">
                      {formatPrice(price.amount, price.currency)}
                    </p>
                    {!price.isEgypt && (
                      <p className="mt-1 text-sm text-olive-400">
                        {t('courses_pay_usd')} — {formatPrice(course.international_price_usd, 'USD')}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 space-y-3 rounded-2xl bg-olive-50 p-4">
                    {[t('form_benefits_1'), t('form_benefits_2'), t('form_benefits_3')].map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-olive-700">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-olive-800">{t('form_name')}</label>
                      <input {...register('name')} placeholder={t('form_name_placeholder')} className="input-field" />
                      {errors.name && <p className="mt-1 text-xs text-danger">Required</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-olive-800">{t('form_email')}</label>
                      <input {...register('email')} type="email" placeholder="example@email.com" className="input-field" dir="ltr" />
                      {errors.email && <p className="mt-1 text-xs text-danger">Invalid</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-olive-800">{t('form_phone')}</label>
                      <input {...register('phone')} type="tel" placeholder="01XXXXXXXXX" className="input-field" dir="ltr" />
                      {errors.phone && <p className="mt-1 text-xs text-danger">Invalid</p>}
                    </div>
                    {error && (
                      <div className="rounded-xl bg-danger/10 p-3 text-sm text-danger">
                        {error}
                      </div>
                    )}
                    <button type="submit" disabled={submitting} className="btn-primary w-full !py-3.5 text-base">
                      {submitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /><span>{t('form_processing')}</span></>
                      ) : (
                        <><CreditCard className="h-5 w-5" /><span>{t('form_pay')}</span></>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-olive-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>{t('form_secure')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
