import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type DayCardLabels = {
  objectives?: string;
  outcomes?: string;
  materials?: string;
  output?: string;
  groupTask?: string;
};

type DayCardProps = {
  day: string;
  title: string;
  objectives?: string[];
  outcomes?: string[];
  materials?: string[];
  output?: string[];
  groupTask?: ReactNode;
  labels?: DayCardLabels;
};

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 pl-4 text-xs text-black/65 md:text-sm">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-brand-blue">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-bold tracking-[1.5px] text-brand-orange uppercase">{label}</p>
      {children}
    </div>
  );
}

export function DayCard({ day, title, objectives, outcomes, materials, output, groupTask, labels }: DayCardProps) {
  return (
    <Reveal className="flex flex-col gap-5 rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-3">
        <span className="bg-brand-orange flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-xs font-bold whitespace-nowrap text-white md:text-sm">
          {day}
        </span>
        <h3 className="text-base font-bold text-black md:text-lg">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {objectives && (
          <Block label={labels?.objectives ?? "Learning Objectives"}>
            <List items={objectives} />
          </Block>
        )}
        {outcomes && (
          <Block label={labels?.outcomes ?? "Learning Outcomes"}>
            <List items={outcomes} />
          </Block>
        )}
        {materials && (
          <Block label={labels?.materials ?? "Materials"}>
            <List items={materials} />
          </Block>
        )}
        {output && (
          <Block label={labels?.output ?? "Output"}>
            <List items={output} />
          </Block>
        )}
      </div>

      {groupTask && (
        <div className="flex flex-col gap-2 rounded-xl bg-[#f7f9fc] p-4">
          <p className="text-[11px] font-bold tracking-[1.5px] text-brand-blue uppercase">
            {labels?.groupTask ?? "Group Task"}
          </p>
          <div className="text-xs text-black/65 md:text-sm">{groupTask}</div>
        </div>
      )}
    </Reveal>
  );
}
