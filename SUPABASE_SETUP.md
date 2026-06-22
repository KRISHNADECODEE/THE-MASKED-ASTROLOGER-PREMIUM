# Supabase Setup — The Masked Astrologer

This app uses Supabase for **authentication**, a **Postgres database**, and **file storage**.
Everything is wired in code; you only need to plug in your project credentials and run the
migration once.

## 1. Environment variables

Copy `.env.example` → `.env.local` and fill in real values from
**Supabase Dashboard → Project Settings → API**:

| Variable | Where to find it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | ✅ yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / publishable key | ✅ yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret | ❌ **never** — server only |
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` | ✅ used for OAuth redirects |

> A placeholder `.env.local` already exists so the app builds. Replace the placeholders
> with real values before auth/storage will actually work.

## 2. Run the database migration

Open **Supabase Dashboard → SQL Editor → New query** and run the migrations in order:
[`0001_init.sql`](supabase/migrations/0001_init.sql),
[`0002_waitlist.sql`](supabase/migrations/0002_waitlist.sql),
[`0003_payments.sql`](supabase/migrations/0003_payments.sql),
[`0004_admin.sql`](supabase/migrations/0004_admin.sql),
[`0005_contact.sql`](supabase/migrations/0005_contact.sql).
All are idempotent (safe to re-run). `0001` creates:

- **Tables:** `profiles`, `saved_kundlis`, `orders`, `order_items`, `bookings`, `donations`
- **Enums:** `order_status`, `booking_status`, `donation_status`
- **Trigger:** auto-creates a `profiles` row on every new auth signup
- **RLS policies:** users see only their own data; the donation transparency log is public-read
- **Storage buckets:** `proof-photos` (public) and `kundli-pdfs` (private, per-user folders)

`0002` adds the **`waitlist`** table, `0003` adds Razorpay **`payment_id`** columns,
and `0004` adds the admin **`is_admin`** flag + editable **`site_settings`**.

## Admin panel

The admin dashboard lives at **`/admin`** (Dashboard, Orders, Consultations, Donations,
Waitlist, Site Settings). To grant yourself access, do **either**:

- **Env (no DB edit):** add your email to `ADMIN_EMAILS` in `.env.local`
  (`ADMIN_EMAILS=you@example.com,teammate@example.com`), or
- **SQL:** `update public.profiles set is_admin = true where id =
  (select id from auth.users where email = 'you@example.com');`

Then sign in and open `/admin` (a shortcut also appears on your Account page).
Admin reads/writes use the **service-role** key, so `SUPABASE_SERVICE_ROLE_KEY` must be set.
The **Site Settings** page lets you toggle a site-wide announcement banner and edit the
support contact + homepage hero copy — changes go live immediately.

(Or, with the Supabase CLI linked to your project: `supabase db push`.)

## 3. Auth providers

- **Email + password** and **magic link** work out of the box once keys are set.
- **Google OAuth:** Dashboard → Authentication → Providers → Google → enable and add your
  client ID/secret. Add this redirect URL in Google Cloud + Supabase:
  `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
- Set **Site URL** and **Redirect URLs** under Authentication → URL Configuration to include
  `http://localhost:3000/auth/callback` (and your production URL).
- Email confirmation: if **"Confirm email"** is ON, new signups must click the emailed link
  (they land on `/auth/callback`); if OFF, signup logs the user straight in.

## 4. How it's wired in code

| Concern | File(s) |
|---|---|
| Browser client | `lib/supabase/client.ts` |
| Server client (RSC / route handlers) | `lib/supabase/server.ts` |
| Service-role admin client | `lib/supabase/admin.ts` |
| Session refresh + route guard | `proxy.ts` → `lib/supabase/middleware.ts` |
| Storage helpers | `lib/supabase/storage.ts` |
| DB types | `lib/supabase/types.ts` |
| Auth context (client) | `components/auth/AuthProvider.tsx` |
| Login / Signup / OAuth callback | `app/login`, `app/signup`, `app/auth/callback` |
| Account dashboard (reads real data) | `app/account/page.tsx` + `components/account/AccountDashboard.tsx` |

**Writes that now persist to Supabase:**
- Store checkout → `POST /api/store/orders` → `orders` + `order_items`
- Consultation booking → `POST /api/consultation/book` → `bookings`
- Donation pledge → `POST /api/donate` → `donations`
- Kundli generation (logged-in) → saved to `saved_kundlis`

`/account` is protected by `proxy.ts` — unauthenticated visitors are redirected to `/login`.

## 5. Known follow-ups (not in this slice)

- Consultation booking has no calendar date picker yet — it defaults `slot_date` to today.
  Add a date field to `components/consultation/BookingForm.tsx` and pass `slotDate`.
- Real kundli **PDF generation** (Puppeteer/pdf-lib) is still mocked in
  `app/api/kundli/pdf/route.ts`; `lib/supabase/storage.ts#uploadKundliPdf` is ready to store it.
- Admin proof-photo uploads use `lib/supabase/storage.ts#uploadProofPhoto` (service role).
- Course enrollments table is not part of this slice (the "My Courses" tab shows an empty state).
- Payments (Razorpay/Cashfree) are not integrated — orders are marked `paid` on submit.
