-- =============================================================================
-- JEWELLERY STORE — SUPABASE SCHEMA
-- Run this once in the Supabase SQL Editor on a fresh project.
-- Idempotent-ish: safe to re-run (uses IF NOT EXISTS / OR REPLACE where it can),
-- but DROP the tables first if you're iterating on structure.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- =============================================================================
-- CATALOGUE
-- =============================================================================

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  metal_type text not null check (metal_type in ('gold','silver')),
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  banner_image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id) on delete set null,
  subcategory_id uuid references subcategories(id) on delete set null,
  collection_id uuid references collections(id) on delete set null,
  metal_type text not null check (metal_type in ('gold','silver')),
  purity text not null,                              -- '24K' | '22K' | '18K' | '92.5' etc
  gross_weight numeric(10,3) not null check (gross_weight >= 0),
  net_weight numeric(10,3) not null check (net_weight >= 0),
  stone_weight numeric(10,3) not null default 0,
  stone_charge numeric(12,2) not null default 0,
  making_charge_type text not null default 'percentage' check (making_charge_type in ('percentage','fixed')),
  making_charge_value numeric(10,2) not null default 0,
  gst_percentage numeric(5,2) not null default 3.00,
  gender text check (gender in ('men','women','kids','unisex')),
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_bridal boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_subcategory on products(subcategory_id);
create index if not exists idx_products_collection on products(collection_id);
create index if not exists idx_products_metal on products(metal_type);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured) where is_featured = true;
create index if not exists idx_products_new on products(is_new_arrival) where is_new_arrival = true;
create index if not exists idx_products_bridal on products(is_bridal) where is_bridal = true;

create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_images_product on product_images(product_id);

-- =============================================================================
-- OFFERS
-- =============================================================================

create table if not exists offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  banner_image_url text,
  discount_text text,
  terms_conditions text,
  valid_from date not null,
  valid_until date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_offers_active_dates on offers(is_active, valid_from, valid_until);

-- =============================================================================
-- RATES
-- gold_rates / silver_rates hold the CURRENT rate (latest row by effective_at).
-- rate_history holds one row per (metal, day) for the historical chart.
-- =============================================================================

create table if not exists gold_rates (
  id uuid primary key default uuid_generate_v4(),
  rate_24k numeric(10,2) not null,
  rate_22k numeric(10,2) not null,
  rate_20k numeric(10,2) not null,
  rate_18k numeric(10,2) not null,
  unit text not null default '10g',
  source text not null default 'manual',
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_gold_rates_effective on gold_rates(effective_at desc);

create table if not exists silver_rates (
  id uuid primary key default uuid_generate_v4(),
  rate numeric(10,2) not null,
  unit text not null default 'kg',
  source text not null default 'manual',
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_silver_rates_effective on silver_rates(effective_at desc);

create table if not exists rate_history (
  id uuid primary key default uuid_generate_v4(),
  metal_type text not null check (metal_type in ('gold_24k','gold_22k','gold_20k','gold_18k','silver')),
  rate numeric(10,2) not null,
  recorded_date date not null,
  created_at timestamptz not null default now(),
  unique (metal_type, recorded_date)
);
create index if not exists idx_rate_history_lookup on rate_history(metal_type, recorded_date desc);

-- =============================================================================
-- SERVICES
-- =============================================================================

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon_name text,                                     -- lucide-react icon name, e.g. 'Gem'
  display_order int not null default 0,
  is_active boolean not null default true
);

-- =============================================================================
-- CUSTOMERS / ENQUIRIES
-- =============================================================================

create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone text,
  whatsapp text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  name text not null,
  phone text not null,
  whatsapp text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','in_progress','converted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_enquiries_status on enquiries(status);
create index if not exists idx_enquiries_product on enquiries(product_id);
create index if not exists idx_enquiries_created on enquiries(created_at desc);

create table if not exists custom_jewellery_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  whatsapp text,
  jewellery_type text,
  requirement text,
  budget_range text,
  reference_image_url text,
  status text not null default 'new' check (status in ('new','contacted','in_progress','converted','closed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_custom_requests_status on custom_jewellery_requests(status);

-- =============================================================================
-- ADMIN / SETTINGS
-- admin_users.id MUST equal the corresponding auth.users.id (Supabase Auth).
-- Creating a row here is what makes an authenticated user an admin — signing
-- up alone does not grant access. See README for how to create the first admin.
-- =============================================================================

create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin','staff')),
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table categories enable row level security;
alter table subcategories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table offers enable row level security;
alter table gold_rates enable row level security;
alter table silver_rates enable row level security;
alter table rate_history enable row level security;
alter table services enable row level security;
alter table customers enable row level security;
alter table enquiries enable row level security;
alter table custom_jewellery_requests enable row level security;
alter table admin_users enable row level security;
alter table settings enable row level security;

-- is_admin(): SECURITY DEFINER so it can read admin_users regardless of the
-- caller's own row-level access, without recursively re-triggering RLS on
-- admin_users itself (which would deadlock the policy check).
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- ---- Public read access (storefront) ----
drop policy if exists "public read active categories" on categories;
create policy "public read active categories" on categories for select using (is_active = true);

drop policy if exists "public read active subcategories" on subcategories;
create policy "public read active subcategories" on subcategories for select using (is_active = true);

drop policy if exists "public read active collections" on collections;
create policy "public read active collections" on collections for select using (is_active = true);

drop policy if exists "public read active products" on products;
create policy "public read active products" on products for select using (is_active = true);

drop policy if exists "public read product images" on product_images;
create policy "public read product images" on product_images for select using (true);

drop policy if exists "public read active offers" on offers;
create policy "public read active offers" on offers for select using (is_active = true);

drop policy if exists "public read gold rates" on gold_rates;
create policy "public read gold rates" on gold_rates for select using (true);

drop policy if exists "public read silver rates" on silver_rates;
create policy "public read silver rates" on silver_rates for select using (true);

drop policy if exists "public read rate history" on rate_history;
create policy "public read rate history" on rate_history for select using (true);

drop policy if exists "public read active services" on services;
create policy "public read active services" on services for select using (is_active = true);

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);

-- ---- Public insert (enquiry / custom-request forms — no login required) ----
drop policy if exists "public submit enquiries" on enquiries;
create policy "public submit enquiries" on enquiries for insert with check (true);

drop policy if exists "public submit custom requests" on custom_jewellery_requests;
create policy "public submit custom requests" on custom_jewellery_requests for insert with check (true);

drop policy if exists "public create customer record" on customers;
create policy "public create customer record" on customers for insert with check (true);

-- ---- Admin full access ----
drop policy if exists "admin manage categories" on categories;
create policy "admin manage categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage subcategories" on subcategories;
create policy "admin manage subcategories" on subcategories for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage collections" on collections;
create policy "admin manage collections" on collections for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage products" on products;
create policy "admin manage products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage product images" on product_images;
create policy "admin manage product images" on product_images for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage offers" on offers;
create policy "admin manage offers" on offers for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage gold rates" on gold_rates;
create policy "admin manage gold rates" on gold_rates for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage silver rates" on silver_rates;
create policy "admin manage silver rates" on silver_rates for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage rate history" on rate_history;
create policy "admin manage rate history" on rate_history for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage services" on services;
create policy "admin manage services" on services for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read enquiries" on enquiries;
create policy "admin read enquiries" on enquiries for select using (is_admin());
drop policy if exists "admin update enquiries" on enquiries;
create policy "admin update enquiries" on enquiries for update using (is_admin()) with check (is_admin());

drop policy if exists "admin read custom requests" on custom_jewellery_requests;
create policy "admin read custom requests" on custom_jewellery_requests for select using (is_admin());
drop policy if exists "admin update custom requests" on custom_jewellery_requests;
create policy "admin update custom requests" on custom_jewellery_requests for update using (is_admin()) with check (is_admin());

drop policy if exists "admin read customers" on customers;
create policy "admin read customers" on customers for select using (is_admin());

drop policy if exists "admin manage admin_users" on admin_users;
create policy "admin manage admin_users" on admin_users for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage settings" on settings;
create policy "admin manage settings" on settings for all using (is_admin()) with check (is_admin());

-- =============================================================================
-- SEED DATA — enough to see the site working end to end. Replace freely.
-- =============================================================================

insert into categories (name, slug, metal_type, display_order) values
  ('Gold Rings', 'gold-rings', 'gold', 1),
  ('Gold Chains', 'gold-chains', 'gold', 2),
  ('Gold Earrings', 'gold-earrings', 'gold', 3),
  ('Gold Bangles', 'gold-bangles', 'gold', 4),
  ('Gold Necklaces', 'gold-necklaces', 'gold', 5),
  ('Silver Anklets', 'silver-anklets', 'silver', 6),
  ('Silver Articles', 'silver-articles', 'silver', 7),
  ('Pooja Items', 'pooja-items', 'silver', 8)
on conflict (slug) do nothing;

insert into services (name, slug, description, icon_name, display_order) values
  ('Custom Jewellery Design', 'custom-design', 'Bring your own design or idea and our artisans will craft it.', 'Sparkles', 1),
  ('Jewellery Repair', 'repair', 'Restoring clasps, resizing, and stone tightening.', 'Wrench', 2),
  ('Gold Exchange', 'gold-exchange', 'Exchange your old gold for new designs at fair valuation.', 'Repeat', 3),
  ('Jewellery Cleaning & Polishing', 'cleaning-polishing', 'Complimentary cleaning for lifetime shine.', 'Sparkle', 4),
  ('Stone Replacement', 'stone-replacement', 'Certified stone replacement and resetting.', 'Gem', 5),
  ('Old Gold Purchase', 'old-gold-purchase', 'Transparent, hallmark-verified buyback rates.', 'Coins', 6)
on conflict (slug) do nothing;

insert into gold_rates (rate_24k, rate_22k, rate_20k, rate_18k, source) values
  (105500, 96700, 88000, 79000, 'manual')
on conflict do nothing;

insert into silver_rates (rate, source) values
  (125000, 'manual')
on conflict do nothing;
