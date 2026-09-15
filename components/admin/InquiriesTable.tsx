"use client";

import { useMemo } from "react";
import { Pager } from "@/components/admin/Pager";
import { SearchInput } from "@/components/admin/SearchInput";
import { TableSkeletonRows } from "@/components/admin/TableSkeletonRows";
import { EmptyTableRow } from "@/components/admin/EmptyTableRow";
import { usePaginatedList } from "@/lib/admin/usePaginatedList";
import { useLoadingPulse } from "@/lib/admin/useLoadingPulse";

export type Inquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  line_id: string;
  university: string;
  major: string;
  english_level: string;
  career_goal: string;
  created_at: string;
};

const PAGE_SIZE = 10;

type Props = {
  rows: Inquiry[];
  // Controlled by the parent tab so it survives a tab switch — see AdminTable's Props for why.
  search: string;
  onSearchChange: (value: string) => void;
};

export function InquiriesTable({ rows, search, onSearchChange }: Props) {
  const { loading, pulse } = useLoadingPulse();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const { page, setPage, pageCount, paginated, rangeStart, rangeEnd } = usePaginatedList(filtered, PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={search}
        onChange={(value) => {
          onSearchChange(value);
          setPage(1);
          pulse();
        }}
        placeholder="Search by name, email, or phone"
      />

      <div className="overflow-x-auto rounded-2xl border border-[#ececec] bg-white shadow-sm">
        <table className="w-full min-w-225 text-left text-sm">
          <thead>
            <tr className="border-b border-[#ececec] text-xs tracking-wide text-black/40 uppercase">
              <th className="px-4 py-3 font-semibold">Name / Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">LINE ID</th>
              <th className="px-4 py-3 font-semibold">University / Major</th>
              <th className="px-4 py-3 font-semibold">English level</th>
              <th className="px-4 py-3 font-semibold">Career goal</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows
                rowCount={Math.min(PAGE_SIZE, Math.max(paginated.length, 4))}
                cells={[
                  { width: "w-32", height: "h-3.5", secondaryWidth: "w-40" },
                  { width: "w-20" },
                  { width: "w-16" },
                  { width: "w-28" },
                  { width: "w-16" },
                  { width: "w-32" },
                  { width: "w-16" },
                ]}
              />
            ) : paginated.length === 0 ? (
              <EmptyTableRow colSpan={7} message="No inquiries match this search." />
            ) : (
              paginated.map((r) => (
                <tr key={r.id} className="border-b border-[#f2f2f2] last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-black">{r.full_name}</div>
                    <div className="text-xs text-black/45">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black/70">{r.phone || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-black/70">{r.line_id || "—"}</td>
                  <td className="px-4 py-3 text-black/70">
                    {r.university || "—"}
                    {r.major ? ` / ${r.major}` : ""}
                  </td>
                  <td className="px-4 py-3 text-black/70">{r.english_level || "—"}</td>
                  <td className="px-4 py-3 max-w-64 text-black/70">
                    <span className="line-clamp-2" title={r.career_goal || undefined}>
                      {r.career_goal || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-nowrap text-black/50">{new Date(r.created_at).toISOString().slice(0, 10)}</td>
                </tr>
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
        itemLabel={filtered.length === 1 ? "inquiry" : "inquiries"}
      />
    </div>
  );
}
