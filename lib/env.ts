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
  appUrl: (() => {
    const u = process.env.NEXT_PUBLIC_APP_URL!;
    return u.startsWith("http") ? u : `https://${u}`;
  })(),
};
