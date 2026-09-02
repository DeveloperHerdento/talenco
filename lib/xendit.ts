import "server-only";

import { env } from "@/lib/env";

const XENDIT_API_BASE = "https://api.xendit.co";

function authHeader(): string {
  return `Basic ${Buffer.from(`${env.xenditSecretKey}:`).toString("base64")}`;
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
};

export type XenditSessionResult = {
  paymentSessionId: string;
  componentsSdkKey: string;
  status: string;
  expiresAt: string;
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
      components_configuration: {
        origins: params.origins,
      },
      customer: {
        type: "INDIVIDUAL",
        reference_id: params.referenceId,
        email: params.customerEmail,
        individual_detail: {
          given_names: params.customerName,
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
  };
}
