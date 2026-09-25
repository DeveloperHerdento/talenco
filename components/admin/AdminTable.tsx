"use client";

import { useMemo } from "react";
import { AdminRegistrationRow, type Registration } from "@/components/admin/RegistrationRow";
import { Pager } from "@/components/admin/Pager";
import { SearchInput } from "@/components/admin/SearchInput";
import { TableSkeletonRows } from "@/components/admin/TableSkeletonRows";
import { EmptyTableRow } from "@/components/admin/EmptyTableRow";
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
        <SearchInput
          value={search}
          onChange={(value) => {
            onSearchChange(value);
            setPage(1);
            pulse();
          }}
          placeholder="Search by name or email"
        />
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
              <TableSkeletonRows
                rowCount={Math.min(PAGE_SIZE, Math.max(paginated.length, 4))}
                cells={[
                  { width: "w-32", height: "h-3.5", secondaryWidth: "w-40" },
                  { width: "w-16" },
                  { width: "w-16" },
                  { width: "w-24", height: "h-5", rounded: "rounded-full" },
                  { width: "w-14" },
                  { width: "w-20", secondaryWidth: "w-24" },
                  { width: "w-16" },
                  { width: "w-10" },
                ]}
              />
            ) : paginated.length === 0 ? (
              <EmptyTableRow colSpan={8} message="No registrations match this filter." />
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
