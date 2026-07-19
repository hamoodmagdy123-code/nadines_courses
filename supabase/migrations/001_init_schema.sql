-- ============================================
-- Nadine Courses — Database Schema
-- ============================================

-- courses table
create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_en text,
  description text,
  description_en text,
  curriculum jsonb default '[]'::jsonb,
  curriculum_en jsonb default '[]'::jsonb,
  image_url text,
  egypt_price numeric not null,
  egypt_currency text default 'EGP',
  international_price_usd numeric not null,
  is_active boolean default true,
  sort_order int default 0,
  icon text default 'Package',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  country_code text,
  currency text not null,
  amount numeric not null,
  paymob_order_id text,
  paymob_transaction_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  telegram_added boolean default false,
  telegram_added_at timestamptz,
  telegram_added_by uuid references auth.users(id),
  hmac_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_orders_status on orders(status);
create index idx_orders_email on orders(customer_email);

-- site_content table
create table site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- profiles table (admin)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text default 'admin' check (role in ('admin', 'user')),
  full_name text,
  created_at timestamptz default now()
);

-- exchange_rates_cache table
create table exchange_rates_cache (
  id int primary key default 1,
  base_currency text default 'USD',
  rates jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger courses_updated_at
  before update on courses
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

create trigger site_content_updated_at
  before update on site_content
  for each row execute function update_updated_at();
