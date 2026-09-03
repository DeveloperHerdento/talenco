import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { statusLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";

const schema = z.object({ accessToken: z.string().uuid() });

// Polled client-side after a Xendit session-complete event, so the UI can confirm the
// webhook actually landed before declaring success — the browser event alone only means
// the card was authorized, not that our server has recorded it. See useXenditCardSession.ts.
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await statusLimiter.limit(ip);
  if (!allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const result = schema.safeParse({ accessToken: request.nextUrl.searchParams.get("accessToken") });
  if (!result.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: reg } = await supabase
    .from("registrations")
    .select("status, payment_type, balance_paid_at")
    .eq("access_token", result.data.accessToken)
    .maybeSingle();

  if (!reg) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    status: reg.status,
    paymentType: reg.payment_type,
    balancePaidAt: reg.balance_paid_at,
  });
}
