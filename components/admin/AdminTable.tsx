"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { AdminRegistrationRow, type Registration } from "@/components/admin/RegistrationRow";
import { Pager } from "@/components/admin/Pager";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { usePaginatedList } from "@/lib/admin/usePaginatedList";
import { useLoadingPulse } from "@/lib/admin/useLoadingPulse";
import {
  resolveRegistrationStatus,
  STATUS_FILTER_OPTIONS,
  type RegistrationStatusKey,
  type AdminInstallmentRow,
} from "@/lib/admin/status";

type InstallmentRow = AdminInstallmentRow;

const PAGE_SIZE = 10;

type Props = {
  rows: { reg: Registration; hasPlan: boolean; installments: InstallmentRow[] }[];
  // Search/status filter are controlled by the parent tab so they survive a tab switch — page
  // and the loading pulse stay local since resetting those on tab change is expected.
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: RegistrationStatusKey | "all";
  onStatusFilterChange: (value: RegistrationStatusKey | "all") => void;
};

export function AdminTable({ rows, search, onSearchChange, statusFilter, onStatusFilterChange }: Props) {
  const { loading, pulse } = useLoadingPulse();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(({ reg, installments }) => {
      if (statusFilter !== "all" && resolveRegistrationStatus(reg, installments) !== statusFilter) return false;
      if (!q) return true;
      return reg.full_name.toLowerCase().includes(q) || reg.email.toLowerCase().includes(q);
    });
  }, [rows, search, statusFilter]);

  const { page, setPage, pageCount, paginated, rangeStart, rangeEnd } = usePaginatedList(filtered, PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/35" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setPage(1);
              pulse();
            }}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-[#e0e0e0] py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-blue"
          />
        </div>
        <SelectMenu
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={(next) => {
            onStatusFilterChange(next);
            setPage(1);
            pulse();
          }}
          className="w-full sm:w-52"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#ececec] bg-white shadow-sm">
        <table className="w-full min-w-225 text-left text-sm">
          <thead>
            <tr className="border-b border-[#ececec] text-xs tracking-wide text-black/40 uppercase">
              <th className="px-4 py-3 font-semibold">Name / Email</th>
              <th className="px-4 py-3 font-semibold">Scheme</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Progress</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AnimatePresence>
                {Array.from({ length: Math.min(PAGE_SIZE, Math.max(paginated.length, 4)) }).map((_, i) => (
                  <motion.tr
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="border-b border-[#f2f2f2] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="mb-1.5 h-3.5 w-32 animate-pulse rounded bg-[#ececec]" />
                      <div className="h-2.5 w-40 animate-pulse rounded bg-[#f0f0f0]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-[#ececec]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-[#ececec]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-24 animate-pulse rounded-full bg-[#ececec]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-14 animate-pulse rounded bg-[#ececec]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="mb-1.5 h-3 w-20 animate-pulse rounded bg-[#ececec]" />
                      <div className="h-2.5 w-24 animate-pulse rounded bg-[#f0f0f0]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-[#ececec]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-10 animate-pulse rounded bg-[#ececec]" />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/40">
                  No registrations match this filter.
                </td>
              </tr>
            ) : (
              paginated.map(({ reg, hasPlan, installments }) => (
                <AdminRegistrationRow key={reg.id} reg={reg} hasPlan={hasPlan} installments={installments} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pager
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        total={filtered.length}
        page={page}
        pageCount={pageCount}
        onPrev={() => setPage(Math.max(1, page - 1))}
        onNext={() => setPage(Math.min(pageCount, page + 1))}
        itemLabel={filtered.length === 1 ? "registration" : "registrations"}
      />
    </div>
  );
}
