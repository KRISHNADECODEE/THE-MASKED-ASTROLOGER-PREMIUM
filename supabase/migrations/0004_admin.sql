-- ============================================================================
-- The Masked Astrologer — admin role + editable site settings
-- Run after 0003. Idempotent.
-- ============================================================================

-- Admin flag on profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Promote yourself to admin (replace the email):
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');

-- ---------------------------------------------------------------------------
-- site_settings — key/value store for content the admin can edit live
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Anyone may READ settings (the public site renders them).
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);
-- Writes are performed by the service-role admin client only (bypasses RLS),
-- so no public insert/update policy is defined.

-- Seed defaults (only if missing)
insert into public.site_settings (key, value) values
  ('announcement', '{"enabled": false, "text": "", "href": ""}'::jsonb),
  ('support',      '{"email": "hello@maskedastrologer.com", "phone": "+91 00000 00000"}'::jsonb),
  ('hero',         '{"headline": "Born Under the Stars.", "subheadline": "Decoded by the Cosmos."}'::jsonb)
on conflict (key) do nothing;
