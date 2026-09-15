import "server-only";

import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { redis } from "@/lib/redis";
import { timingSafeStringEqual } from "@/lib/timing-safe";

// Single shared password, no user accounts. The cookie is a random token looked up against a
// server-side Redis record, so logging out actually revokes the session, not just the cookie.
// Falls back to a deterministic HMAC in dev, where no Redis project is configured.
export const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SESSION_KEY_PREFIX = "admin-session:";

function devFallbackToken(): string {
  return createHmac("sha256", env.adminPassword).update("admin-session").digest("hex");
}

export function passwordValid(password: string): boolean {
  return timingSafeStringEqual(password, env.adminPassword);
}

export async function issueSessionCookieHeader(): Promise<string> {
  if (!redis) {
    return `${ADMIN_COOKIE_NAME}=${devFallbackToken()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ADMIN_COOKIE_MAX_AGE}`;
  }
  const token = randomBytes(32).toString("hex");
  await redis.set(`${SESSION_KEY_PREFIX}${token}`, "1", { ex: ADMIN_COOKIE_MAX_AGE });
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ADMIN_COOKIE_MAX_AGE}`;
}

// Deletes the server-side record too, not just the browser's cookie.
export async function clearSessionCookieHeader(currentToken: string | undefined): Promise<string> {
  if (redis && currentToken) {
    await redis.del(`${SESSION_KEY_PREFIX}${currentToken}`);
  }
  return `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  if (!redis) {
    return timingSafeStringEqual(token, devFallbackToken());
  }
  const exists = await redis.get(`${SESSION_KEY_PREFIX}${token}`);
  return exists !== null;
}
