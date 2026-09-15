
Marketing site, bilingual (ja/en) registration wizard, and embedded Xendit card-payment flow for
the TalenCo Global Career Starter Program.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres + service-role client) |
| Payments | Xendit **Sessions API** (`mode: COMPONENTS`, embedded card form) |
| Email | Resend |
| Bot protection | Cloudflare Turnstile |
| Rate limiting | Upstash Redis (no-op in local dev — see `lib/ratelimit.ts`) |
| i18n | Custom dictionary lookup (`lib/i18n/`), ja/en, locale in the URL path |
| Deployment | Netlify |

## Project Structure

```
app/
  [lang]/                        Locale-prefixed routes (/ja, /en) — see "i18n" below
    page.tsx                     Landing page
    layout.tsx                   Locale-scoped layout
    course/page.tsx              Program curriculum / scheme details
    register/page.tsx            4-step registration wizard
    my/page.tsx                  Token-based status page — payment entry point + installment panel
    (legal)/privacy/page.tsx     Privacy policy
    (legal)/terms/page.tsx       Terms of service
  api/
    register/route.ts            POST — validates, verifies Turnstile, inserts registration
    payment/
      session/route.ts           POST — creates the full-payment Xendit session
      webhook/route.ts           POST — Xendit calls this; sole authority for marking paid
      status/route.ts            GET  — polled by the client to confirm the webhook landed
      installment-session/route.ts       POST — installment 1 (saves a reusable card token)
      installment-charge-now/route.ts    POST — user-initiated "pay next"/"pay all remaining"
      installment-run-schedule/route.ts  GET  — daily auto-charge trigger, secret-protected
      installment-status/route.ts        GET  — polled installment progress
    admin/
      login/route.ts               POST — admin session login
      logout/route.ts              POST — admin session logout
  admin/
    login/page.tsx                 Admin login screen
    page.tsx                       Registrations/inquiries dashboard (tables, pagination, search)
    layout.tsx                     Auth-gated admin shell
  global-not-found.tsx
  robots.ts / sitemap.ts
  globals.css

components/
  course/     Program/curriculum content sections
  layout/     Navbar, footer, language toggle, mobile drawer
  payment/    PaymentStep, InstallmentPaymentPanel, PaymentSuccessBadge, shared Xendit Components hook
  register/   RegisterForm, RegisterSidebar
  admin/      AdminTable, InquiriesTable + shared bits (SearchInput, TableSkeletonRows, EmptyTableRow, Pager, Banner)
  sections/   Landing page sections (Hero, FAQ, Testimonials, ...)
  ui/         Small shared primitives (Button, Reveal, SectionHeading, HoverIconBadge, ...)
  docs/       Layout pieces for the course/curriculum pages

lib/
  constants/       Static content + PROGRAM_FEES/pricing logic (payment.ts)
  i18n/             get-dictionary.ts + dictionaries/{en,ja}.ts, locales.ts
  admin/            Admin auth/session status, useLoadingPulse, usePaginatedList
  env.ts            Server-only env var validation — throws at import time if anything's missing
  supabase.ts       Supabase client (service-role key, bypasses RLS, server-only)
  xendit.ts         createCardPaymentSession() — POST https://api.xendit.co/sessions
  xendit-payments.ts Payments API client (installment plan — saved-card, auto-charged)
  installments.ts   claimAndChargeInstallments() — shared atomic-claim-then-charge logic
  admin-auth.ts     Admin session verification
  resend.ts         Resend client
  emails/           Transactional email templates
  ratelimit.ts      Upstash rate limiters (no-op in dev)
  redis.ts          Upstash Redis client
  logger.ts         Structured JSON logger
  request.ts        getClientIp()
  html.ts           htmlEscape() — XSS prevention for emails
  timing-safe.ts    Constant-time comparisons for secrets/tokens
  fonts.ts          Shared next/font/google setup (site + admin variants)
  alerts.ts         Ops/error alerting

hooks/              useMobile, useScrolled
proxy.ts            Locale routing — redirects "/" to a cookie/default locale, rewrites unknown
                     locale segments to the 404 page, sets the locale cookie (replaces middleware.ts)
```

`app/[lang]/` and `proxy.ts` are the whole i18n mechanism — there's no separate `locales/` JSON
tree or `i18next` runtime. See `lib/i18n/dictionaries/{en,ja}.ts`.

## Environment Variables

The required list is enforced at startup by `lib/env.ts` — it throws on import if anything's
missing, so a misconfigured deploy fails the whole build rather than one request at a time.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Xendit
XENDIT_SECRET_KEY=xnd_development_...           # xnd_production_... in prod
XENDIT_WEBHOOK_TOKEN=any_random_string          # same value set in the Xendit dashboard
INSTALLMENT_CRON_SECRET=any_random_string       # protects GET /api/payment/installment-run-schedule

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com        # must be a verified domain in Resend

# Upstash Redis (skipped entirely in local dev — see lib/ratelimit.ts)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA   # omit to use the dev-bypass path

# Admin panel
ADMIN_PASSWORD=any_strong_shared_password       # single shared password, no user accounts

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000       # production: your real domain

# Optional — fan-out the payment webhook to other systems (see docs/WEBHOOK_FANOUT_PLAN.md)
FORWARD_APP2_URL=
FORWARD_APP2_SECRET=                            # own random secret, never reuse XENDIT_WEBHOOK_TOKEN
FORWARD_APP3_URL=
FORWARD_APP3_SECRET=
FORWARD_TIMEOUT_MS=5000
FORWARD_MAX_RETRIES=3

OPS_ALERT_EMAIL=                                # emails reconciliation problems here instead of only logging
```

Full variable-by-variable reference, sensitivity, and where to get each one:
**`docs/ENV_TROUBLESHOOTING.md`**.

## Database

Three tables: `registrations` (one row per applicant) and, for the installment path,
`installment_plans` + `installments`. Full migration SQL is in **`docs/TESTING_PAYMENT.md`, steps
1 and 1b** — that's the copy-pasteable source of truth, not duplicated here. RLS is optional
defense-in-depth only; every query goes through the service-role client server-side (see "RLS" in
`docs/PAYMENT.md`).

## Local Development

```bash
npm install
npm run dev
```

Rate limiting is skipped entirely in `NODE_ENV=development` (no Upstash account needed to run
locally — see `lib/ratelimit.ts`). Turnstile has a dev-bypass path too when no site key is
configured. To test the Xendit webhook locally you need a public URL — see `docs/TESTING_PAYMENT.md`
for the full ngrok + test-mode walkthrough.

```bash
npm run typecheck
npm run test        # Vitest — pure-logic unit tests, no network/DB required
```

Test coverage today is deliberately narrow: pricing/installment math
(`lib/constants/payment.ts`), the admin status derivation
(`lib/admin/status.ts`), and the constant-time token comparison
(`lib/timing-safe.ts`) — the logic that's cheapest to get wrong silently and
cheapest to test without mocking Supabase/Xendit. The API routes themselves
have no automated coverage yet.

## Payment Flow (short version)

```
Register wizard → POST /api/register → registrations row created, confirmation email sent
                   with a /[lang]/my?token=<accessToken> link

/my (token page) → PaymentStep → POST /api/payment/session → Xendit Sessions API
                   → embedded card form (iframe, no redirect) → session-complete event
                   → client polls /api/payment/status until the webhook has landed

Xendit → POST /api/payment/webhook → verifies callback token → atomically marks the
         matching registration paid → sends confirmation email

If payment_type = "installment": /my instead shows InstallmentPaymentPanel — a fixed 4x
saved-card plan on a separate Xendit surface (Payments API). See docs/PAYMENT.md → "Installment plan."
```

Full architecture, every security decision, and why each one was made:
**`docs/PAYMENT.md`** — read this before touching anything under `app/api/payment/`,
`components/payment/`, or `lib/xendit.ts`.

## Other Docs

| Doc | What it's for |
|---|---|
| `docs/PAYMENT.md` | Xendit payment architecture, security decisions, known gaps |
| `docs/TESTING_PAYMENT.md` | Step-by-step checklist to run the payment flow end-to-end, incl. the DB migration SQL |
| `docs/DEPLOYMENT.md` | Netlify launch checklist, in order |
| `docs/ENV_TROUBLESHOOTING.md` | Every env var, what it's for, and symptom → cause → fix |
| `docs/LEARN.md` | Deep-dive teaching guide — Next.js concepts + how this specific codebase works |
