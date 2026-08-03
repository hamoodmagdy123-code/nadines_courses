import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, BookOpen, ChevronRight, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { useLang } from '@/i18n/context'

type Page = 'about' | 'contact' | 'privacy' | 'delivery' | 'refund'
const phone = '01282192085'
const email = 'Nadinet389@gmail.com'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="policy-card"><div className="policy-card-number" aria-hidden="true" /><div><h2 className="text-base font-extrabold tracking-tight text-olive-900 sm:text-lg">{title}</h2><div className="mt-2 space-y-3 text-sm leading-7 text-olive-600 sm:text-[15px]">{children}</div></div></section>
}

export default function InformationPage({ page }: { page: Page }) {
  const { lang } = useLang()
  const ar = lang === 'ar'
  useEffect(() => { window.scrollTo(0, 0) }, [page])
  const title = {
    about: ar ? 'من نحن' : 'About Us', contact: ar ? 'اتصل بنا' : 'Contact Us',
    privacy: ar ? 'سياسة الخصوصية' : 'Privacy Policy', delivery: ar ? 'سياسة التسليم والشحن' : 'Delivery & Shipping Policy',
    refund: ar ? 'سياسة الاسترداد والإلغاء' : 'Refund & Cancellation Policy',
  }[page]
  const subtitle = {
    about: ar ? 'تعليم رقمي عملي، من الإسكندرية إلى العالم' : 'Practical digital education, from Alexandria to the world',
    contact: ar ? 'نحن هنا للمساعدة قبل وبعد الشراء' : 'We are here to help before and after your purchase',
    privacy: ar ? 'كيف نحمي بياناتك ونستخدمها بمسؤولية' : 'How we protect and responsibly use your information',
    delivery: ar ? 'وصول رقمي واضح وسريع بعد تأكيد الدفع' : 'Clear, fast digital access after payment confirmation',
    refund: ar ? 'شروط واضحة قبل إتمام عملية الشراء' : 'Clear terms before you complete your purchase',
  }[page]
  const PageIcon = { about: BookOpen, contact: Mail, privacy: ShieldCheck, delivery: Truck, refund: RotateCcw }[page]
  const navItems: Array<{ key: Page; href: string; label: string }> = [
    { key: 'about', href: '/about', label: ar ? 'من نحن' : 'About Us' },
    { key: 'contact', href: '/contact', label: ar ? 'اتصل بنا' : 'Contact Us' },
    { key: 'privacy', href: '/privacy-policy', label: ar ? 'الخصوصية' : 'Privacy' },
    { key: 'delivery', href: '/delivery-shipping-policy', label: ar ? 'التسليم' : 'Delivery' },
    { key: 'refund', href: '/refund-cancellation-policy', label: ar ? 'الاسترداد' : 'Refunds' },
  ]
  const contact = <p><a className="font-semibold text-olive-800 underline" href={`mailto:${email}`}>{email}</a> · <a className="font-semibold text-olive-800 underline" href="tel:+201282192085">{phone}</a></p>

  return <><Navbar /><div className="policy-page min-h-screen pb-20 pt-24 sm:pt-28"><div className="mx-auto max-w-6xl px-4 sm:px-6">
    <Link to="/" className="group inline-flex items-center gap-2 rounded-full border border-olive-100 bg-white/80 px-4 py-2 text-xs font-bold text-olive-700 shadow-sm transition hover:-translate-y-0.5 hover:border-olive-200 hover:text-olive-900"><ArrowLeft className={`h-3.5 w-3.5 transition group-hover:-translate-x-0.5 ${ar ? 'rotate-180 group-hover:translate-x-0.5' : ''}`} />{ar ? 'العودة للرئيسية' : 'Back to home'}</Link>
    <header className="policy-hero relative mt-5 overflow-hidden rounded-[1.75rem] bg-olive-900 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
      <div className="policy-hero-grid" aria-hidden="true" />
      <div className="relative z-10 grid items-end gap-7 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl"><div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sticky-yellow text-olive-900 shadow-[3px_3px_0_rgba(255,255,255,.18)]"><PageIcon className="h-5 w-5" /></span><span className="text-[11px] font-extrabold uppercase tracking-[.22em] text-olive-200">Nadine Courses</span></div><h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">{subtitle}</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 text-xs font-semibold text-white/65 backdrop-blur-sm"><BadgeCheck className="h-4 w-4 text-sticky-yellow" />{page === 'about' || page === 'contact' ? (ar ? 'معلومات موثقة' : 'Verified information') : (ar ? 'محدثة في 3 أغسطس 2026' : 'Updated Aug 3, 2026')}</div>
      </div>
    </header>
    <nav className="policy-mobile-nav mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label={ar ? 'صفحات المعلومات' : 'Information pages'}>{navItems.map(item => <Link key={item.key} to={item.href} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${page === item.key ? 'bg-olive-800 text-white' : 'border border-olive-100 bg-white text-olive-600'}`}>{item.label}</Link>)}</nav>
    <div className="mt-7 grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
      <aside className="sticky top-24 hidden rounded-2xl border border-olive-100/70 bg-white/75 p-2 shadow-sm backdrop-blur-sm lg:block"><p className="px-3 pb-2 pt-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-olive-400">{ar ? 'معلومات مهمة' : 'Essential info'}</p>{navItems.map(item => <Link key={item.key} to={item.href} className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${page === item.key ? 'bg-olive-800 text-white shadow-sm' : 'text-olive-600 hover:bg-olive-50 hover:text-olive-900'}`}><span>{item.label}</span><ChevronRight className={`h-4 w-4 opacity-50 ${ar ? 'rotate-180' : ''}`} /></Link>)}</aside>
      <main className="policy-content min-w-0 space-y-4">
      {page === 'about' && <>
        <Section title={ar ? 'تعلم مهارات عملية لبناء عملك الرقمي' : 'Practical skills for building your digital business'}><p>{ar ? 'نادين كورسز منصة تعليمية رقمية مقرها العصافرة، الإسكندرية، مصر. نقدم كورسات عملية تساعد المبتدئين وصناع المحتوى وأصحاب المشاريع على بناء المنتجات الرقمية وتقديم الخدمات عبر الإنترنت.' : 'Nadine Courses is a digital education business based in Asafra, Alexandria, Egypt. We provide practical online courses that help beginners, creators, and entrepreneurs build digital products and offer services online.'}</p><p>{ar ? 'تم تصميم المحتوى ليكون واضحًا وقابلًا للتطبيق، مع خطوات عملية ودعم مباشر بعد الشراء.' : 'Our content is designed to be clear and actionable, with practical steps and direct support after purchase.'}</p></Section>
        <Section title={ar ? 'منتجاتنا' : 'Our products'}><p>{ar ? 'نقدم حاليًا كورس Digital Product بسعر 400 جنيه مصري (50 دولارًا دوليًا)، وكورس Drop Service بسعر 1,500 جنيه مصري (100 دولار دوليًا). تظهر الأسعار النهائية بوضوح قبل الدفع.' : 'We currently offer the Digital Product course for EGP 400 (USD 50 internationally) and the Drop Service course for EGP 1,500 (USD 100 internationally). Final prices are clearly displayed before payment.'}</p><Link to="/#courses" className="font-bold text-olive-800 underline">{ar ? 'عرض الكورسات والأسعار' : 'View courses and prices'}</Link></Section>
      </>}
      {page === 'contact' && <Section title={ar ? 'بيانات التواصل' : 'Contact details'}><p>{ar ? 'يسعدنا مساعدتك في الأسئلة المتعلقة بالكورسات أو الدفع أو الوصول إلى المحتوى.' : 'We are happy to help with questions about courses, payment, or access to your content.'}</p><div className="mt-5 grid gap-3"><a href={`mailto:${email}`} className="flex items-center gap-3 rounded-xl bg-olive-50 p-4"><Mail className="h-5 w-5" /><span><strong>{ar ? 'البريد الإلكتروني:' : 'Email:'}</strong> {email}</span></a><a href="tel:+201282192085" className="flex items-center gap-3 rounded-xl bg-olive-50 p-4"><Phone className="h-5 w-5" /><span><strong>{ar ? 'الهاتف:' : 'Phone:'}</strong> {phone}</span></a><div className="flex items-center gap-3 rounded-xl bg-olive-50 p-4"><MapPin className="h-5 w-5" /><span><strong>{ar ? 'عنوان النشاط:' : 'Business address:'}</strong> {ar ? 'العصافرة، الإسكندرية، مصر' : 'Asafra, Alexandria, Egypt'}</span></div></div></Section>}
      {page === 'privacy' && <>
        <Section title={ar ? 'المعلومات التي نجمعها' : 'Information we collect'}><p>{ar ? 'نجمع المعلومات التي تقدمها عند الطلب أو التواصل معنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف وتفاصيل الطلب. لا نخزن بيانات بطاقتك كاملة؛ تتم معالجة الدفع بأمان من خلال مزود خدمة الدفع.' : 'We collect information you provide when ordering or contacting us, such as your name, email, phone number, and order details. We do not store full card details; payments are securely processed by our payment service provider.'}</p></Section>
        <Section title={ar ? 'كيف نستخدم معلوماتك' : 'How we use your information'}><p>{ar ? 'نستخدم بياناتك لمعالجة الطلب، والتحقق من الدفع، والتواصل معك لتسليم الكورس، وتقديم الدعم، ومنع الاحتيال، والوفاء بالالتزامات القانونية.' : 'We use your information to process orders, verify payment, deliver your course, provide support, prevent fraud, and meet legal obligations.'}</p></Section>
        <Section title={ar ? 'المشاركة والحماية والاحتفاظ' : 'Sharing, security, and retention'}><p>{ar ? 'قد نشارك الحد الأدنى اللازم من البيانات مع مزودي الدفع والاستضافة والخدمات الفنية لتنفيذ طلبك. لا نبيع بياناتك الشخصية. نستخدم إجراءات أمنية معقولة ونحتفظ بالبيانات فقط للمدة اللازمة.' : 'We may share the minimum necessary data with payment, hosting, and technical providers to fulfill your order. We do not sell personal information. We use reasonable security measures and retain data only as long as needed.'}</p></Section>
        <Section title={ar ? 'حقوقك والتواصل معنا' : 'Your rights and contact'}><p>{ar ? 'يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها، وفقًا للقانون المعمول به، عبر:' : 'You may request access to, correction of, or deletion of your data, subject to applicable law, via:'}</p>{contact}</Section>
      </>}
      {page === 'delivery' && <>
        <Section title={ar ? 'طريقة وموعد التسليم' : 'Delivery method and timing'}><p>{ar ? 'جميع منتجاتنا كورسات رقمية، لذلك لا يوجد شحن مادي. بعد إتمام الطلب والتحقق من نجاح الدفع، سنتواصل مع العميل خلال ساعة واحدة باستخدام رقم الهاتف أو البريد الإلكتروني المقدم أثناء الطلب لترتيب الوصول إلى محتوى الكورس.' : 'All our products are digital courses, so no physical shipping is required. After payment is successfully verified, we will contact the customer within one hour using the phone number or email provided at checkout to arrange access to the course content.'}</p></Section>
        <Section title={ar ? 'التأخير أو بيانات التواصل غير الصحيحة' : 'Delays or incorrect contact details'}><p>{ar ? 'يرجى التأكد من صحة بياناتك. إذا لم نتواصل خلال ساعة من تأكيد الدفع، أرسل رقم الطلب وإثبات الدفع عبر:' : 'Please ensure your details are correct. If we have not contacted you within one hour of payment confirmation, send your order number and proof of payment via:'}</p>{contact}</Section>
      </>}
      {page === 'refund' && <>
        <Section title={ar ? 'جميع المدفوعات نهائية' : 'All payments are final'}><p>{ar ? 'نظرًا لأن الكورسات منتجات رقمية ويتم تجهيز الوصول إليها فور التحقق من الدفع، لا تتوفر عمليات استرداد بعد إتمام الدفع. بإكمال الشراء، يقر العميل بأنه راجع وصف الكورس والسعر ووافق على هذه السياسة.' : 'Because our courses are digital products and access is prepared immediately after payment verification, no refunds are available after payment is completed. By purchasing, the customer confirms they reviewed the course description and price and accepted this policy.'}</p></Section>
        <Section title={ar ? 'الإلغاء' : 'Cancellation'}><p>{ar ? 'يمكنك التراجع قبل إتمام الدفع. بعد نجاح الدفع، لا يمكن إلغاء الطلب أو استرداد قيمته.' : 'You may abandon the purchase before completing payment. Once payment succeeds, the order cannot be cancelled or refunded.'}</p></Section>
        <Section title={ar ? 'مشكلات الدفع والوصول' : 'Payment or access issues'}><p>{ar ? 'إذا خُصم المبلغ أكثر من مرة للطلب نفسه أو لم نتمكن من توفير الكورس، تواصل معنا لمراجعة الخطأ وتصحيحه. لا يؤثر ذلك على أي حقوق إلزامية يقررها القانون.' : 'If you were charged more than once for the same order or we cannot provide the purchased course, contact us so we can investigate and correct the error. This does not limit mandatory rights under applicable law.'}</p>{contact}</Section>
      </>}
      </main>
    </div>
  </div></div></>
}
