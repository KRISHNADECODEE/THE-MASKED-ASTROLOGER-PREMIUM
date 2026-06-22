-- ============================================================================
-- The Masked Astrologer — initial schema
-- Run in the Supabase SQL Editor (Dashboard → SQL → New query) or via the CLI:
--   supabase db push
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type order_status as enum
    ('pending','paid','processing','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum
    ('pending','scheduled','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type donation_status as enum
    ('pledged','purchased','delivered');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_kundlis
-- ---------------------------------------------------------------------------
create table if not exists public.saved_kundlis (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  dob         date not null,
  tob         text,
  pob         text,
  chart_data  jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists saved_kundlis_user_id_idx on public.saved_kundlis(user_id);

-- ---------------------------------------------------------------------------
-- orders + order_items
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  order_number    text not null unique,
  status          order_status not null default 'pending',
  total           numeric(10,2) not null,
  shipping        jsonb,
  payment_method  text,
  created_at      timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders(user_id);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    text not null,
  product_name  text not null,
  slug          text,
  price         numeric(10,2) not null,
  quantity      integer not null default 1
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ---------------------------------------------------------------------------
-- bookings (consultations)
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  booking_number  text not null unique,
  service_id      text not null,
  service_title   text,
  name            text not null,
  email           text not null,
  phone           text,
  slot_date       date not null,
  slot_time       text not null,
  birth_details   jsonb,
  status          booking_status not null default 'pending',
  zoom_link       text,
  amount          numeric(10,2),
  created_at      timestamptz not null default now()
);
create index if not exists bookings_user_id_idx on public.bookings(user_id);

-- ---------------------------------------------------------------------------
-- donations (item-based street-dog donation transparency log)
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  donation_number  text not null unique,
  donor_name       text,
  items            jsonb,
  total            numeric(10,2),
  status           donation_status not null default 'pledged',
  proof_photo_url  text,
  created_at       timestamptz not null default now()
);
create index if not exists donations_user_id_idx on public.donations(user_id);

-- ---------------------------------------------------------------------------
-- New-user trigger: create a profile row whenever an auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep updated_at fresh on profiles
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.saved_kundlis enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.bookings      enable row level security;
alter table public.donations     enable row level security;

-- profiles: a user can see/update only their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- saved_kundlis: full CRUD scoped to the owner
drop policy if exists "kundlis_owner_all" on public.saved_kundlis;
create policy "kundlis_owner_all" on public.saved_kundlis
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: owner can read & create their own
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);
drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

-- order_items: visible/insertable when the parent order belongs to the user
drop policy if exists "order_items_select_via_order" on public.order_items;
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (select 1 from public.orders o
            where o.id = order_id and o.user_id = auth.uid())
  );
drop policy if exists "order_items_insert_via_order" on public.order_items;
create policy "order_items_insert_via_order" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o
            where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null))
  );

-- bookings: owner can read & create their own
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select using (auth.uid() = user_id);
drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings
  for insert with check (auth.uid() = user_id or user_id is null);

-- donations: the transparency log is PUBLIC to read; inserts allowed for anyone
-- (anonymous pledges welcome). Status changes / proof photos are managed by the
-- service-role admin client, which bypasses RLS.
drop policy if exists "donations_public_read" on public.donations;
create policy "donations_public_read" on public.donations
  for select using (true);
drop policy if exists "donations_insert_any" on public.donations;
create policy "donations_insert_any" on public.donations
  for insert with check (auth.uid() = user_id or user_id is null);

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('proof-photos', 'proof-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('kundli-pdfs', 'kundli-pdfs', false)
on conflict (id) do nothing;

-- proof-photos: world-readable; only the service role uploads (admin).
drop policy if exists "proof_photos_public_read" on storage.objects;
create policy "proof_photos_public_read" on storage.objects
  for select using (bucket_id = 'proof-photos');

-- kundli-pdfs: private, each user can read/write only their own folder
-- (objects are stored under "<user_id>/<file>.pdf").
drop policy if exists "kundli_pdfs_owner_read" on storage.objects;
create policy "kundli_pdfs_owner_read" on storage.objects
  for select using (
    bucket_id = 'kundli-pdfs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
drop policy if exists "kundli_pdfs_owner_write" on storage.objects;
create policy "kundli_pdfs_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'kundli-pdfs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
