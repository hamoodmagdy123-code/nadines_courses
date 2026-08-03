-- Align all database-managed storefront copy with the published delivery and refund policies.
update site_content
set content = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(content, '{1,answer}', '"بعد التحقق من الدفع، سنتواصل معك خلال ساعة واحدة باستخدام بيانات التواصل المسجلة في الطلب لترتيب الوصول إلى محتوى الكورس."'::jsonb),
      '{1,answer_en}', '"After payment is verified, we will contact you within one hour using the contact details submitted with your order to arrange course access."'::jsonb
    ),
    '{2}', '{"question":"هل يمكن استرداد أو إلغاء الطلب؟","answer":"لا يمكن استرداد المبلغ أو إلغاء الطلب بعد إتمام الدفع لأن الكورسات منتجات رقمية ويتم تجهيز الوصول إليها فور تأكيد الدفع.","question_en":"Can I request a refund or cancel my order?","answer_en":"Payments are non-refundable and orders cannot be cancelled after payment because the courses are digital products and access is prepared as soon as payment is confirmed."}'::jsonb
  ),
  '{1,question_en}', '"How is the course delivered?"'::jsonb
)
where section_key = 'faq' and jsonb_typeof(content) = 'array';

update site_content
set content = jsonb_set(
  jsonb_set(content, '{form_benefits_1}', '{"ar":"تواصل خلال ساعة بعد التحقق من الدفع","en":"Contact within one hour after payment verification"}'::jsonb),
  '{form_benefits_3}', '{"ar":"منتج رقمي — لا استرداد بعد الدفع","en":"Digital product — no refunds after payment"}'::jsonb
)
where section_key = 'course_page';

update site_content
set content = jsonb_set(
  content,
  '{next_text}',
  '{"ar":"سنتواصل معك خلال ساعة واحدة بعد التحقق من الدفع لترتيب وصولك إلى محتوى الكورس. تأكد من صحة بيانات التواصل التي قدمتها.","en":"We will contact you within one hour after payment verification to arrange access to the course. Please make sure the contact details you provided are correct."}'::jsonb
)
where section_key = 'success';
