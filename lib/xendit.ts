import "server-only";

import { env } from "@/lib/env";

const XENDIT_API_BASE = "https://api.xendit.co";

function authHeader(): string {
  return `Basic ${Buffer.from(`${env.xenditSecretKey}:`).toString("base64")}`;
}

// Xendit's customer.individual_detail.given_names rejects non-ASCII (registrants' names are
// often Japanese), so send a romanized/sanitized name here and the original in given_names_non_roman.
export function toXenditSafeName(fullName: string): string {
  const sanitized = fullName.replace(/[^A-Za-z0-9 ]/g, "").trim();
  return sanitized || "Customer";
}

type CreateSessionParams = {
  referenceId: string;
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  successReturnUrl: string;
  cancelReturnUrl: string;
  origins: string[];
  metadata?: Record<string, string>;
  // "FORCED" saves the card as a reusable payment_token_id on the same completion webhook — used by the installment plan's first charge.
  allowSavePaymentMethod?: "FORCED";
};

export type XenditSessionResult = {
  paymentSessionId: string;
  componentsSdkKey: string;
  status: string;
  expiresAt: string;
  customerId: string;
};

export class XenditApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
    this.name = "XenditApiError";
  }
}

export async function createCardPaymentSession(params: CreateSessionParams): Promise<XenditSessionResult> {
  const safeName = toXenditSafeName(params.customerName);

  const res = await fetch(`${XENDIT_API_BASE}/sessions`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference_id: params.referenceId,
      session_type: "PAY",
      mode: "COMPONENTS",
      currency: params.currency,
      amount: params.amount,
      country: "ID",
      allowed_payment_channels: ["CARDS"],
      description: params.description,
      success_return_url: params.successReturnUrl,
      cancel_return_url: params.cancelReturnUrl,
      ...(params.allowSavePaymentMethod ? { allow_save_payment_method: params.allowSavePaymentMethod } : {}),
      components_configuration: {
        origins: params.origins,
      },
      channel_properties: {
        cards: {
          installment_configuration: {
            allowed_terms: { terms: [] },
          },
        },
      },
      customer: {
        type: "INDIVIDUAL",
        reference_id: params.referenceId,
        email: params.customerEmail,
        individual_detail: {
          given_names: safeName,
          ...(safeName !== params.customerName.trim() ? { given_names_non_roman: params.customerName } : {}),
        },
      },
      metadata: params.metadata,
    }),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new XenditApiError(body?.message ?? "Xendit session creation failed", res.status, body);
  }

  return {
    paymentSessionId: body.payment_session_id,
    componentsSdkKey: body.components_sdk_key,
    status: body.status,
    expiresAt: body.expires_at,
    customerId: body.customer_id,
  };
}
