-- ============================================================================
-- The Masked Astrologer — contact / enquiry messages
-- Run after 0004. Idempotent.
-- ============================================================================

do $$ begin
  create type contact_status as enum ('new', 'read', 'replied', 'archived');
exception when duplicate_object then null; end $$;

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  status      contact_status not null default 'new',
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages(created_at desc);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) may send a message.
drop policy if exists "contact_insert_any" on public.contact_messages;
create policy "contact_insert_any" on public.contact_messages
  for insert with check (true);

-- No public SELECT — the inbox is read only via the service-role admin client.
