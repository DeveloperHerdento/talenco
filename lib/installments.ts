import "server-only";

import { supabase } from "@/lib/supabase";
import { chargeInstallmentToken, XenditApiError } from "@/lib/xendit-payments";
import { sendInstallmentFailedEmail } from "@/lib/emails/installments";
import { sendOpsAlert } from "@/lib/alerts";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type ClaimAndChargeParams = {
  planId: string;
  installmentIds: string[];
  totalAmount: number;
  currency: string;
  paymentTokenId: string;
  referenceIdPrefix: string;
};

type ClaimAndChargeResult =
  | { ok: true; paymentRequestId: string; status: string }
  | { ok: false; status: 409 | 500 | 502; error: string };

// Shared by the user-initiated "pay next/all" route and the daily scheduled charge. Claims the
// rows 'charging' before calling Xendit so a doubled trigger can't fire two charges for the same
// installments; the actual 'paid'/'manual_pending' transition happens later, from the webhook.
export async function claimAndChargeInstallments(params: ClaimAndChargeParams): Promise<ClaimAndChargeResult> {
  const { data: claimed, error: claimErr } = await supabase
    .from("installments")
    .update({ status: "charging" })
    .in("id", params.installmentIds)
    .eq("status", "scheduled")
    .select("id");

  if (claimErr) {
    logger.error("Installment charge: claim failed", { error: claimErr.message, planId: params.planId });
    return { ok: false, status: 500, error: "Claim failed" };
  }

  if (!claimed || claimed.length !== params.installmentIds.length) {
    if (claimed && claimed.length > 0) {
      await supabase
        .from("installments")
        .update({ status: "scheduled" })
        .in(
          "id",
          claimed.map((r) => r.id)
        );
    }
    return { ok: false, status: 409, error: "One or more installments are already being processed" };
  }

  try {
    const charge = await chargeInstallmentToken({
      referenceId: `${params.referenceIdPrefix}-${Date.now()}`,
      amount: params.totalAmount,
      currency: params.currency,
      paymentTokenId: params.paymentTokenId,
    });
    return { ok: true, paymentRequestId: charge.paymentRequestId, status: charge.status };
  } catch (err) {
    if (err instanceof XenditApiError) {
      logger.error("Installment charge: Xendit charge failed", { status: err.status, body: err.body, planId: params.planId });
    } else {
      logger.error("Installment charge: Xendit request failed", { error: String(err), planId: params.planId });
    }

    // The charge may have actually gone through despite this error (e.g. a timeout), so reverting
    // to 'scheduled' risks a double-charge on retry. Route to 'manual_pending' instead — visible
    // in the admin panel with a real next step, even if that occasionally means a false failure email.
    const { error: failErr } = await supabase.from("installments").update({ status: "manual_pending" }).in("id", params.installmentIds);
    if (failErr) {
      logger.error("Installment charge: failed to mark manual_pending after request failure", {
        error: failErr.message,
        planId: params.planId,
      });
    }

    // Flag for a human to cross-check against Xendit's record — this row is indistinguishable
    // from a normal decline otherwise.
    sendOpsAlert("Ambiguous installment charge — Xendit call errored, true outcome unknown", {
      planId: params.planId,
      installmentIds: params.installmentIds.join(", "),
      totalAmount: params.totalAmount,
      currency: params.currency,
      error: err instanceof XenditApiError ? `${err.status}: ${JSON.stringify(err.body)}` : String(err),
    });

    const { data: plan } = await supabase
      .from("installment_plans")
      .select("registration:registrations(email, full_name, locale, access_token)")
      .eq("id", params.planId)
      .maybeSingle();
    const reg = plan?.registration as unknown as { email: string; full_name: string; locale: string; access_token: string } | null;

    if (reg) {
      const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;
      sendInstallmentFailedEmail(reg.email, reg.full_name, statusUrl);
    } else {
      logger.error("Installment charge: registration not found for failure email", { planId: params.planId });
    }

    return { ok: false, status: 502, error: "Xendit charge failed" };
  }
}
