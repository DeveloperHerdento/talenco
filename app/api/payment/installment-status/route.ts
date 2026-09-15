import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { statusLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";

const schema = z.object({ accessToken: z.string().uuid() });

// Polled after installment 1's 3DS redirect and after a "pay next"/"pay all" charge — same
// confirm-against-the-server pattern as /api/payment/status.
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
    .select("id")
    .eq("access_token", result.data.accessToken)
    .maybeSingle();

  if (!reg) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { data: plan } = await supabase
    .from("installment_plans")
    .select("id, status, card_last4")
    .eq("registration_id", reg.id)
    .maybeSingle();

  if (!plan) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { data: rows } = await supabase
    .from("installments")
    .select("installment_no, amount, due_date, status")
    .eq("plan_id", plan.id)
    .order("installment_no", { ascending: true });

  return Response.json({
    planStatus: plan.status,
    cardLast4: plan.card_last4,
    installments: rows ?? [],
  });
}
