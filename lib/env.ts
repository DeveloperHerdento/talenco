import "server-only";

const REQUIRED_SERVER = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "TURNSTILE_SECRET_KEY",
  "XENDIT_SECRET_KEY",
  "XENDIT_WEBHOOK_TOKEN",
  "INSTALLMENT_CRON_SECRET",
  "ADMIN_PASSWORD",
] as const;

const REQUIRED_PUBLIC = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_APP_URL"] as const;

for (const key of [...REQUIRED_SERVER, ...REQUIRED_PUBLIC]) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  resendFromEmail: process.env.RESEND_FROM_EMAIL!,
  upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY!,
  xenditSecretKey: process.env.XENDIT_SECRET_KEY!,
  xenditWebhookToken: process.env.XENDIT_WEBHOOK_TOKEN!,
  installmentCronSecret: process.env.INSTALLMENT_CRON_SECRET!,
  adminPassword: process.env.ADMIN_PASSWORD!,
  appUrl: (() => {
    const u = process.env.NEXT_PUBLIC_APP_URL!;
    return u.startsWith("http") ? u : `https://${u}`;
  })(),
  // Optional — when set, payment reconciliation problems email this address (see lib/alerts.ts).
  opsAlertEmail: process.env.OPS_ALERT_EMAIL || null,
  // Optional fan-out destinations for the payment webhook (see lib/webhook-forward.ts). Each
  // needs its own URL + se cret pair — never reuse xenditWebhookToken as a forward signing key,
  // since that's also what authenticates inbound calls from Xendit itself.
  forwardApp2Url: process.env.FORWARD_APP2_URL || null,
  forwardApp2Secret: process.env.FORWARD_APP2_SECRET || null,
  forwardApp3Url: process.env.FORWARD_APP3_URL || null,
  forwardApp3Secret: process.env.FORWARD_APP3_SECRET || null,
  forwardTimeoutMs: process.env.FORWARD_TIMEOUT_MS ? Number(process.env.FORWARD_TIMEOUT_MS) : 5000,
  forwardMaxRetries: process.env.FORWARD_MAX_RETRIES ? Number(process.env.FORWARD_MAX_RETRIES) : 3,
};
