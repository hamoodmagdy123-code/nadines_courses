-- ============================================
-- Nadine Courses — Seed Data
-- ============================================

-- Initial courses
insert into courses (slug, title, title_en, description, description_en, curriculum, curriculum_en, image_url, egypt_price, international_price_usd, is_active, sort_order, icon)
values
(
  'digital-product',
  'ديجيتال برودكت',
  'Digital Product',
  'اتعلم إزاي تبني منتجات ديجيتال تبيعها أونلاين وتحقق دخل سلبي. من الصفر لحد أول 1000 دولار.',
  'Learn how to build digital products to sell online and generate passive income. From zero to your first $1000.',
  '["أساسيات المنتجات الرقمية","اختيار النيشان الصح","بناء المنتج من الصفر","تصميم وتجربة المستخدم","التسويق والمبيعات","الأتمتة والدخل السلبي"]'::jsonb,
  '["Digital product basics","Choosing the right niche","Building from scratch","Design & UX","Marketing & sales","Automation & passive income"]'::jsonb,
  '/digital_products.png',
  400,
  50,
  true,
  1,
  'Package'
),
(
  'drop-service',
  'دروب سيرفس',
  'Drop Service',
  'اتعلم إزاي تقدم خدمات أونلاين من غير ما تملك خبرة مباشرة. بيزنس بمرن مية مية يبدأ بـ 0 جنيه.',
  'Learn how to offer online services without direct expertise. A smooth business model starting from $0.',
  '["مفهوم الدروب سيرفس","اختيار الخدمة المناسبة","العثور على العملاء","بناء فريق التنفيذ","إدارة المشاريع","توسيع البيزنس"]'::jsonb,
  '["Drop service concept","Choosing the right service","Finding clients","Building an execution team","Project management","Scaling the business"]'::jsonb,
  '/drop_service.png',
  1500,
  100,
  true,
  2,
  'Layers'
);

-- Initial FAQ content
insert into site_content (section_key, content)
values
(
  'faq',
  '[
    {"question":"هل الكورس مناسب للمبتدئين؟","answer":"أيوه، الكورس بيبدأ من الصفر ومحتاج أي خبرة سابقة.","question_en":"Is the course suitable for beginners?","answer_en":"Yes, the course starts from scratch. No prior experience needed."},
    {"question":"إيه طريقة التسليم؟","answer":"بعد الدفع، هنتواصل معاك على تليجرام وتاخد كل المحتوى.","question_en":"How is the course delivered?","answer_en":"After payment, we will contact you on Telegram and you will get all the content."},
    {"question":"هل في ضمان استرجاع؟","answer":"لو الكورس مش مناسب ليك خلال أول 7 أيام، هنرجعلك فلوسك.","question_en":"Is there a refund guarantee?","answer_en":"If the course is not right for you within the first 7 days, we will refund your money."},
    {"question":"بتدفع إزاي؟","answer":"الدفع آمن وبيتم عبر Paymob ببطاقة الائتمان أو فودافون كاش.","question_en":"How do I pay?","answer_en":"Payment is secure via Paymob using credit card or Vodafone Cash."}
  ]'::jsonb
);

-- Initial exchange rates (fallback)
insert into exchange_rates_cache (id, base_currency, rates)
values (1, 'USD', '{"EGP":50.0,"SAR":3.75,"AED":3.67,"KWD":0.31,"BHD":0.38,"QAR":3.64,"OMR":0.39,"JOD":0.71,"LBP":89500,"IQD":1310,"MAD":10.0,"TND":3.15,"DZD":135.0,"LYD":4.85,"SDG":500.0,"SOS":570,"DJF":178,"KMF":420,"XOF":605,"XAF":605,"NGN":1550,"GHS":15.5,"KES":153,"UGX":3750,"TZS":2500,"ETB":56,"ZAR":18.5,"MWK":1050,"ZMW":25,"BWP":13.5,"SZL":18.5,"LSL":18.5,"NAD":18.5,"AOA":830,"MZN":63.5,"MGF":4450,"RWF":1300,"CDF":2550,"XPF":110,"PGK":4.0,"TOP":2.4,"WST":2.7,"FJD":2.25,"VUV":119,"SBD":8.4,"KHR":4050,"MMK":2100,"LAK":21000,"TJS":11.0,"KGS":89,"AFN":73,"IRR":42000,"PHP":56,"THB":35,"MYR":4.7,"IDR":15700,"SGD":1.35,"BND":1.35,"AUD":1.55,"NZD":1.68,"CAD":1.37,"GBP":0.79,"EUR":0.92,"CHF":0.88,"SEK":10.5,"NOK":10.8,"DKK":6.88,"ISK":138,"CZK":23.5,"PLN":4.05,"HUF":360,"RON":4.57,"BGN":1.80,"HRK":6.93,"RSD":108,"TRY":32.5,"ILN":3.65,"CNY":7.25,"JPY":155,"KRW":1330,"TWD":32,"HKD":7.82,"INR":83.5,"BDT":110,"PKR":285,"LKR":310,"NPR":133.5,"BTN":83.5,"MVRF":15.4,"MVR":15.4}'::jsonb);
