import "server-only";

import { createHmac } from "crypto";
import { after } from "next/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { sendOpsAlert } from "@/lib/alerts";

type ForwardDestination = { name: string; url: string; secret: string };

const RETRY_DELAYS_MS = [500, 1500, 4000];

function configuredDestinations(): ForwardDestination[] {
  const destinations: ForwardDestination[] = [];
  if (env.forwardApp2Url && env.forwardApp2Secret) {
    destinations.push({ name: "app2", url: env.forwardApp2Url, secret: env.forwardApp2Secret });
  }
  if (env.forwardApp3Url && env.forwardApp3Secret) {
    destinations.push({ name: "app3", url: env.forwardApp3Url, secret: env.forwardApp3Secret });
  }
  return destinations;
}

async function attemptOnce(dest: ForwardDestination, rawBody: string, signature: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.forwardTimeoutMs);
  try {
    const res = await fetch(dest.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forward-signature": `sha256=${signature}`,
        "x-forward-timestamp": String(Math.floor(Date.now() / 1000)),
        "x-forward-source": "xendit-payment-webhook",
      },
      body: rawBody,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function forwardToDestination(dest: ForwardDestination, rawBody: string): Promise<void> {
  const signature = createHmac("sha256", dest.secret).update(rawBody).digest("hex");

  for (let attempt = 0; attempt <= env.forwardMaxRetries; attempt++) {
    try {
      await attemptOnce(dest, rawBody, signature);
      return;
    } catch (err) {
      const isLastAttempt = attempt === env.forwardMaxRetries;
      if (isLastAttempt) {
        logger.error("Payment webhook: forward failed permanently", { destination: dest.name, error: String(err) });
        sendOpsAlert(`Webhook forward to ${dest.name} failed after retries`, {
          destination: dest.name,
          url: dest.url,
          error: String(err),
        });
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt] ?? 4000));
    }
  }
}

export function forwardWebhookToDestinations(rawBody: string): void {
  const destinations = configuredDestinations();
  if (destinations.length === 0) return;

  after(() => Promise.allSettled(destinations.map((dest) => forwardToDestination(dest, rawBody))));
}
