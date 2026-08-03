import { useGeo } from '@/hooks/useGeo'
import { Navbar } from '@/components/Navbar'
import { CourseCard } from '@/components/CourseCard'
import { useCourses } from '@/hooks/useCourses'
import { useSC } from '@/hooks/useSiteContent'
import { useLang } from '@/i18n/context'
import {
  Star, CheckCircle, MessageCircle, Shield, ChevronDown,
  Play, Eye, Users, Award, Quote, Sparkles, ArrowLeft,
  Zap, Heart, GraduationCap, Send,
} from 'lucide-react'
import { useState, useEffect, useRef, type ReactNode } from 'react'

let sharedObserver: IntersectionObserver | null = null
const visibleTargets = new WeakSet<Element>()

function getObserver() {
  if (sharedObserver) return sharedObserver
  if (typeof IntersectionObserver === 'undefined') return null
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !visibleTargets.has(entry.target)) {
          visibleTargets.add(entry.target)
          entry.target.classList.add('reveal-visible')
          sharedObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px 40px 0px' },
  )
  return sharedObserver
}

function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = getObserver()
    if (!obs) return
    obs.observe(el)
    return () => {
      obs.unobserve(el)
    }
  }, [])

  if (delay > 0) {
    return (
      <div
        ref={ref}
        className={`reveal-init reveal-on-intersect ${className}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={`reveal-init reveal-on-intersect ${className}`}>
      {children}
    </div>
  )
}

function HeroSection() {
  const { t, lang } = useLang()
  const { tr } = useSC()

  return (
    <section className="relative overflow-hidden bg-olive-500 pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-20 lg:pb-8">
      <div className="hero-mesh pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
        <div className="float-orb absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-sticky-yellow/60 hidden sm:block" />
        <div className="float-orb absolute right-[15%] top-[25%] h-2 w-2 rounded-full bg-olive-300/50 hidden sm:block" />
        <div className="float-orb absolute left-[60%] top-[10%] h-4 w-4 rounded-full bg-sticky-yellow/40 hidden sm:block" />
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-sticky-yellow/[0.06] blur-[120px] hidden sm:block" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-olive-300/[0.08] blur-[150px] hidden sm:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-paper/[0.97] p-5 sm:p-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:p-8"
          style={{ boxShadow: '0 30px 80px -20px rgba(42,44,20,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset' }}
        >
          <div className={`text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
            <div className="animate-fade-in-up">
              <span className="sticky-note sticky-note-2 mb-5 inline-flex text-xs sm:text-sm">
                {tr('hero', 'badge')}
              </span>
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 text-[1.75rem] font-extrabold leading-[1.12] text-olive-900 sm:text-4xl lg:text-[2.25rem] tracking-tight">
              {tr('hero', 'title')}
            </h1>

            <p className={`animate-fade-in-up animation-delay-200 mx-auto mt-3 max-w-sm text-sm leading-relaxed text-olive-600 sm:mt-4 sm:max-w-md sm:text-base lg:text-lg ${lang === 'ar' ? 'lg:mx-0' : 'lg:ml-0 lg:mr-auto'}`}>
              {tr('hero', 'subtitle')}
            </p>

            <div className={`animate-fade-in-up animation-delay-300 mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:gap-4 ${lang === 'ar' ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <a href="#courses" className="btn-primary btn-shimmer !px-7 !py-3.5 !text-sm sm:!px-8 sm:!py-4 sm:!text-base !rounded-xl w-full sm:w-auto">
                {tr('hero', 'cta')}
              </a>
              <a href="#faq" className="group inline-flex items-center gap-2.5 text-sm font-semibold text-olive-700 transition-colors hover:text-olive-900">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-olive-50 transition-all duration-300 group-hover:bg-olive-100 group-hover:scale-110 group-hover:shadow-md">
                  <span className="absolute inset-0 rounded-full bg-olive-200/40 animate-pulse" />
                  <Play className="relative h-4 w-4 fill-olive-700 text-olive-700" />
                </span>
                {t('nav_faq')}
              </a>
            </div>

            <div className={`animate-fade-in-up animation-delay-400 mt-4 flex items-center gap-3 sm:mt-5 ${lang === 'ar' ? 'justify-center lg:justify-start' : 'justify-center lg:justify-start'}`}>
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[0,1,2].map(i => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-paper bg-gradient-to-br from-olive-200 to-olive-300 shadow-sm" style={{ zIndex: 3-i }} />
                ))}
              </div>
              <p className="text-xs font-medium text-olive-500">
                {lang === 'ar' ? '+200 طالب سعيد' : '+200 happy students'}
              </p>
            </div>
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-[280px] sm:max-w-sm lg:mt-0">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-[5%] top-[3%] h-[80%] w-[80%] rounded-full bg-sticky-yellow/40 hidden sm:block sm:blur-[3px]" />
              <div className="absolute bottom-[5%] right-[3%] h-[85%] w-[85%] rounded-full bg-olive-200/60" />
            </div>
            <img
              src="/nadines.webp"
              alt="Nadine"
              className="relative z-10 mx-auto w-full rounded-[1.25rem] sm:rounded-[1.75rem] transition-transform duration-700 hover:scale-[1.02]"
              style={{ boxShadow: '0 25px 60px -15px rgba(42,44,20,0.45)' }}
              loading="eager"
            />
            <div className="animate-fade-in-up animation-delay-500 absolute -bottom-3 right-0 z-20 flex items-center gap-2.5 rounded-xl bg-white/95 backdrop-blur-sm px-3.5 py-2.5 sm:-bottom-4 sm:right-2 sm:rounded-2xl sm:px-4 sm:py-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 30px -8px rgba(42,44,20,0.2)' }}
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-olive-200 to-olive-300 shadow-inner sm:h-10 sm:w-10" />
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-xs font-bold text-olive-900 sm:text-sm">{tr('hero', 'instructor_name')}</p>
                <p className="text-[10px] text-olive-500 sm:text-xs">{tr('hero', 'instructor_label')}</p>
              </div>
            </div>
          </div>
        </div>

        <StatsBar />
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12 lg:h-14">
          <path d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,25 L1440,60 L0,60 Z" fill="#7C8050" />
        </svg>
      </div>
    </section>
  )
}

function StatsBar() {
  const { lang } = useLang()
  const { arr } = useSC()
  const stats = arr('stats') as Array<{ value: string; label: { ar: string; en: string } }>
  const icons = [Eye, Users, Award]

  if (!stats.length) return null

  return (
    <RevealSection className="relative z-10 mx-auto -mt-6 max-w-3xl px-4 sm:-mt-8 sm:px-6">
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/95 backdrop-blur-sm p-3 sm:p-5 sm:gap-5"
        style={{ boxShadow: '0 15px 50px -15px rgba(42,44,20,0.15), 0 0 0 1px rgba(255,255,255,0.6) inset' }}
      >
        {stats.map((s, i) => {
          const Icon = icons[i] || Eye
          return (
            <div key={i} className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sticky-yellow/40 to-sticky-yellow/20 text-olive-800 sm:h-10 sm:w-10 sm:rounded-xl">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-base font-extrabold text-olive-900 sm:text-xl">{s.value}</p>
                <p className="text-[10px] text-olive-500 sm:text-xs">{lang === 'ar' ? s.label?.ar : s.label?.en}</p>
              </div>
            </div>
          )
        })}
      </div>
    </RevealSection>
  )
}

function TrustSection() {
  const { lang } = useLang()
  const { arr } = useSC()
  const items = arr('trust') as Array<{ label: { ar: string; en: string }; sub: { ar: string; en: string } }>
  const icons = [Shield, MessageCircle, CheckCircle, Star]

  return (
    <section className="relative overflow-hidden py-20 pb-28 sm:py-24 sm:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-olive-500 via-olive-500/95 to-olive-500" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sticky-yellow/10 blur-[60px] hidden sm:block" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-olive-300/15 blur-[50px] hidden sm:block" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection>
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
              {lang === 'ar' ? 'ليه تختارنا؟' : 'Why Choose Us?'}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/60 sm:text-base">
              {lang === 'ar' ? 'بنقدملك الأفضل في التعليم الرقمي' : 'We deliver the best in digital education'}
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i] || Star
            return (
              <RevealSection key={i} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-2xl bg-white/[0.08] backdrop-blur-sm p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.14] sm:rounded-3xl sm:p-6 border border-white/[0.08] hover:border-white/[0.15]"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-sticky-yellow/60 via-sticky-yellow to-sticky-yellow/60 transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.1] text-white/80 transition-all duration-300 group-hover:bg-white/[0.18] group-hover:scale-110 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-white sm:text-sm">{lang === 'ar' ? item.label?.ar : item.label?.en}</p>
                  {item.sub && <p className="mt-1 text-[10px] text-white/50 sm:text-xs leading-relaxed">{lang === 'ar' ? item.sub?.ar : item.sub?.en}</p>}
                </div>
              </RevealSection>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12 lg:h-14">
          <path d="M0,30 C360,60 720,0 1080,35 C1260,50 1380,20 1440,15 L1440,60 L0,60 Z" fill="#F3F4E9" />
        </svg>
      </div>
    </section>
  )
}

function CoursesSection() {
  const { countryCode } = useGeo()
  const { tr } = useSC()
  const { data: courses = [], isLoading } = useCourses()
  const { lang } = useLang()

  return (
    <section id="courses" className="relative overflow-hidden py-20 pb-28 sm:py-28 sm:pb-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-olive-50 via-paper to-olive-100/60" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-sticky-yellow/10 blur-[100px] hidden sm:block" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-olive-200/15 blur-[100px] hidden sm:block" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection>
          <div className="mb-12 text-center sm:mb-16">
            <span className="sticky-note sticky-note-2 mb-4 inline-flex text-xs sm:text-sm">{tr('courses_header', 'badge')}</span>
            <h2 className="text-2xl font-extrabold text-olive-900 sm:text-4xl tracking-tight">{tr('courses_header', 'title')}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-olive-600/80 sm:text-base">{tr('courses_header', 'subtitle')}</p>
          </div>
        </RevealSection>

        {isLoading ? (
          <div className="space-y-6 sm:space-y-8">
            {[0, 1].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white/60 ring-1 ring-olive-100/30 sm:rounded-3xl lg:grid lg:grid-cols-[1fr_1.15fr]">
                <div className="min-h-[200px] bg-olive-100/40 sm:min-h-[280px] lg:min-h-[320px]" />
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-olive-100" />
                    <div className="h-5 w-40 rounded-lg bg-olive-100" />
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="h-3 w-full rounded bg-olive-100/60" />
                    <div className="h-3 w-3/4 rounded bg-olive-100/60" />
                  </div>
                  <div className="mb-5 space-y-2">
                    <div className="h-3 w-5/6 rounded bg-olive-100/40" />
                    <div className="h-3 w-2/3 rounded bg-olive-100/40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-20 rounded-lg bg-olive-100" />
                    <div className="h-10 w-28 rounded-xl bg-olive-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {courses.map((course, i) => (
              <RevealSection key={course.id} delay={i * 150}>
                <CourseCard course={course} countryCode={countryCode} variant={i === 0 ? 'primary' : 'secondary'} />
              </RevealSection>
            ))}
          </div>
        ) : (
          <RevealSection>
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-100/60">
                <GraduationCap className="h-8 w-8 text-olive-400" />
              </div>
              <p className="text-olive-500 font-medium">{lang === 'ar' ? 'الكورسات قادمة قريباً' : 'Courses coming soon'}</p>
            </div>
          </RevealSection>
        )}
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12 lg:h-14">
          <path d="M0,25 C240,0 480,55 720,20 C960,55 1200,5 1440,30 L1440,60 L0,60 Z" fill="#F3EEDC" />
        </svg>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { lang } = useLang()
  const { get, tr } = useSC()
  const section = get('testimonials')
  const items = (section.items || []) as Array<{ name: string; text: { ar: string; en: string } }>

  if (!items.length) return null

  return (
    <section className="relative overflow-hidden bg-paper-dim py-20 pb-28 sm:py-28 sm:pb-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-sticky-yellow/5 blur-[80px] hidden sm:block" />
        <div className="absolute left-1/4 bottom-0 h-56 w-56 rounded-full bg-olive-200/10 blur-[60px] hidden sm:block" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealSection>
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-3 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sticky-yellowDark sm:h-5 sm:w-5" />
              <span className="text-xs font-semibold text-olive-500 uppercase tracking-wider sm:text-sm">{tr('testimonials', 'subtitle')}</span>
              <Sparkles className="h-4 w-4 text-sticky-yellowDark sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-olive-900 sm:text-4xl tracking-tight">{tr('testimonials', 'title')}</h2>
          </div>
        </RevealSection>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {items.map((item, i) => (
            <RevealSection key={i} delay={i * 80}>
              <div
                className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:rounded-3xl sm:p-6 border border-olive-100/30 hover:border-olive-200/60"
                style={{ boxShadow: '0 1px 3px rgba(42,44,20,0.04), 0 8px 30px -8px rgba(63,66,31,0.08)' }}
              >
                <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-olive-50/60 transition-all duration-500 group-hover:scale-150 group-hover:bg-olive-100/30" />
                <Quote className="relative mb-3 h-6 w-6 text-sticky-yellow/70 sm:h-7 sm:w-7" />
                <p className="relative mb-4 text-sm leading-relaxed text-olive-600 sm:mb-5 sm:text-[15px]">
                  {lang === 'ar' ? item.text?.ar : item.text?.en}
                </p>
                <div className="relative flex items-center gap-3 border-t border-olive-100/60 pt-3.5 sm:pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-olive-100 to-olive-200 text-xs font-bold text-olive-700 shadow-sm sm:h-10 sm:w-10 sm:text-sm">
                    {item.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-olive-800 sm:text-sm">{item.name}</p>
                    <div className="mt-0.5 flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-2.5 w-2.5 fill-sticky-yellow text-sticky-yellow sm:h-3 sm:w-3" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12 lg:h-14">
          <path d="M0,35 C180,10 360,50 540,25 C720,55 900,5 1080,30 C1260,50 1380,15 1440,20 L1440,60 L0,60 Z" fill="#FBF8EF" />
        </svg>
      </div>
    </section>
  )
}

function FAQSection() {
  const { arr, tr } = useSC()
  const faqs = arr('faq') as Array<{ question: string; answer: string; question_en: string; answer_en: string }>
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { lang } = useLang()

  return (
    <section id="faq" className="relative overflow-hidden py-20 pb-28 sm:py-28 sm:pb-36">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-paper-dim to-paper" />
      <div className="absolute -right-32 top-1/4 h-48 w-48 rounded-full bg-sticky-yellow/[0.06] blur-[60px] hidden sm:block" />
      <div className="absolute -left-20 bottom-1/4 h-40 w-40 rounded-full bg-olive-200/[0.08] blur-[50px] hidden sm:block" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <RevealSection>
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="text-2xl font-extrabold text-olive-900 sm:text-4xl tracking-tight">{tr('faq', 'title') || 'FAQ'}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-olive-500/80 sm:mt-3">
              {lang === 'ar' ? 'إجابات على الأسئلة الشائعة' : 'Answers to common questions'}
            </p>
          </div>
        </RevealSection>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, i) => {
            const q = lang === 'ar' ? faq.question : faq.question_en
            const a = lang === 'ar' ? faq.answer : faq.answer_en
            const isOpen = openIndex === i
            return (
              <RevealSection key={i} delay={i * 60}>
                <div className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 sm:rounded-2xl ${isOpen ? 'border-olive-200 shadow-elevated' : 'border-olive-100/50 hover:border-olive-200/60 hover:shadow-soft'}`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={`flex w-full items-center justify-between gap-3 p-4 text-right font-semibold text-olive-800 transition-colors duration-200 sm:p-5 ${isOpen ? 'bg-olive-50/30' : 'hover:bg-olive-50/20'} ${lang === 'ar' ? '' : 'text-left'}`}
                  >
                    <span className="text-xs sm:text-sm leading-relaxed">{q}</span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${isOpen ? 'bg-olive-100 rotate-180' : 'bg-olive-50'}`}>
                      <ChevronDown className="h-4 w-4 text-olive-500" />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className={`px-4 pb-5 leading-relaxed text-olive-600 sm:px-5 sm:pb-6 sm:text-sm ${lang === 'ar' ? '' : 'ml-5 mr-4 sm:ml-5 sm:mr-5'}`}>
                        {a}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-full" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full sm:h-12 lg:h-14">
          <path d="M0,20 C480,55 960,5 1440,30 L1440,60 L0,60 Z" fill="#7C8050" />
        </svg>
      </div>
    </section>
  )
}

function CTASection() {
  const { lang } = useLang()
  const { tr } = useSC()

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-olive-500" />
      <div className="hero-mesh pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0">
        <div className="float-orb absolute left-[15%] top-[20%] h-3 w-3 rounded-full bg-sticky-yellow/50 hidden sm:block" />
        <div className="float-orb absolute right-[20%] bottom-[30%] h-2 w-2 rounded-full bg-sticky-yellow/40 hidden sm:block" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sticky-yellow/[0.08] blur-[80px] hidden sm:block" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-olive-300/[0.1] blur-[60px] hidden sm:block" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <RevealSection>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.1] px-4 py-1.5 text-xs font-semibold text-sticky-yellow backdrop-blur-sm border border-white/[0.08] sm:text-sm">
            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {lang === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}
          </span>
        </RevealSection>

        <RevealSection delay={100}>
          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl tracking-tight">
            {tr('cta', 'title') || (lang === 'ar' ? 'جاهز تبدأ؟' : 'Ready to Start?')}
          </h2>
        </RevealSection>

        <RevealSection delay={200}>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            {tr('cta', 'subtitle') || (lang === 'ar' ? 'انضم لطلابنا وابدأ تتعلم مع نادين' : 'Join our students and start learning with Nadine')}
          </p>
        </RevealSection>

        <RevealSection delay={300}>
          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href="#courses"
              className="cta-glow inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-olive-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              {tr('cta', 'btn') || (lang === 'ar' ? 'شوف الكورسات' : 'View Courses')}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </a>
            <a
              href="#faq"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30 sm:w-auto sm:px-8 sm:py-4"
            >
              <MessageCircle className="h-4 w-4" />
              {lang === 'ar' ? 'اسأل سؤالك' : 'Ask a Question'}
            </a>
          </div>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-white/40 sm:mt-10">
            <span className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 fill-white/30" />
              {lang === 'ar' ? '+200 طالب' : '+200 students'}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-sticky-yellow/60" />
              {lang === 'ar' ? 'تقييم ممتاز' : 'Top rated'}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Send className="h-3 w-3" />
              {lang === 'ar' ? 'تواصل خلال ساعة' : 'Contact within 1 hour'}
            </span>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CoursesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
