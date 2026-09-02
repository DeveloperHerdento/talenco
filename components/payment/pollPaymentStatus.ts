export type PaymentStatus = { status: string; paymentType: string | null; balancePaidAt: string | null };

export async function pollPaymentStatus(
  accessToken: string,
  isDone: (data: PaymentStatus) => boolean,
  { attempts = 8, intervalMs = 1200 }: { attempts?: number; intervalMs?: number } = {}
): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`/api/payment/status?accessToken=${encodeURIComponent(accessToken)}`);
      if (res.ok) {
        const data: PaymentStatus = await res.json();
        if (isDone(data)) return true;
      }
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}
