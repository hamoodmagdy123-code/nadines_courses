-- Add explicit orders DELETE deny
create policy "orders_no_delete"
  on orders for delete
  using (false);

-- Seed hero section
insert into site_content (section_key, content) values
('hero', '{
  "badge": {"ar": "ابدأ دلوقتي من غير أي تأجيل", "en": "Start now without any delay"},
  "title": {"ar": "اتعلم تبني بيزنس أونلاين", "en": "Learn to Build an Online Business"},
  "subtitle": {"ar": "كورسات عملية من الصفر للدخل. محتوى مباشر ونتائج حقيقية.", "en": "Practical courses from zero to income. Real content, real results."},
  "cta": {"ar": "شوف الكورسات", "en": "View Courses"},
  "image_url": "/nadines.png",
  "floating_notes": [
    {"ar": "خطوة بخطوة", "en": "Step by step", "pos": "right-0 top-4 sm:right-4 sm:top-8", "rotate": "-rotate-6", "delay": "0s"},
    {"ar": "نتائج حقيقية", "en": "Real results", "pos": "left-0 top-1/3 sm:-left-6 sm:top-[45%]", "rotate": "rotate-3", "delay": "1s"}
  ],
  "instructor_name": {"ar": "نادين محمد", "en": "Nadine Mohamed"},
  "instructor_label": {"ar": "مدربة الكورس", "en": "Course Instructor"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed stats section
insert into site_content (section_key, content) values
('stats', '[
  {"value": "+2K", "label": {"ar": "متابع", "en": "Followers"}},
  {"value": "+150", "label": {"ar": "طالب", "en": "Students"}},
  {"value": "98%", "label": {"ar": "نسبة الرضا", "en": "Satisfaction"}}
]'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed courses header
insert into site_content (section_key, content) values
('courses_header', '{
  "badge": {"ar": "كورساتنا", "en": "Our Courses"},
  "title": {"ar": "اختار نقطة البداية", "en": "Choose Your Starting Point"},
  "subtitle": {"ar": "كورسين عمليين من غير حشو، تقدر تبدأ بيهم النهارده", "en": "Two practical courses, no fluff. Start today."},
  "lessons_label": {"ar": "دروس عملية", "en": "practical lessons"},
  "details_label": {"ar": "التفاصيل", "en": "Details"},
  "pay_usd_label": {"ar": "يُدفع بالدولار", "en": "Payable in USD"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed trust section
insert into site_content (section_key, content) values
('trust', '[
  {"label": {"ar": "دفع آمن عبر", "en": "Secure Payment via"}, "sub": {"ar": "Paymob", "en": "Paymob"}},
  {"label": {"ar": "دعم مباشر", "en": "Direct Support"}, "sub": {"ar": "على تليجرام", "en": "On Telegram"}},
  {"label": {"ar": "محتوى عملي", "en": "Practical Content"}, "sub": {"ar": "مش نظري بس", "en": "Not just theory"}},
  {"label": {"ar": "خبرة حقيقية", "en": "Real Experience"}, "sub": {"ar": "مش نظرية", "en": "Not theoretical"}}
]'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed testimonials
insert into site_content (section_key, content) values
('testimonials', '{
  "title": {"ar": "عملاء قالوا إيه", "en": "What Clients Say"},
  "subtitle": {"ar": "آراء حقيقية من ناس اتعلمت معانا", "en": "Real opinions from people who learned with us"},
  "items": []
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed CTA
insert into site_content (section_key, content) values
('cta', '{
  "title": {"ar": "جاهز تبدأ؟", "en": "Ready to Start?"},
  "subtitle": {"ar": "اختار الكورس المناسب وابدأ النهارده", "en": "Choose the right course and start today"},
  "btn": {"ar": "شوف الكورسات", "en": "View Courses"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed footer
insert into site_content (section_key, content) values
('footer', '{
  "home": {"ar": "الرئيسية", "en": "Home"},
  "courses": {"ar": "الكورسات", "en": "Courses"},
  "faq": {"ar": "الأسئلة الشائعة", "en": "FAQ"},
  "rights": {"ar": "جميع الحقوق محفوظة.", "en": "All rights reserved."}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed checkout success
insert into site_content (section_key, content) values
('success', '{
  "title": {"ar": "الدفع نجح!", "en": "Payment Successful!"},
  "message": {"ar": "شكراً ليك! تم تأكيد الدفع بنجاح.", "en": "Thank you! Your payment has been confirmed."},
  "next": {"ar": "الخطوة الجاية", "en": "Next Step"},
  "next_text": {"ar": "هنتواصل معاك على تليجرام خلال ساعات قليلة عشان نضيفك على قناة الكورس. تأكد إنك متابع تليجرام على الرقم اللي ادتيه.", "en": "We will contact you on Telegram within a few hours to add you to the course channel. Make sure you are following Telegram on the number you provided."},
  "contact": {"ar": "لو عندك أي سؤال، تواصل معانا", "en": "If you have any questions, contact us"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed checkout failed
insert into site_content (section_key, content) values
('fail', '{
  "title": {"ar": "الدفع لم ينجح", "en": "Payment Failed"},
  "message": {"ar": "يبدو إن في مشكلة حصلت أثناء الدفع. ممكن تجرب تاني.", "en": "It seems there was a problem with the payment. Please try again."},
  "retry": {"ar": "حاول تاني", "en": "Try Again"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;

-- Seed course details form labels
insert into site_content (section_key, content) values
('course_page', '{
  "curriculum_title": {"ar": "محتوى الكورس", "en": "Course Content"},
  "not_found": {"ar": "الكورس مش موجود", "en": "Course not found"},
  "go_home": {"ar": "رجوع للرئيسية", "en": "Go Home"},
  "back": {"ar": "الرجوع للرئيسية", "en": "Back to Home"},
  "form_name": {"ar": "الاسم الكامل", "en": "Full Name"},
  "form_name_placeholder": {"ar": "اسمك الكامل", "en": "Your full name"},
  "form_email": {"ar": "البريد الإلكتروني", "en": "Email Address"},
  "form_phone": {"ar": "رقم التليفون", "en": "Phone Number"},
  "form_pay": {"ar": "ادفع الآن", "en": "Pay Now"},
  "form_processing": {"ar": "جاري المعالجة...", "en": "Processing..."},
  "form_secure": {"ar": "الدفع آمن ومشفر عبر Paymob", "en": "Payment is secure & encrypted via Paymob"},
  "form_benefits_1": {"ar": "وصول فوري بعد الدفع", "en": "Instant access after payment"},
  "form_benefits_2": {"ar": "دعم مباشر على تليجرام", "en": "Direct support on Telegram"},
  "form_benefits_3": {"ar": "ضمان استرجاع خلال 7 أيام", "en": "7-day money-back guarantee"}
}'::jsonb)
on conflict (section_key) do update set content = excluded.content;
