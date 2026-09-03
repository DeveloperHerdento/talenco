import { NextRequest, after } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { registerLimiter, emailRegisterLimiter } from "@/lib/ratelimit";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { htmlEscape } from "@/lib/html";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  lineId: z.string().trim().min(1).max(50),
  currentStatus: z.string().trim().min(1).max(100),
  university: z.string().trim().min(2).max(200),
  major: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().max(200).optional().default(""),
  englishLevel: z.string().trim().min(1).max(100),
  studiedAbroad: z.enum(["Yes・はい", "No・いいえ"]),
  overseasWork: z.enum(["Yes・はい", "No・いいえ"]),
  reasons: z.array(z.string().max(300)).min(1).max(20),
  careerGoal: z.string().trim().min(1).max(300),
  hearAbout: z.string().trim().min(1).max(300),
  nextStep: z.enum(["info", "payment"]),
  locale: z.enum(["ja", "en"]).default("ja"),
  turnstileToken: z.string().min(1),
  _hp: z.string().max(0, "Honeypot triggered"),
  privacyConsent: z.literal(true),
});

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.turnstileSecretKey,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    logger.error("Register: Turnstile verification request failed", { error: String(err) });
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await registerLimiter.limit(ip);
  if (!allowed) {
    return Response.json(
      { error: "リクエストが多すぎます。しばらくしてからもう一度お試しください。/ Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot check before validation — never reveal detection to whatever filled it.
  const hp = (body as Record<string, unknown>)?._hp;
  if (typeof hp === "string" && hp.length > 0) {
    logger.warn("Register: honeypot triggered", { ip });
    return Response.json({ registrationId: "00000000-0000-0000-0000-000000000000" });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    logger.warn("Register: validation failed", { ip, fields: result.error.flatten().fieldErrors });
    return Response.json({ error: "入力内容に誤りがあります / Validation failed" }, { status: 400 });
  }

  const data = result.data;

  // Per-email rate limit: prevents resubmitting the same address quickly from different IPs.
  const { success: emailAllowed } = await emailRegisterLimiter.limit(data.email);
  if (!emailAllowed) {
    return Response.json(
      { error: "このメールアドレスでの登録は一時的に制限されています。/ Registration for this email is temporarily limited." },
      { status: 429 }
    );
  }

  const sitekeyConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isDevBypass =
    process.env.NODE_ENV !== "production" &&
    data.turnstileToken === "__dev_bypass__" &&
    !sitekeyConfigured;

  // Turnstile verify and the duplicate-email lookup are independent — run in parallel.
  const [turnstileOk, dupResult] = await Promise.all([
    isDevBypass ? Promise.resolve(true) : verifyTurnstile(data.turnstileToken, ip === "unknown" ? null : ip),
    supabase.from("registrations").select("id, status").eq("email", data.email).neq("status", "failed").maybeSingle(),
  ]);

  if (!turnstileOk) {
    return Response.json(
      {
        error:
          "セキュリティ確認に失敗しました。ページを再読み込みしてお試しください。/ Security check failed. Please reload the page and try again.",
      },
      { status: 400 }
    );
  }

  if (dupResult.error) {
    logger.error("Register: duplicate check failed", { error: dupResult.error.message });
    return Response.json(
      { error: "登録確認中にエラーが発生しました。/ An error occurred. Please try again." },
      { status: 500 }
    );
  }

  if (dupResult.data) {
    // Generic message avoids confirming whether a specific email is in the system to an attacker.
    return Response.json(
      {
        error:
          "このメールアドレスで既に受付を行っています。ご確認メールをご確認いただくか、LINEまたはWhatsAppにてお問い合わせください。/ A submission already exists for this email. Please check your inbox or contact us via LINE/WhatsApp.",
      },
      { status: 409 }
    );
  }

  const { data: reg, error: insertErr } = await supabase
    .from("registrations")
    .insert({
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      line_id: data.lineId,
      current_status: data.currentStatus,
      university: data.university,
      major: data.major,
      job_title: data.jobTitle,
      english_level: data.englishLevel,
      studied_abroad: data.studiedAbroad === "Yes・はい",
      overseas_work: data.overseasWork === "Yes・はい",
      reasons: data.reasons,
      career_goal: data.careerGoal,
      hear_about: data.hearAbout,
      next_step: data.nextStep,
      locale: data.locale,
      status: "pending",
    })
    .select("id, access_token")
    .single();

  if (insertErr || !reg) {
    // Postgres unique violation (23505): a concurrent request won the race for this email.
    if (insertErr?.code === "23505") {
      return Response.json(
        { error: "このメールアドレスで既に受付を行っています。/ A submission already exists for this email." },
        { status: 409 }
      );
    }
    logger.error("Register: insert failed", { error: insertErr?.message });
    return Response.json(
      { error: "登録中にエラーが発生しました。/ An error occurred during registration." },
      { status: 500 }
    );
  }

  const isPayment = data.nextStep === "payment";
  const statusUrl = `${env.appUrl}/${data.locale}/my?token=${reg.access_token}`;

  // after() keeps the serverless function alive for this send instead of a bare
  // fire-and-forget promise, which Vercel can freeze right after the response returns.
  after(() =>
    resend.emails
      .send({
        from: env.resendFromEmail,
        to: data.email,
        subject: "【TalenCo】ご登録ありがとうございます / Registration Received",
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${htmlEscape(data.fullName)} 様</p>
          <p>ご登録いただきありがとうございます。<br/>Thank you for registering for the Global Career Starter Program.</p>
          ${
            isPayment
              ? `<p>近日中にお支払いに関するご案内をお送りします。<br/>We will send you payment instructions shortly.</p>`
              : `<p>近日中に詳細情報をお送りします。<br/>We will send you more information shortly.</p>`
          }
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold">📋 登録状況の確認 / View Your Registration</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569">
              以下のリンクからいつでも登録状況を確認できます。<br/>
              Use this link anytime to check your registration status.
            </p>
            <a href="${statusUrl}"
               style="display:inline-block;background:#2081F9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
              登録状況を確認する / View My Registration →
            </a>
            <p style="margin:12px 0 0;font-size:11px;color:#94a3b8">
              ※ このリンクはあなた専用です。第三者に共有しないでください。<br/>
              This link is personal. Do not share it with others.
            </p>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <p style="font-size:12px;color:#64748b">
            お問い合わせ: <a href="https://lin.ee/EQaovqv">LINE @601ffdki</a> /
            <a href="https://wa.me/+6285117804811">WhatsApp +6285117804811</a>
          </p>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: registration email failed", { error: String(err) }))
  );

  logger.info("Registration created", { registrationId: reg.id, nextStep: data.nextStep });
  return Response.json({ registrationId: reg.id, accessToken: reg.access_token });
}
