import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Banner } from "@/components/admin/Banner";
import { resolveRegistrationStatus, type AdminInstallmentRow } from "@/lib/admin/status";
import { INSTALLMENT_COUNT } from "@/lib/constants/payment";
import { logger } from "@/lib/logger";

const REGISTRATIONS_LIMIT = 200;

export const metadata: Metadata = {
  title: "Admin Dashboard - TalenCo",
  robots: { index: false, follow: false },
};

type RegistrationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  line_id: string;
  university: string;
  major: string;
  english_level: string;
  career_goal: string;
  scheme: string | null;
  payment_type: string | null;
  status: string;
  display_amount: number | null;
  paid_at: string | null;
  created_at: string;
  next_step: string;
};

type PlanRow = { id: string; registration_id: string; status: string };
type InstallmentRow = AdminInstallmentRow & { plan_id: string };

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  // Fetched separately (registrations → plans → installments) rather than a single nested
  // Supabase select, matching this codebase's existing pattern of a few plain queries joined in
  // JS over one complex embedded-relation query. Capped at REGISTRATIONS_LIMIT most-recent
  // registrations — the exact total count is fetched alongside it so the UI can flag when older
  // registrations are outside this window (search/filter only ever sees what's fetched here).
  const [{ data: registrations, error: regErr }, { count: totalRegistrations }] = await Promise.all([
    supabase
      .from("registrations")
      .select(
        "id, full_name, email, phone, line_id, university, major, english_level, career_goal, scheme, payment_type, status, display_amount, paid_at, created_at, next_step"
      )
      .order("created_at", { ascending: false })
      .limit(REGISTRATIONS_LIMIT)
      .returns<RegistrationRow[]>(),
    supabase.from("registrations").select("id", { count: "exact", head: true }),
  ]);

  if (regErr) logger.error("Admin dashboard: registrations query failed", { error: regErr.message });

  // next_step = "payment" registrants are the only ones that ever get an installment_plans /
  // installments row, so the payment-side lookups only need to run against that subset.
  const paymentRegs = (registrations ?? []).filter((r) => r.next_step === "payment");
  const inquiryRegs = (registrations ?? []).filter((r) => r.next_step === "info");

  const regIds = paymentRegs.map((r) => r.id);

  const { data: plans, error: plansErr } = regIds.length
    ? await supabase.from("installment_plans").select("id, registration_id, status").in("registration_id", regIds).returns<PlanRow[]>()
    : { data: [] as PlanRow[], error: null };

  if (plansErr) logger.error("Admin dashboard: installment_plans query failed", { error: plansErr.message });

  const planIds = (plans ?? []).map((p) => p.id);

  const { data: installments, error: installmentsErr } = planIds.length
    ? await supabase
        .from("installments")
        .select("plan_id, installment_no, status, due_date, amount")
        .in("plan_id", planIds)
        .order("installment_no", { ascending: true })
        .returns<InstallmentRow[]>()
    : { data: [] as InstallmentRow[], error: null };

  if (installmentsErr) logger.error("Admin dashboard: installments query failed", { error: installmentsErr.message });

  const loadError = Boolean(regErr || plansErr || installmentsErr);
  const truncated = totalRegistrations !== null && totalRegistrations > (registrations?.length ?? 0);

  const planByReg = new Map((plans ?? []).map((p) => [p.registration_id, p]));
  const installmentsByPlan = new Map<string, InstallmentRow[]>();
  for (const row of installments ?? []) {
    const list = installmentsByPlan.get(row.plan_id) ?? [];
    list.push(row);
    installmentsByPlan.set(row.plan_id, list);
  }

  const paymentRows = paymentRegs.map((reg) => {
    const plan = planByReg.get(reg.id);
    const installmentsForReg = plan ? (installmentsByPlan.get(plan.id) ?? []) : [];
    return { reg, hasPlan: !!plan, installments: installmentsForReg };
  });

  const inquiryRows = inquiryRegs.map((reg) => ({
    id: reg.id,
    full_name: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    line_id: reg.line_id,
    university: reg.university,
    major: reg.major,
    english_level: reg.english_level,
    career_goal: reg.career_goal,
    created_at: reg.created_at,
  }));

  const actionCount = paymentRows.filter(({ reg, installments }) => resolveRegistrationStatus(reg, installments) === "action").length;

  const fullRows = paymentRows.filter(({ reg }) => reg.payment_type === "full");
  const fullPaidCount = fullRows.filter(({ reg }) => reg.status === "paid").length;

  const installmentRows = paymentRows.filter(({ reg }) => reg.payment_type === "installment");
  const installmentCompletedCount = installmentRows.filter(
    ({ installments }) => installments.filter((r) => r.status === "paid").length >= INSTALLMENT_COUNT
  ).length;
  const installmentInProgressCount = installmentRows.length - installmentCompletedCount;

  return (
    <main className="min-h-screen w-full bg-[#f6f7f9] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-300 flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-sm text-black/50">Track registrations, inquiries, and installment payments in one place.</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="outline" size="md" icon={<LogOut size={15} aria-hidden="true" />}>
              Sign out
            </Button>
          </form>
        </div>

        {loadError && <Banner tone="error">Some data failed to load — figures below may be incomplete. Try refreshing.</Banner>}
        {!loadError && truncated && (
          <Banner tone="info">
            Showing the latest {REGISTRATIONS_LIMIT} of {totalRegistrations} registrations — search and filters only apply to this set.
          </Banner>
        )}

        <AdminTabs
          paymentRows={paymentRows}
          inquiryRows={inquiryRows}
          stats={{
            fullPaidCount,
            fullTotalCount: fullRows.length,
            installmentCompletedCount,
            installmentTotalCount: installmentRows.length,
            installmentInProgressCount,
            actionCount,
          }}
        />
      </div>
    </main>
  );
}
