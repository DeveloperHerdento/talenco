"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pager({
  rangeStart,
  rangeEnd,
  total,
  page,
  pageCount,
  onPrev,
  onNext,
  itemLabel,
}: {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  itemLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-black/40">
        {total === 0 ? `No ${itemLabel} to show` : `Showing ${rangeStart}–${rangeEnd} of ${total} ${itemLabel}`}
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={page === 1}
            aria-label="Previous page"
            className="flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-black/60 hover:border-black/20 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
          <span className="text-xs font-medium text-black/60">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={page === pageCount}
            aria-label="Next page"
            className="flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-black/60 hover:border-black/20 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
