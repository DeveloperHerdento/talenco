import { describe, it, expect } from "vitest";
import { resolveRegistrationStatus, type Registration, type InstallmentLike } from "./status";

function reg(overrides: Partial<Registration> = {}): Registration {
  return { status: "pending", payment_type: null, next_step: "payment", ...overrides };
}

describe("resolveRegistrationStatus", () => {
  it("is 'no_payment' for a registration that didn't choose to pay", () => {
    expect(resolveRegistrationStatus(reg({ next_step: "info" }), [])).toBe("no_payment");
  });

  it("is 'pending' for a registration that chose to pay but hasn't yet", () => {
    expect(resolveRegistrationStatus(reg({ next_step: "payment" }), [])).toBe("pending");
  });

  it("is 'paid' for a fully paid full-payment registration", () => {
    expect(resolveRegistrationStatus(reg({ status: "paid", payment_type: "full" }), [])).toBe("paid");
  });

  it("is 'in_progress' for a paid installment plan with unpaid installments remaining", () => {
    const installments: InstallmentLike[] = [{ status: "paid" }, { status: "scheduled" }, { status: "scheduled" }, { status: "scheduled" }];
    expect(resolveRegistrationStatus(reg({ status: "paid", payment_type: "installment" }), installments)).toBe("in_progress");
  });

  it("is 'paid' once every installment in the plan is paid", () => {
    const installments: InstallmentLike[] = Array.from({ length: 4 }, () => ({ status: "paid" as const }));
    expect(resolveRegistrationStatus(reg({ status: "paid", payment_type: "installment" }), installments)).toBe("paid");
  });

  it("is 'action' whenever any installment is manual_pending, even if the registration is paid", () => {
    const installments: InstallmentLike[] = [{ status: "paid" }, { status: "manual_pending" }, { status: "scheduled" }, { status: "scheduled" }];
    expect(resolveRegistrationStatus(reg({ status: "paid", payment_type: "installment" }), installments)).toBe("action");
  });

  it("is 'action' whenever any installment is failed", () => {
    const installments: InstallmentLike[] = [{ status: "failed" }];
    expect(resolveRegistrationStatus(reg({ status: "paid", payment_type: "installment" }), installments)).toBe("action");
  });

  it("prioritizes 'action' over 'pending' even for an unpaid registration with a stray failed row", () => {
    const installments: InstallmentLike[] = [{ status: "failed" }];
    expect(resolveRegistrationStatus(reg({ status: "pending", next_step: "payment" }), installments)).toBe("action");
  });
});
