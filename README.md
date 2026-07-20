# TalenCo — Global Career Starter Program

Registration, checkout, and installment-tracking web app for the TalenCo Global Career Starter Program (Japan → Indonesia).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres + service-role client) |
| Payments | Xendit Invoice API v2 |
| Email | Resend |
| Bot protection | Cloudflare Turnstile (explicit render) |
| Rate limiting | Upstash Redis |
| i18n | react-i18next (ja/en, landing page only) |
| Deployment | Vercel (with Cron) |

## Project Structure

```
app/
  page.tsx                      Landing page (bilingual, client component)
  layout.tsx                    Root layout — loads Turnstile script
  not-found.tsx                 404 page
  register/page.tsx             4-step registration form + Turnstile
  checkout/page.tsx             Package & installment plan selector
  payment/
    success/page.tsx            Post-payment confirmation
    cancel/page.tsx             Cancelled/expired payment
  my/page.tsx                   Token-based registration status page
  privacy/page.tsx              Privacy policy
  terms/page.tsx                Terms of service
  api/
    register/route.ts           POST — validate, Turnstile verify, insert registration
    checkout/route.ts           POST — verify ownership, create Xendit invoice
    xendit-webhook/route.ts     POST — mark paid, chain next installment
    status/route.ts             GET  — fetch registration + schedule by token
    cron/installment-retry/     GET  — daily recovery for orphaned installments

components/
  Navbar.tsx

lib/
  env.ts          Server-only env validation (throws on missing vars)
  supabase.ts     Supabase service-role client (server-only)
  resend.ts       Resend client
  ratelimit.ts    Upstash rate limiters (IP, email, status)
  logger.ts       Structured JSON logger (server-only)
  request.ts      getClientIp helper
  html.ts         htmlEscape helper

i18n/
  config.ts       Locale config (ja default, en fallback)
  client.ts       react-i18next init

locales/
  ja/landing.json
  en/landing.json

middleware.ts     Per-request CSP with nonce (Next.js 16 reads from request header)
```

## Environment Variables

Create `.env.local` for local development. All variables are required unless marked optional.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Xendit
XENDIT_SECRET_KEY=xnd_production_...
XENDIT_WEBHOOK_TOKEN=your_webhook_secret   # any random string, set same value in Xendit dashboard

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com   # must be a verified domain in Resend

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...   # omit in dev to use bypass mode
TURNSTILE_SECRET_KEY=0x4AAAAAAA...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # production: https://yourdomain.com

# Vercel Cron (add in Vercel dashboard, not .env.local)
# CRON_SECRET=random_secret_string
```

> **Dev shortcut:** If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is not set, the register API accepts the token `__dev_bypass__` automatically. The register page sends this token when no site key is configured.

## Database Setup

Run these migrations in the Supabase SQL editor (**Dashboard → SQL Editor**).

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Registrations
create table registrations (
  id              uuid primary key default gen_random_uuid(),
  access_token    uuid not null default gen_random_uuid(),
  email           text not null,
  full_name       text not null,
  phone           text not null,
  line_id         text not null,
  current_status  text not null,
  university      text not null,
  major           text not null,
  job_title       text,
  english_level   text not null,
  studied_abroad  boolean not null default false,
  overseas_work   boolean not null default false,
  reasons         text[] not null default '{}',
  career_goal     text not null,
  hear_about      text not null,
  next_step       text not null,
  status          text not null default 'pending',  -- pending | paid | failed
  created_at      timestamptz not null default now()
);

create unique index registrations_email_idx on registrations (lower(email))
  where status != 'failed';

create unique index registrations_access_token_idx on registrations (access_token);

-- Orders
create table orders (
  id                  uuid primary key default gen_random_uuid(),
  registration_id     uuid not null references registrations(id) on delete cascade,
  package             text not null,          -- online | offline
  installments        int  not null,          -- 1 | 3 | 6 | 12
  amount_idr          int  not null,
  status              text not null default 'pending',  -- pending | paid | expired
  xendit_invoice_id   text,
  xendit_invoice_url  text,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index orders_registration_idx on orders (registration_id);

-- Installment schedules
create table installment_schedules (
  id                  uuid primary key default gen_random_uuid(),
  registration_id     uuid not null references registrations(id) on delete cascade,
  order_id            uuid references orders(id) on delete set null,
  installment_no      int  not null,
  total_count         int  not null,
  amount_idr          int  not null,
  due_date            date not null,
  status              text not null default 'pending',  -- pending | paid
  xendit_invoice_id   text,
  xendit_invoice_url  text,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index schedules_registration_idx on installment_schedules (registration_id);
create index schedules_order_idx        on installment_schedules (order_id);
```

> **Row Level Security:** The service-role key bypasses RLS. You can enable RLS on all tables — it won't affect the app since it only uses the service-role client server-side.

## Third-Party Configuration

### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL migrations above
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **service_role** key (Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`

### Xendit
1. Create an account at [xendit.co](https://xendit.co)
2. Dashboard → Settings → API Keys → copy **Secret Key** → `XENDIT_SECRET_KEY`
3. Dashboard → Settings → Callbacks → Invoice callback URL:
   ```
   https://yourdomain.com/api/xendit-webhook
   ```
4. Set a **Callback Token** (any random string) → `XENDIT_WEBHOOK_TOKEN` — set the same value in the dashboard

### Resend
1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain (Domains → Add Domain)
3. API Keys → Create API Key → `RESEND_API_KEY`
4. Use a verified domain address for `RESEND_FROM_EMAIL`

### Cloudflare Turnstile
1. Cloudflare Dashboard → Turnstile → Add Site
2. Add your domain(s) to **Allowed Origins** (include `localhost` for dev)
3. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
4. Copy **Secret Key** → `TURNSTILE_SECRET_KEY`

> **Test keys** (always pass, no Cloudflare connection needed):
> - Site key: `1x00000000000000000000AA`
> - Secret key: `1x0000000000000000000000000000000AA`

### Upstash Redis
1. Create a database at [upstash.com](https://upstash.com) → Redis → Create Database
2. Copy **REST URL** → `UPSTASH_REDIS_REST_URL`
3. Copy **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

### Vercel Cron (installment retry)
The daily cron at `0 0 * * *` (midnight UTC) retries any installment invoices that weren't created by the webhook.

1. Deploy to Vercel — `vercel.json` registers the cron automatically
2. Vercel Dashboard → Project Settings → Environment Variables → add `CRON_SECRET` (any random string)
3. Vercel injects `Authorization: Bearer <CRON_SECRET>` on cron requests automatically

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in values
npm run dev
```

To test the Xendit webhook locally, expose your dev server with [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Then add the ngrok domain to:
- `next.config.ts` → `allowedDevOrigins`
- Xendit dashboard callback URL
- Cloudflare Turnstile allowed origins

## Payment Flow

```
User fills register form
  → POST /api/register
    → creates registrations row (access_token generated automatically)
    → sends confirmation email with /my?token=xxx link
  → if nextStep === "payment": redirect to /checkout?rid=xxx&token=xxx

User selects package + installment plan
  → POST /api/checkout  (sends registrationId + accessToken for ownership check)
    → verifies registration ownership (registrationId + accessToken must match)
    → creates Xendit invoice for installment 1
    → creates all installment_schedules rows (installments 2+ have order_id = null)
  → redirect to Xendit invoice page

User pays on Xendit
  → Xendit calls POST /api/xendit-webhook
    → marks order + registration as paid
    → marks installment_schedule 1 as paid
    → creates Xendit invoice for installment 2 (if applicable)
    → sends payment confirmation email

Subsequent installments
  → webhook repeats: marks paid, creates next invoice, sends email
  → if webhook fails mid-chain: daily cron finds orphaned schedules (order_id IS NULL)
    and retries invoice creation

User can always check status at /my?token=xxx (no login required)
```

## Rate Limits

| Limiter | Window | Limit | Key |
|---|---|---|---|
| `registerLimiter` | 1 hour | 5 requests | IP |
| `emailRegisterLimiter` | 24 hours | 1 request | email (lowercase) |
| `checkoutLimiter` | 1 hour | 3 requests | IP |
| `statusLimiter` | 1 hour | 30 requests | IP |

## Security

- **CSP**: Per-request nonce via `middleware.ts`. Next.js 16 reads the nonce from the `content-security-policy` request header and stamps its own inline scripts. No `unsafe-inline` for scripts in production.
- **Ownership verification**: Every checkout request requires both `registrationId` and `accessToken`. A wrong token is indistinguishable from "not found" (no enumeration).
- **Webhook auth**: Timing-safe comparison of `x-callback-token` against `XENDIT_WEBHOOK_TOKEN`.
- **Bot protection**: Cloudflare Turnstile on registration form + honeypot field.
- **Secrets**: All server secrets validated at startup via `lib/env.ts` — missing vars throw before any request is served.
- **Referrer-Policy: no-referrer** on `/checkout` and `/my/*` to prevent access tokens leaking via Referer header.
