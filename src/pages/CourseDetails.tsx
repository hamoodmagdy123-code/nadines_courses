import { useParams, Link } from 'react-router-dom'
import { useCourseBySlug } from '@/hooks/useCourses'
import { useGeo } from '@/hooks/useGeo'
import { formatPrice, getDiscountPercent, getDisplayPrice, getOriginalDisplayPrice } from '@/lib/pricing'
import { Navbar } from '@/components/Navbar'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useLang } from '@/i18n/context'
import { useSC } from '@/hooks/useSiteContent'
import { createOrder } from '@/lib/functions'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { ArrowRight, CheckCircle, Loader2, Shield, CreditCard, Package, Layers, SearchX, Copy, MessageCircle } from 'lucide-react'

const ICON_MAP: Record<string, typeof Package> = { Package, Layers }
const ONLINE_PAYMENTS_ENABLED = false
const WHATSAPP_NUMBER = '201063167656'

const purchaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(
    /^(\+?[1-9]\d{0,3})?[\s\-]?\(?\d{1,5}\)?[\s\-]?\d{1,5}[\s\-]?\d{1,9}$/,
    'Please enter a valid phone number'
  ),
})

type PurchaseForm = z.infer<typeof purchaseSchema>

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { data: course, isLoading } = useCourseBySlug(slug || '')
  const { countryCode } = useGeo()
  const { data: rates } = useExchangeRates()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instapay' | 'wallet'>('card')
  const [copied, setCopied] = useState<'instapay' | 'wallet' | null>(null)
  const { t, lang } = useLang()
  const { tr } = useSC()
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-100">
              <SearchX className="h-8 w-8 text-olive-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-olive-900">{tr('course_page', 'not_found')}</h2>
            <Link to="/" className="btn-primary mt-6">{tr('course_page', 'go_home')}</Link>
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
      window.location.href = result.checkout_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const title = lang === 'ar' ? course.title : course.title_en
  const desc = lang === 'ar' ? course.description : course.description_en
  const curriculum = lang === 'ar' ? course.curriculum : course.curriculum_en
  const price = getDisplayPrice(course, countryCode, rates)
  const originalPrice = getOriginalDisplayPrice(course, countryCode, rates)
  const discountPercent = originalPrice ? getDiscountPercent(price.amount, originalPrice.amount) : null
  const whatsappMessage = lang === 'ar'
    ? `احجز كورس ${course.title}`
    : `I'd like to book the ${course.title_en} course`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <>
      <Navbar />
      <div className="relative bg-paper overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-olive-100/30 blur-[80px]" />
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-sticky-yellow/10 blur-[60px]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <Link to="/" className={`mb-8 inline-flex items-center gap-2 text-sm font-medium text-olive-500 transition-colors hover:text-olive-700 ${dir === 'ltr' ? 'flex-row-reverse' : ''}`}>
            <ArrowRight className={`h-4 w-4 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
            <span>{tr('course_page', 'back')}</span>
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-[2rem]">
                <img src={course.image_url || '/nadines.webp'} alt={title} className="h-64 w-full object-cover sm:h-80" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                  {(() => { const CI = ICON_MAP[course.icon] || Package; return <CI className="mb-2 h-8 w-8 text-white/80" strokeWidth={1.5} />; })()}
                  <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">{title}</h1>
                  <p className="mt-2 max-w-lg text-lg text-white/85">{desc}</p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-5 text-xl font-extrabold text-olive-900">{tr('course_page', 'curriculum_title')}</h2>
                <div className="space-y-3">
                  {curriculum.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm p-4 transition-all duration-200 hover:bg-white hover:shadow-sm border border-olive-100/40">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-olive-100 to-olive-200 text-sm font-bold text-olive-700 shadow-sm">
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
                <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-olive-200/40" style={{ boxShadow: '0 12px 40px -12px rgba(42,44,20,0.15)' }}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-olive-50 via-paper to-sticky-yellow/10 p-6 text-center border-b border-olive-100/60">
                    {discountPercent !== null && (
                      <div className="mb-3 flex justify-center">
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-extrabold text-red-700 shadow-sm">
                          {discountPercent}% {t('discount_label')}
                        </span>
                      </div>
                    )}
                    {originalPrice ? (
                      <div className="rounded-2xl border border-olive-100/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
                        <p className="text-xs font-semibold text-olive-400">{t('price_after_discount')}</p>
                        <p className="mt-1 text-4xl font-extrabold tracking-tight text-olive-900">
                          {formatPrice(price.amount, price.currency)}
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                          <span className="text-olive-400">{t('price_before_discount')}</span>
                          <span className="font-semibold text-olive-400 line-through decoration-red-400/70 decoration-2">
                            {formatPrice(originalPrice.amount, originalPrice.currency)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-3xl font-extrabold text-olive-900">
                        {formatPrice(price.amount, price.currency)}
                      </p>
                    )}
                    {!price.isEgypt && (
                      <p className="mt-1 text-sm text-olive-400">
                        {formatPrice(course.international_price_usd, 'USD')}
                      </p>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-6 space-y-3 rounded-xl bg-olive-50/60 p-4">
                      {[tr('course_page', 'form_benefits_1'), tr('course_page', 'form_benefits_2'), tr('course_page', 'form_benefits_3')].filter(Boolean).map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-olive-700">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {!ONLINE_PAYMENTS_ENABLED && (
                      <div className="mb-5 rounded-2xl border border-green-200 bg-green-50/70 p-4">
                        <p className="text-sm font-bold text-olive-900">
                          {t('whatsapp_booking_title')}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-olive-600">
                          {t('whatsapp_booking_note')}
                        </p>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3.5 text-base font-bold text-white transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{t('whatsapp_booking_button')}</span>
                        </a>
                      </div>
                    )}

                    <div className={`space-y-3 ${!ONLINE_PAYMENTS_ENABLED ? 'opacity-60' : ''}`}>
                      <label className={`relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${ONLINE_PAYMENTS_ENABLED ? 'cursor-pointer' : 'cursor-not-allowed'} ${paymentMethod === 'card' && ONLINE_PAYMENTS_ENABLED ? 'border-olive-400 bg-olive-50/60' : 'border-olive-100'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card' && ONLINE_PAYMENTS_ENABLED}
                          onChange={() => setPaymentMethod('card')}
                          disabled={!ONLINE_PAYMENTS_ENABLED}
                          className="h-4 w-4 accent-olive-600"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-olive-900">{t('payment_tab_card')}</span>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <img src="/visa.svg" alt="Visa" className="h-6 w-9 rounded border border-olive-100 shadow-sm object-contain" />
                            <img src="/master.svg" alt="Mastercard" className="h-6 w-9 rounded border border-olive-100 shadow-sm object-contain" />
                            <img src="/meeza.svg" alt="Meeza" className="h-6 w-9 rounded border border-olive-100 shadow-sm object-contain" />
                          </div>
                        </div>
                        {!ONLINE_PAYMENTS_ENABLED && (
                          <span className="rounded-full bg-sticky-yellow px-2.5 py-1 text-[10px] font-bold text-olive-900">
                            {t('payment_coming_soon')}
                          </span>
                        )}
                      </label>

                      <label className={`flex items-center gap-3 rounded-xl border-2 border-olive-100 p-4 ${ONLINE_PAYMENTS_ENABLED ? 'cursor-pointer hover:border-olive-200' : 'cursor-not-allowed'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'instapay'}
                          onChange={() => setPaymentMethod('instapay')}
                          disabled={!ONLINE_PAYMENTS_ENABLED}
                          className="h-4 w-4 accent-olive-600"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-olive-900">{t('payment_tab_instapay')}</span>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 rounded-xl border-2 border-olive-100 p-4 ${ONLINE_PAYMENTS_ENABLED ? 'cursor-pointer hover:border-olive-200' : 'cursor-not-allowed'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          disabled={!ONLINE_PAYMENTS_ENABLED}
                          className="h-4 w-4 accent-olive-600"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-olive-900">{t('payment_tab_wallet')}</span>
                        </div>
                      </label>
                    </div>

                    {ONLINE_PAYMENTS_ENABLED && paymentMethod === 'card' && (
                      <p className="mt-3 text-xs text-olive-400 text-center">
                        {t('payment_card_note')}
                      </p>
                    )}

                    {ONLINE_PAYMENTS_ENABLED && paymentMethod === 'card' && (
                      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-olive-800">{tr('course_page', 'form_name')}</label>
                          <input {...register('name')} placeholder={tr('course_page', 'form_name_placeholder')} className="input-field" />
                          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-olive-800">{tr('course_page', 'form_email')}</label>
                          <input {...register('email')} type="email" placeholder="example@email.com" className="input-field" dir="ltr" />
                          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-olive-800">{tr('course_page', 'form_phone')}</label>
                          <input {...register('phone')} type="tel" placeholder="+20 100 000 0000" className="input-field" dir="ltr" />
                          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
                        </div>
                        {error && (
                          <div className="rounded-xl bg-danger/10 p-3 text-sm text-danger">
                            {error}
                          </div>
                        )}
                        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3.5 text-base !rounded-xl">
                          {submitting ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /><span>{tr('course_page', 'form_processing')}</span></>
                          ) : (
                            <><CreditCard className="h-5 w-5" /><span>{tr('course_page', 'form_pay')}</span></>
                          )}
                        </button>
                      </form>
                    )}

                    {ONLINE_PAYMENTS_ENABLED && paymentMethod === 'instapay' && (
                      <div className="mt-5 space-y-3">
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700 mb-2">{t('instapay_step1')}</p>
                          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-olive-100">
                            <span className="font-bold text-lg text-olive-900" dir="ltr">+201225965425</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('+201225965425').then(() => {
                                  setCopied('instapay')
                                  setTimeout(() => setCopied(null), 2000)
                                })
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-olive-100 px-3 py-2 hover:bg-olive-200 transition-colors"
                            >
                              {copied === 'instapay' ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <Copy className="h-4 w-4 text-olive-600" />
                              )}
                              <span className="text-xs font-medium text-olive-600">{copied === 'instapay' ? t('instapay_copied') : t('instapay_copy')}</span>
                            </button>
                          </div>
                        </div>
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700">{t('instapay_step2')}</p>
                        </div>
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700 mb-3">{t('instapay_step3')}</p>
                          <a
                            href="https://wa.me/201063167656"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white font-bold transition-colors hover:bg-green-700"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span>{t('instapay_whatsapp')}</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {ONLINE_PAYMENTS_ENABLED && paymentMethod === 'wallet' && (
                      <div className="mt-5 space-y-3">
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700 mb-2">{t('wallet_step1')}</p>
                          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-olive-100">
                            <span className="font-bold text-lg text-olive-900" dir="ltr">+201063167656</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('+201063167656').then(() => {
                                  setCopied('wallet')
                                  setTimeout(() => setCopied(null), 2000)
                                })
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-olive-100 px-3 py-2 hover:bg-olive-200 transition-colors"
                            >
                              {copied === 'wallet' ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <Copy className="h-4 w-4 text-olive-600" />
                              )}
                              <span className="text-xs font-medium text-olive-600">{copied === 'wallet' ? t('instapay_copied') : t('instapay_copy')}</span>
                            </button>
                          </div>
                        </div>
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700">{t('wallet_step2')}</p>
                        </div>
                        <div className="rounded-xl bg-olive-50/60 p-4 border border-olive-100/60">
                          <p className="text-sm font-semibold text-olive-700 mb-3">{t('wallet_step3')}</p>
                          <a
                            href="https://wa.me/201063167656"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white font-bold transition-colors hover:bg-green-700"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span>{t('instapay_whatsapp')}</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-olive-400">
                      <Shield className="h-3.5 w-3.5" />
                      <span>{tr('course_page', 'form_secure')}</span>
                    </div>
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
