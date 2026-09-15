import "server-only";

import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// Shared Upstash client for server-side state (currently just revocable admin sessions).
// Null in dev so local work never requires an Upstash project.
const isDev = process.env.NODE_ENV === "development";

export const redis = isDev ? null : new Redis({ url: env.upstashRedisUrl, token: env.upstashRedisToken });
