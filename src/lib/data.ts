export interface Course {
  id: string
  slug: string
  title: string
  title_en: string
  description: string
  description_en: string
  curriculum: string[]
  curriculum_en: string[]
  image_url: string
  egypt_price: number
  egypt_currency: string
  international_price_usd: number
  is_active: boolean
  sort_order: number
  icon: string
}

export interface FAQ {
  question: string
  answer: string
  question_en: string
  answer_en: string
}

export interface SiteContentData {
  faq: FAQ[]
}

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    slug: 'digital-product',
    title: 'ديجيتال برودكت',
    title_en: 'Digital Product',
    description: 'اتعلم إزاي تبني منتجات ديجيتال تبيعها أونلاين وتحقق دخل سلبي. من الصفر لحد أول 1000 دولار.',
    description_en: 'Learn how to build digital products to sell online and generate passive income. From zero to your first $1000.',
    curriculum: [
      'أساسيات المنتجات الرقمية',
      'اختيار النيشان الصح',
      'بناء المنتج من الصفر',
      'تصميم وتجربة المستخدم',
      'التسويق والمبيعات',
      'الأتمتة والدخل السلبي',
    ],
    curriculum_en: [
      'Digital product basics',
      'Choosing the right niche',
      'Building from scratch',
      'Design & UX',
      'Marketing & sales',
      'Automation & passive income',
    ],
    image_url: '/digital_products.png',
    egypt_price: 400,
    egypt_currency: 'EGP',
    international_price_usd: 50,
    is_active: true,
    sort_order: 1,
    icon: 'Package',
  },
  {
    id: '2',
    slug: 'drop-service',
    title: 'دروب سيرفس',
    title_en: 'Drop Service',
    description: 'اتعلم إزاي تقدم خدمات أونلاين من غير ما تملك خبرة مباشرة. بيزنس بمرن مية مية يبدأ بـ 0 جنيه.',
    description_en: 'Learn how to offer online services without direct expertise. A smooth business model starting from $0.',
    curriculum: [
      'مفهوم الدروب سيرفس',
      'اختيار الخدمة المناسبة',
      'العثور على العملاء',
      'بناء فريق التنفيذ',
      'إدارة المشاريع',
      'توسيع البيزنس',
    ],
    curriculum_en: [
      'Drop service concept',
      'Choosing the right service',
      'Finding clients',
      'Building an execution team',
      'Project management',
      'Scaling the business',
    ],
    image_url: '/drop_service.png',
    egypt_price: 1500,
    egypt_currency: 'EGP',
    international_price_usd: 100,
    is_active: true,
    sort_order: 2,
    icon: 'Layers',
  },
]

export const MOCK_SITE_CONTENT: SiteContentData = {
  faq: [
    {
      question: 'هل الكورس مناسب للمبتدئين؟',
      answer: 'أيوه، الكورس بيبدأ من الصفر ومحتاج أي خبرة سابقة.',
      question_en: 'Is the course suitable for beginners?',
      answer_en: 'Yes, the course starts from scratch. No prior experience needed.',
    },
    {
      question: 'إيه طريقة التسليم؟',
      answer: 'بعد الدفع، هنتواصل معاك على تليجرام وتاخد كل المحتوى.',
      question_en: 'How is the course delivered?',
      answer_en: 'After payment, we\'ll contact you on Telegram and you\'ll get all the content.',
    },
    {
      question: 'هل في ضمان استرجاع؟',
      answer: 'لو الكورس مش مناسب ليك خلال أول 7 أيام، هنرجعلك فلوسك.',
      question_en: 'Is there a refund guarantee?',
      answer_en: 'If the course isn\'t right for you within the first 7 days, we\'ll refund your money.',
    },
    {
      question: 'بتدفع إزاي؟',
      answer: 'الدفع آمن وبيتم عبر Paymob ببطاقة الائتمان أو فودافون كاش.',
      question_en: 'How do I pay?',
      answer_en: 'Payment is secure via Paymob using credit card or Vodafone Cash.',
    },
  ],
}
