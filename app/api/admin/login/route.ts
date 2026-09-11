import { NextRequest } from "next/server";
import { z } from "zod";
import { passwordValid, issueSessionCookieHeader } from "@/lib/admin-auth";
import { adminLoginLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await adminLoginLimiter.limit(ip);
  if (!allowed) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!passwordValid(parsed.data.password)) {
    logger.warn("Admin login: invalid password attempt", { ip });
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", await issueSessionCookieHeader());
  return response;
}
