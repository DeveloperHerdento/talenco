import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// In local development every check passes immediately — no Upstash calls, no setup required.
const noop = { limit: async () => ({ success: true }) } as unknown as Ratelimit;

const isDev = process.env.NODE_ENV === "development";

const redis = isDev
  ? null
  : new Redis({ url: env.upstashRedisUrl, token: env.upstashRedisToken });

function make(build: () => Ratelimit): Ratelimit {
  return isDev ? noop : build();
}

export const registerLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "rl:register",
    })
);

export const emailRegisterLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.fixedWindow(1, "24 h"),
      prefix: "rl:email-register",
    })
);

export const checkoutLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:checkout",
    })
);

export const installmentCheckoutLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:checkout-installment",
    })
);

// Tight window — brute-force protection on the single shared admin password.
export const adminLoginLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "rl:admin-login",
    })
);

export const statusLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "rl:status",
    })
);

// Applied only to requests that already failed the x-callback-token check (see
// app/api/payment/webhook/route.ts) — legitimate Xendit deliveries never hit this limiter, so it
// can stay tight without any risk of throttling real traffic.
export const webhookLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "rl:webhook",
    })
);

// The scheduler calls this once a day from one source IP; a real cron tick never comes close to
// this, so it only bites a leaked INSTALLMENT_CRON_SECRET being replayed rapidly.
export const cronLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(6, "1 h"),
      prefix: "rl:cron",
    })
);
