import "server-only";

import { env } from "@/lib/env";
import { XenditApiError } from "@/lib/xendit";

export { XenditApiError };

const XENDIT_API_BASE = "https://api.xendit.co";

// Required by every v3 Payments API endpoint — requests without it are rejected.
const API_VERSION = "2024-11-11";

function paymentsApiHeaders(): Record<string, string> {
  return {
    Authorization: `Basic ${Buffer.from(`${env.xenditSecretKey}:`).toString("base64")}`,
    "Content-Type": "application/json",
    "api-version": API_VERSION,
  };
}

export type InstallmentChargeResult = {
  paymentRequestId: string;
  status: string; // "SUCCEEDED" | "FAILED" | "PENDING"
};

type ChargeInstallmentParams = {
  referenceId: string;
  amount: number;
  currency: string;
  paymentTokenId: string;
};

export async function chargeInstallmentToken(params: ChargeInstallmentParams): Promise<InstallmentChargeResult> {
  const res = await fetch(`${XENDIT_API_BASE}/v3/payment_requests`, {
    method: "POST",
    headers: paymentsApiHeaders(),
    body: JSON.stringify({
      reference_id: params.referenceId,
      type: "PAY",
      country: "ID",
      currency: params.currency,
      request_amount: params.amount,
      payment_token_id: params.paymentTokenId,
      channel_properties: {
        card_on_file_type: "RECURRING",
        recurring_configuration: {
          recurring_frequency: 30,
        },
      },
    }),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new XenditApiError(body?.message ?? "Xendit installment charge failed", res.status, body);
  }

  return {
    paymentRequestId: body.payment_request_id ?? body.id,
    status: body.status,
  };
}
