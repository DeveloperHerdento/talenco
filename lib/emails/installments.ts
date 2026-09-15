import "server-only";

import { after } from "next/server";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { htmlEscape } from "@/lib/html";
import { logger } from "@/lib/logger";
import { formatJpy } from "@/lib/constants/payment";
import { emailLogoHeader, emailLogoAttachment, emailLineGroupInvite, emailLineGroupAttachment } from "@/lib/emails/layout";

export function sendInstallmentReminderEmail(
  to: string,
  fullName: string,
  installmentNo: number,
  amountJpy: number,
  dueDate: string,
  statusUrl: string
) {
  const safeName = htmlEscape(fullName);
  after(() =>
    resend.emails
      .send({
        from: `TalenCo <${env.resendFromEmail}>`,
        to,
        subject: `【TalenCo】分割払い ${installmentNo}回目のお支払い予定のお知らせ / Upcoming Installment ${installmentNo} Reminder`,
        attachments: [emailLogoAttachment],
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          ${emailLogoHeader()}
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>分割払い ${installmentNo}回目（${formatJpy(amountJpy)}）のお支払い予定日が近づいています。<br/>Your installment ${installmentNo} payment (${formatJpy(amountJpy)}) is coming up on ${dueDate}.</p>
          <p>登録済みのカードへ自動で請求されます。カードの利用可能額をご確認ください。<br/>This will be charged automatically to your registered card — please make sure it has sufficient limit/balance.</p>
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold">📋 お支払い状況の確認 / View Payment Status</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569">以下のリンクから分割払いの状況をいつでも確認できます。<br/>Use this link anytime to check your installment plan status.</p>
            <a href="${statusUrl}"
               style="display:inline-block;background:#2081F9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
              お支払い状況を確認する / View Payment Status →
            </a>
          </div>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: installment reminder email failed", { error: String(err) }))
  );
}

export function sendInstallmentPaidEmail(
  to: string,
  fullName: string,
  installmentNo: number,
  remaining: number,
  statusUrl: string
) {
  const safeName = htmlEscape(fullName);
  after(() =>
    resend.emails
      .send({
        from: `TalenCo <${env.resendFromEmail}>`,
        to,
        subject: `【TalenCo】分割払い ${installmentNo}回目のお支払いを確認しました / Installment ${installmentNo} Received`,
        attachments: remaining > 0 ? [emailLogoAttachment] : [emailLogoAttachment, emailLineGroupAttachment],
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          ${emailLogoHeader()}
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>分割払い ${installmentNo}回目のお支払いを確認しました。ありがとうございます。<br/>We've received installment ${installmentNo} — thank you!</p>
          ${
            remaining > 0
              ? `<p>残り${remaining}回のお支払いが続きます。<br/>${remaining} installment(s) remaining.</p>`
              : `<p>これで全てのお支払いが完了しました。<br/>All installments are now paid — payment is complete.</p>${emailLineGroupInvite()}`
          }
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold">📋 お支払い状況の確認 / View Payment Status</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569">以下のリンクから分割払いの状況をいつでも確認できます。<br/>Use this link anytime to check your installment plan status.</p>
            <a href="${statusUrl}"
               style="display:inline-block;background:#2081F9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
              お支払い状況を確認する / View Payment Status →
            </a>
          </div>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: installment confirmation email failed", { error: String(err) }))
  );
}

export function sendInstallmentFailedEmail(to: string, fullName: string, statusUrl: string) {
  const safeName = htmlEscape(fullName);
  after(() =>
    resend.emails
      .send({
        from: `TalenCo <${env.resendFromEmail}>`,
        to,
        subject: "【TalenCo】分割払いのお支払いに失敗しました / Installment Payment Failed",
        attachments: [emailLogoAttachment],
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          ${emailLogoHeader()}
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>カードへの請求に失敗しました。以下のリンクからお支払いを完了してください。<br/>We couldn't charge your card. Please complete your payment using the link below.</p>
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <a href="${statusUrl}"
               style="display:inline-block;background:#2081F9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
              お支払いを完了する / Complete Payment →
            </a>
          </div>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: installment failure email failed", { error: String(err) }))
  );
}
