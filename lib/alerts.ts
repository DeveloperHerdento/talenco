import "server-only";

import { after } from "next/server";
import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { htmlEscape } from "@/lib/html";
import { emailLogoHeader, emailLogoAttachment } from "@/lib/emails/layout";

// Emails a human for payment states that need a manual look at the Xendit dashboard (amount
// mismatches, ambiguous charges) — a log line nobody is tailing won't surface those. Alongside,
// not instead of, the existing logger.error call. No-op if OPS_ALERT_EMAIL isn't configured.
export function sendOpsAlert(subject: string, context: Record<string, unknown>) {
  if (!env.opsAlertEmail) return;

  const rows = Object.entries(context)
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap">${htmlEscape(key)}</td><td style="padding:4px 0;font-family:monospace">${htmlEscape(String(value))}</td></tr>`)
    .join("");

  after(() =>
    resend.emails
      .send({
        from: `TalenCo Payments <${env.resendFromEmail}>`,
        to: env.opsAlertEmail!,
        subject: `[Payment reconciliation] ${subject}`,
        attachments: [emailLogoAttachment],
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            ${emailLogoHeader()}
            <h2 style="color:#af3131">${htmlEscape(subject)}</h2>
            <p>This needs a manual look at the Xendit dashboard and the matching row(s) in Supabase — it will not resolve itself on retry.</p>
            <table style="border-collapse:collapse;font-size:13px">${rows}</table>
          </div>
        `,
      })
      .catch((err: unknown) => logger.error("Ops alert email failed to send", { error: String(err), subject }))
  );
}
