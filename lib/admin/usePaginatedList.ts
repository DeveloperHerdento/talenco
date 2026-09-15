"use client";

import { useState } from "react";

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
