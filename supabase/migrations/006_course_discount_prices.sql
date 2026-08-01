alter table public.courses
  add column if not exists original_egypt_price numeric,
  add column if not exists original_international_price_usd numeric;

alter table public.courses
  add constraint courses_original_egypt_price_positive
    check (original_egypt_price is null or original_egypt_price > 0),
  add constraint courses_original_international_price_positive
    check (original_international_price_usd is null or original_international_price_usd > 0);

comment on column public.courses.original_egypt_price is
  'Optional pre-discount price in EGP. A discount is shown only when this is greater than egypt_price.';
comment on column public.courses.original_international_price_usd is
  'Optional pre-discount international price in USD. A discount is shown only when this is greater than international_price_usd.';
