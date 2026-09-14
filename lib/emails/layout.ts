import "server-only";

import { readFileSync } from "fs";
import { join } from "path";

const LOGO_CONTENT_ID = "talenco-logo";
const LINE_QR_CONTENT_ID = "line-group-qr";
const LINE_GROUP_URL = "https://line.me/ti/g/BKT7KGVsWJ";

const logoBuffer = readFileSync(join(process.cwd(), "public/assets/logo-talenco.png"));
const lineQrBuffer = readFileSync(join(process.cwd(), "public/assets/line-group-qr.png"));

export function emailLogoHeader(): string {
  return `<img src="cid:${LOGO_CONTENT_ID}" alt="TalenCo" width="38" height="40" style="display:block;margin-bottom:16px" />`;
}

export const emailLogoAttachment = {
  content: logoBuffer,
  filename: "logo-talenco.png",
  contentId: LOGO_CONTENT_ID,
};

export function emailLineGroupInvite(): string {
  return `
    <table role="presentation" width="100%" style="margin:20px 0;border-collapse:collapse;background:#f0fdf4;border:1px solid #d1e7dd;border-radius:8px">
      <tr>
        <td style="padding:20px;text-align:center">
          <img src="cid:${LINE_QR_CONTENT_ID}" alt="LINE group QR code" width="120" height="120" style="display:block;margin:0 auto 12px" />
          <p style="margin:0 0 4px;font-weight:bold;font-size:14px;color:#111827">参加者限定LINEグループへご招待します</p>
          <p style="margin:0 0 12px;font-size:13px;color:#6b7280">You're invited to our participant-only LINE group</p>
          <p style="margin:0 0 16px;font-size:12px;line-height:1.6;color:#6b7280">
            今後のご連絡やお知らせはこちらのグループで行います。ぜひご参加ください。<br/>
            We'll share updates and important announcements there — please join.
          </p>
          <a href="${LINE_GROUP_URL}"
             style="display:inline-block;background:#06C755;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
            LINEグループに参加する / Join LINE Group →
          </a>
        </td>
      </tr>
    </table>
  `;
}

export const emailLineGroupAttachment = {
  content: lineQrBuffer,
  filename: "line-group-qr.png",
  contentId: LINE_QR_CONTENT_ID,
};
