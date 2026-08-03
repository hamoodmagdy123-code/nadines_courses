import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { useLang } from '@/i18n/context'

type Page = 'about' | 'contact' | 'privacy' | 'delivery' | 'refund'
const phone = '01282192085'
const email = 'Nadinet389@gmail.com'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-olive-100/70 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-lg font-bold text-olive-900 sm:text-xl">{title}</h2><div className="mt-3 space-y-3 text-sm leading-7 text-olive-600 sm:text-base">{children}</div></section>
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
  const contact = <p><a className="font-semibold text-olive-800 underline" href={`mailto:${email}`}>{email}</a> · <a className="font-semibold text-olive-800 underline" href="tel:+201282192085">{phone}</a></p>

  return <><Navbar /><div className="min-h-screen bg-paper pb-20 pt-28 sm:pt-32"><div className="mx-auto max-w-4xl px-4 sm:px-6">
    <Link to="/" className="text-sm font-semibold text-olive-600 hover:text-olive-900">{ar ? '← العودة للرئيسية' : '← Back to home'}</Link>
    <header className="mb-8 mt-6 rounded-3xl bg-olive-500 px-6 py-10 text-center sm:px-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-sticky-yellow">Nadine Courses</p><h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>{page !== 'about' && page !== 'contact' && <p className="mt-3 text-sm text-white/65">{ar ? 'آخر تحديث: 3 أغسطس 2026' : 'Last updated: August 3, 2026'}</p>}</header>
    <div className="space-y-5">
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
    </div>
  </div></div></>
}
