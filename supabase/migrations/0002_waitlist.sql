-- ============================================================================
-- The Masked Astrologer — AI Astrologer waitlist capture
-- Run after 0001_init.sql. Idempotent.
-- ============================================================================

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text not null default 'unknown',  -- e.g. home_hero, ai_chat
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (email)
);

alter table public.waitlist enable row level security;

-- Anyone (including anonymous visitors) may join the waitlist.
drop policy if exists "waitlist_insert_any" on public.waitlist;
create policy "waitlist_insert_any" on public.waitlist
  for insert with check (true);

-- The list itself is private (managed via the service-role admin client only);
-- no public SELECT policy is defined, so reads are blocked under RLS.
