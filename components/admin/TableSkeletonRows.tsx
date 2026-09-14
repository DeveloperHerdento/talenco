"use client";

import { AnimatePresence, motion } from "motion/react";

type SkeletonCell = {
  width: string;
  height?: string;
  rounded?: string;
  secondaryWidth?: string;
};

type Props = {
  rowCount: number;
  cells: SkeletonCell[];
};

export function TableSkeletonRows({ rowCount, cells }: Props) {
  return (
    <AnimatePresence>
      {Array.from({ length: rowCount }).map((_, i) => (
        <motion.tr
          key={`skeleton-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: i * 0.02 }}
          className="border-b border-[#f2f2f2] last:border-0"
        >
          {cells.map((cell, ci) => (
            <td key={ci} className="px-4 py-3">
              <div
                className={`animate-pulse rounded bg-[#ececec] ${cell.height ?? "h-3"} ${cell.width} ${
                  cell.secondaryWidth ? "mb-1.5" : ""
                } ${cell.rounded ?? "rounded"}`}
              />
              {cell.secondaryWidth && (
                <div className={`h-2.5 animate-pulse rounded bg-[#f0f0f0] ${cell.secondaryWidth}`} />
              )}
            </td>
          ))}
        </motion.tr>
      ))}
    </AnimatePresence>
  );
}
