import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type DocTableProps = {
  headers: string[];
  // Cells are almost always plain strings, but a couple of tables (fee
  // callouts) want a bold/colored fragment.
  rows: ReactNode[][];
  caption?: string;
  highlightLastCol?: boolean;
};

export function DocTable({ headers, rows, caption, highlightLastCol = false }: DocTableProps) {
  return (
    <Reveal className="flex flex-col gap-2">
      <div className="w-full overflow-x-auto rounded-xl border border-[#e5e5e5] shadow-sm">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-orange">
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold whitespace-nowrap text-white first:rounded-tl-xl last:rounded-tr-xl">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-t border-[#eee] transition-colors hover:bg-[#f4f8ff] ${
                  rowIndex % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                }`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 align-top text-black/75 ${
                      highlightLastCol && cellIndex === row.length - 1 ? "font-semibold text-brand-blue" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="text-xs text-black/45 italic">{caption}</p>}
    </Reveal>
  );
}
