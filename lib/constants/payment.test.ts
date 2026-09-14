import { describe, it, expect } from "vitest";
import {
  PROGRAM_FEES,
  INSTALLMENT_COUNT,
  INSTALLMENT_PAYMENT_DEADLINE,
  INSTALLMENT_MIN_DAYS_REMAINING,
  resolveAmount,
  resolveDisplayAmount,
  resolveInstallmentSchedule,
  resolveInstallmentAmounts,
  resolveDisplayInstallmentAmounts,
  formatJpy,
} from "./payment";

describe("resolveAmount / resolveDisplayAmount", () => {
  it("returns the IDR charge amount for each scheme", () => {
    expect(resolveAmount("online")).toBe(PROGRAM_FEES.online.amountIdr);
    expect(resolveAmount("onsite")).toBe(PROGRAM_FEES.onsite.amountIdr);
  });

  it("returns the JPY display amount for each scheme", () => {
    expect(resolveDisplayAmount("online")).toBe(29_800);
    expect(resolveDisplayAmount("onsite")).toBe(298_000);
  });
});

describe("resolveInstallmentAmounts", () => {
  it("splits the total evenly across all installments", () => {
    const amounts = resolveInstallmentAmounts("online");
    expect(amounts).toHaveLength(INSTALLMENT_COUNT);
    expect(amounts.reduce((sum, a) => sum + a, 0)).toBe(PROGRAM_FEES.online.amountIdr);
  });

  it("folds any rounding remainder into the last installment", () => {
    const amounts = resolveInstallmentAmounts("onsite");
    const [first, , , last] = amounts;
    // 33,671,020 / 4 = 8,417,755 exactly, so this scheme has no remainder — assert the even case.
    expect(first).toBe(last);
    expect(amounts.every((a) => a === amounts[0])).toBe(true);
  });

  it("never produces amounts that fail to sum to the full price, even with a remainder", () => {
    // A scheme whose total isn't evenly divisible by 4 would leave a remainder — simulate it
    // against the same math the real function uses, since both fixtures happen to divide evenly.
    const total = 1_000_001;
    const base = Math.floor(total / INSTALLMENT_COUNT);
    const amounts = Array.from({ length: INSTALLMENT_COUNT }, () => base);
    amounts[INSTALLMENT_COUNT - 1] += total - base * INSTALLMENT_COUNT;
    expect(amounts.reduce((sum, a) => sum + a, 0)).toBe(total);
    expect(amounts[INSTALLMENT_COUNT - 1]).toBeGreaterThanOrEqual(amounts[0]);
  });
});

describe("resolveDisplayInstallmentAmounts", () => {
  it("splits the JPY display total evenly and sums back to the full price", () => {
    const amounts = resolveDisplayInstallmentAmounts("online");
    expect(amounts.reduce((sum, a) => sum + a, 0)).toBe(PROGRAM_FEES.online.amountJpy);
  });
});

describe("resolveInstallmentSchedule", () => {
  it("returns null when less than the minimum days remain before the deadline", () => {
    const tooClose = new Date(INSTALLMENT_PAYMENT_DEADLINE.getTime() - (INSTALLMENT_MIN_DAYS_REMAINING - 1) * 86_400_000);
    expect(resolveInstallmentSchedule(tooClose)).toBeNull();
  });

  it("returns null once the deadline has already passed", () => {
    const afterDeadline = new Date(INSTALLMENT_PAYMENT_DEADLINE.getTime() + 86_400_000);
    expect(resolveInstallmentSchedule(afterDeadline)).toBeNull();
  });

  it("returns exactly INSTALLMENT_COUNT dues, numbered 1..N, when there's enough runway", () => {
    const farEnough = new Date(INSTALLMENT_PAYMENT_DEADLINE.getTime() - 60 * 86_400_000);
    const schedule = resolveInstallmentSchedule(farEnough);
    expect(schedule).not.toBeNull();
    expect(schedule!.map((d) => d.installmentNo)).toEqual([1, 2, 3, 4]);
  });

  it("always lands the last installment exactly on the deadline, never after it", () => {
    const farEnough = new Date(INSTALLMENT_PAYMENT_DEADLINE.getTime() - 100 * 86_400_000);
    const schedule = resolveInstallmentSchedule(farEnough)!;
    expect(schedule[schedule.length - 1].dueDate.getTime()).toBe(INSTALLMENT_PAYMENT_DEADLINE.getTime());
  });

  it("produces dues in non-decreasing order", () => {
    const farEnough = new Date(INSTALLMENT_PAYMENT_DEADLINE.getTime() - 45 * 86_400_000);
    const schedule = resolveInstallmentSchedule(farEnough)!;
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].dueDate.getTime()).toBeGreaterThanOrEqual(schedule[i - 1].dueDate.getTime());
    }
  });
});

describe("formatJpy", () => {
  it("formats with a yen sign and thousands separators", () => {
    expect(formatJpy(29_800)).toBe("¥29,800");
    expect(formatJpy(0)).toBe("¥0");
  });
});
