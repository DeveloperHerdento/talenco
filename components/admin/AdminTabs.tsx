"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Clock, CreditCard, MessageCircleQuestion, Wallet } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { InquiriesTable, type Inquiry } from "@/components/admin/InquiriesTable";
import type { Registration } from "@/components/admin/RegistrationRow";
import type { RegistrationStatusKey, AdminInstallmentRow } from "@/lib/admin/status";

type PaymentRow = { reg: Registration; hasPlan: boolean; installments: AdminInstallmentRow[] };

type Stats = {
  fullPaidCount: number;
  fullTotalCount: number;
  installmentCompletedCount: number;
  installmentTotalCount: number;
  installmentInProgressCount: number;
  actionCount: number;
};

type Tab = "payments" | "inquiries";

export function AdminTabs({ paymentRows, inquiryRows, stats }: { paymentRows: PaymentRow[]; inquiryRows: Inquiry[]; stats: Stats }) {
  const [tab, setTab] = useState<Tab>("payments");

  // Lifted out of each table so search/filter survive switching tabs and back.
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<RegistrationStatusKey | "all">("all");
  const [inquirySearch, setInquirySearch] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit gap-2 rounded-xl border border-[#ececec] bg-white p-1 shadow-sm">
        <TabButton active={tab === "payments"} onClick={() => setTab("payments")} icon={<CreditCard size={15} aria-hidden="true" />}>
          Payments <span className="text-black/35">· {paymentRows.length}</span>
        </TabButton>
        <TabButton
          active={tab === "inquiries"}
          onClick={() => setTab("inquiries")}
          icon={<MessageCircleQuestion size={15} aria-hidden="true" />}
        >
          Inquiries <span className="text-black/35">· {inquiryRows.length}</span>
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {tab === "payments" ? (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Wallet size={20} aria-hidden="true" />}
                value={stats.fullPaidCount}
                total={stats.fullTotalCount}
                label="Full payment · registrations paid in full"
              />
              <StatCard
                icon={<CheckCircle2 size={20} aria-hidden="true" />}
                value={stats.installmentCompletedCount}
                total={stats.installmentTotalCount}
                label="Completed installment plans"
              />
              <StatCard
                icon={<Clock size={20} aria-hidden="true" />}
                value={stats.installmentInProgressCount}
                label={`Installment plans in progress${stats.actionCount > 0 ? ` · ${stats.actionCount} need${stats.actionCount === 1 ? "s" : ""} attention` : ""}`}
                alert={stats.actionCount > 0}
              />
            </div>
            <p className="text-xs text-black/35">
              Only counts registrations that picked full payment or an installment plan — {paymentRows.length} total.
            </p>

            <AdminTable
              rows={paymentRows}
              search={paymentSearch}
              onSearchChange={setPaymentSearch}
              statusFilter={paymentStatus}
              onStatusFilterChange={setPaymentStatus}
            />
          </motion.div>
        ) : (
          <motion.div
            key="inquiries"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InquiriesTable rows={inquiryRows} search={inquirySearch} onSearchChange={setInquirySearch} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
        active ? "bg-brand-blue/10 text-brand-blue" : "text-black/50 hover:text-black/70"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StatCard({
  icon,
  value,
  total,
  label,
  alert = false,
}: {
  icon: React.ReactNode;
  value: number;
  total?: number;
  label: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          alert ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-blue/10 text-brand-blue"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-black">
          {value}
          {total !== undefined && <span className="text-base font-medium text-black/40"> / {total}</span>}
        </p>
        <p className="text-sm text-black/50">{label}</p>
      </div>
    </div>
  );
}

