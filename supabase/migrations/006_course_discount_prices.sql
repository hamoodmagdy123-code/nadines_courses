alter table public.courses
  add column if not exists original_egypt_price numeric,
  add column if not exists original_international_price_usd numeric;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'courses_original_egypt_price_positive') then
    alter table public.courses add constraint courses_original_egypt_price_positive
      check (original_egypt_price is null or original_egypt_price > 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'courses_original_international_price_positive') then
    alter table public.courses add constraint courses_original_international_price_positive
      check (original_international_price_usd is null or original_international_price_usd > 0);
  end if;
end $$;

comment on column public.courses.original_egypt_price is
  'Optional pre-discount price in EGP. A discount is shown only when this is greater than egypt_price.';
comment on column public.courses.original_international_price_usd is
  'Optional pre-discount international price in USD. A discount is shown only when this is greater than international_price_usd.';
