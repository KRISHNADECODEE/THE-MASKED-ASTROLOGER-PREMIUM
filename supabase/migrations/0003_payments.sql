-- ============================================================================
-- The Masked Astrologer — Razorpay payment references
-- Run after 0002. Idempotent.
-- ============================================================================

alter table public.orders   add column if not exists payment_id text;
alter table public.bookings add column if not exists payment_id text;
alter table public.donations add column if not exists payment_id text;
