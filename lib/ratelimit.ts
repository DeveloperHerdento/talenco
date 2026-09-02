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

export const balanceCheckoutLimiter = make(
  () =>
    new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:checkout-balance",
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
