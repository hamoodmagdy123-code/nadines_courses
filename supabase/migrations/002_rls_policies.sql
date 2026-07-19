-- ============================================
-- Nadine Courses — Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
alter table courses enable row level security;
alter table orders enable row level security;
alter table site_content enable row level security;
alter table profiles enable row level security;
alter table exchange_rates_cache enable row level security;

-- ============================================
-- COURSES: public read, admin write
-- ============================================
create policy "courses_select_public"
  on courses for select
  using (true);

create policy "courses_insert_admin"
  on courses for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "courses_update_admin"
  on courses for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "courses_delete_admin"
  on courses for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- ORDERS: no direct client access (all via Edge Functions with service role)
-- ============================================
create policy "orders_no_select"
  on orders for select
  using (false);

create policy "orders_no_insert"
  on orders for insert
  with check (false);

create policy "orders_no_update"
  on orders for update
  using (false);

-- ============================================
-- SITE_CONTENT: public read, admin write
-- ============================================
create policy "site_content_select_public"
  on site_content for select
  using (true);

create policy "site_content_insert_admin"
  on site_content for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "site_content_update_admin"
  on site_content for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "site_content_delete_admin"
  on site_content for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================
-- PROFILES: users see own profile only
-- ============================================
create policy "profiles_select_own"
  on profiles for select
  using (id = auth.uid());

create policy "profiles_insert_own"
  on profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on profiles for update
  using (id = auth.uid());

-- ============================================
-- EXCHANGE_RATES_CACHE: public read, no direct write (via Edge Function only)
-- ============================================
create policy "exchange_rates_select_public"
  on exchange_rates_cache for select
  using (true);

create policy "exchange_rates_no_insert"
  on exchange_rates_cache for insert
  with check (false);

create policy "exchange_rates_no_update"
  on exchange_rates_cache for update
  using (false);
