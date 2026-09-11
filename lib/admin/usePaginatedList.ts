"use client";

import { useState } from "react";

// Shared by every admin table (Payments, Inquiries) so page-size, clamping, and the
// "N-M of Total" math can't drift between them. Page is clamped at read time rather than via a
// setState-in-effect — if a narrower filter drops the page count below the stored page, this
// just renders the last valid page without an extra render.
export function usePaginatedList<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);
  const rangeStart = items.length === 0 ? 0 : start + 1;
  const rangeEnd = Math.min(start + pageSize, items.length);

  return { page: currentPage, setPage, pageCount, paginated, rangeStart, rangeEnd };
}
