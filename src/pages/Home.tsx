import { useGeo } from '@/hooks/useGeo'
import { Navbar } from '@/components/Navbar'
import { CourseCard } from '@/components/CourseCard'
import { useCourses, useFAQ } from '@/hooks/useCourses'
import { useSC } from '@/hooks/useSiteContent'
import { useLang } from '@/i18n/context'
import { Star, CheckCircle, MessageCircle, Shield, ChevronDown, Play, Eye, Users, Award, Quote } from 'lucide-react'
import { useState } from 'react'

function HeroSection() {
  const { t, lang } = useLang()
  const { tr } = useSC()

  return (
    <section className="relative overflow-hidden bg-olive-500 pt-24 pb-28 sm:pt-28 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-sticky-yellow blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-olive-300 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="overflow-hidden rounded-[2rem] bg-paper/95 p-6 pb-20 sm:p-10 sm:pb-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14 lg:pb-28"
          style={{ boxShadow: 'var(--shadow-hero)' }}
        >
          <div className={`text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
            <div className="animate-fade-in-up">
              <span className="sticky-note sticky-note-2 mb-6 inline-flex text-sm sm:text-base">
                {tr('hero', 'badge')}
              </span>
            </div>
            <h1 className="animate-fade-in-up animation-delay-100 text-3xl font-bold leading-[1.2] text-olive-900 sm:text-4xl lg:text-[2.75rem]">
              {tr('hero', 'title')}
            </h1>
            <p className={`animate-fade-in-up animation-delay-200 mx-auto mt-5 max-w-md text-base leading-relaxed text-olive-600 sm:text-lg ${lang === 'ar' ? 'lg:mx-0' : 'lg:ml-0 lg:mr-auto'}`}>
              {tr('hero', 'subtitle')}
            </p>
            <div className={`animate-fade-in-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row ${lang === 'ar' ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <a href="#courses" className="btn-primary !px-8 !py-4 !text-sm sm:!text-base">
                {tr('hero', 'cta')}
              </a>
              <a href="#faq" className="group inline-flex items-center gap-3 text-sm font-semibold text-olive-700 transition-colors hover:text-olive-900">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-olive-50 transition-all duration-300 group-hover:bg-olive-100 group-hover:scale-110">
                  <span className="absolute inset-0 rounded-full bg-olive-200/50 animate-pulse" />
                  <Play className="relative h-4 w-4 fill-olive-700 text-olive-700" />
                </span>
                {t('nav_faq')}
              </a>
            </div>
          </div>

          <div className="relative mx-auto mt-14 w-full max-w-sm lg:mt-0">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-[8%] top-[5%] h-[75%] w-[75%] rounded-full bg-sticky-yellow/60 blur-[2px]" />
              <div className="absolute bottom-[8%] right-[5%] h-[80%] w-[80%] rounded-full bg-olive-200/80" />
            </div>
            <img
              src={tr('hero', 'image_url') || '/nadines.png'}
              alt="Nadine"
              className="relative z-10 mx-auto w-full rounded-[1.5rem] sm:rounded-[2rem]"
              style={{ boxShadow: '0 20px 60px -15px rgba(42,44,20,0.4)' }}
              loading="eager"
            />
            <div className="animate-fade-in-up animation-delay-500 absolute bottom-4 right-0 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 sm:right-2"
              style={{ boxShadow: '0 8px 30px -8px rgba(42,44,20,0.2)' }}
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-olive-200 to-olive-300" />
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-bold text-olive-900">{tr('hero', 'instructor_name')}</p>
                <p className="text-xs text-olive-500">{tr('hero', 'instructor_label')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <StatsBar />
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
    <div className="relative z-10 mx-auto -mt-8 max-w-4xl px-4 sm:-mt-10 sm:px-6">
      <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white p-5 shadow-card sm:p-7">
        {stats.map((s, i) => {
          const Icon = icons[i] || Eye
          return (
            <div key={i} className="flex items-center justify-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sticky-yellow/60 text-olive-800">
                <Icon className="h-5 w-5" />
              </span>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-lg font-bold text-olive-900 sm:text-xl">{s.value}</p>
                <p className="text-xs text-olive-500">{lang === 'ar' ? s.label?.ar : s.label?.en}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CoursesSection() {
  const { countryCode } = useGeo()
  const { tr } = useSC()
  const { data: courses = [] } = useCourses()

  return (
    <section id="courses" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-olive-50 via-paper to-olive-100/60" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-sticky-yellow/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-olive-200/20 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <span className="sticky-note sticky-note-2 mb-5 inline-flex">{tr('courses_header', 'badge')}</span>
          <h2 className="text-3xl font-bold text-olive-900 sm:text-4xl">{tr('courses_header', 'title')}</h2>
          <p className="mx-auto mt-3 max-w-md text-olive-600/80">{tr('courses_header', 'subtitle')}</p>
        </div>
        <div className="space-y-8">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} countryCode={countryCode} variant={i === 0 ? 'primary' : 'secondary'} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const { lang } = useLang()
  const { arr } = useSC()
  const items = arr('trust') as Array<{ label: { ar: string; en: string }; sub: { ar: string; en: string } }>
  const icons = [Shield, MessageCircle, CheckCircle, Star]

  return (
    <section className="bg-olive-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i] || Star
            return (
              <div key={i} className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6"
                style={{ boxShadow: '0 1px 3px rgba(42,44,20,0.04), 0 8px 30px -8px rgba(63,66,31,0.12)' }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-600 transition-all duration-300 group-hover:bg-olive-200 group-hover:scale-110">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="font-semibold text-olive-900">{lang === 'ar' ? item.label?.ar : item.label?.en}</p>
                {item.sub && <p className="text-xs text-olive-500 sm:text-sm">{lang === 'ar' ? item.sub?.ar : item.sub?.en}</p>}
              </div>
            )
          })}
        </div>
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
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-olive-900 sm:text-4xl">{tr('testimonials', 'title')}</h2>
          <p className="mx-auto mt-3 max-w-md text-olive-600/80">{tr('testimonials', 'subtitle')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl"
              style={{ boxShadow: '0 1px 3px rgba(42,44,20,0.04), 0 8px 30px -8px rgba(63,66,31,0.12)' }}
            >
              <Quote className="mb-3 h-8 w-8 text-olive-200" />
              <p className="mb-4 text-sm leading-relaxed text-olive-600 sm:text-base">
                {lang === 'ar' ? item.text?.ar : item.text?.en}
              </p>
              <div className="flex items-center gap-3 border-t border-olive-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-olive-100 text-sm font-bold text-olive-700">
                  {item.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-olive-800">{item.name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-sticky-yellow text-sticky-yellow" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const { data: faqs = [] } = useFAQ()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { lang } = useLang()
  const { tr } = useSC()

  return (
    <section id="faq" className="bg-paper py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-olive-900 sm:text-4xl">{tr('faq', 'title') || 'FAQ'}</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const q = lang === 'ar' ? faq.question : faq.question_en
            const a = lang === 'ar' ? faq.answer : faq.answer_en
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-olive-100/80 bg-white transition-all duration-300 hover:shadow-md">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`flex w-full items-center justify-between p-5 text-right font-semibold text-olive-800 transition-colors hover:bg-olive-50/50 sm:p-6 ${lang === 'ar' ? '' : 'text-left'}`}
                >
                  <span className="text-sm sm:text-base">{q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-olive-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className={`px-5 pb-6 leading-relaxed text-olive-600 sm:px-6 sm:text-sm ${lang === 'ar' ? '' : 'ml-6 mr-5 sm:ml-6 sm:mr-6'}`}>
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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
    </>
  )
}
