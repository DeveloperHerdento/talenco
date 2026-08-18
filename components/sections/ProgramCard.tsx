import Image from "next/image";
import type { Program } from "@/lib/constants/programs";
import type { Dictionary } from "@/lib/i18n/dictionary";

type ProgramCardProps = {
  program: Program;
  item: Dictionary["programs"]["items"][keyof Dictionary["programs"]["items"]];
};

export function ProgramCard({ program, item }: ProgramCardProps) {
  return (
    <article className="relative flex h-full w-full flex-col transition-transform duration-300 hover:scale-[1.03]">
      <div className="flex h-full flex-col overflow-hidden" style={{ clipPath: "url(#program-card-clip)" }}>
        <div className="relative h-72 w-full shrink-0">
          <Image
            src={program.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 bg-white p-5">
          <h3 className="text-2xl font-semibold text-brand-blue">{item.title}</h3>
          <p className="text-sm font-light leading-relaxed text-black">{item.description}</p>
        </div>
      </div>

      <div className="btn-gradient-brand absolute top-0 right-0 flex size-[60px] items-center justify-center rounded-full border-[0.5px] border-[#e0e0e0] text-xl font-semibold text-white shadow-md">
        {program.number}
      </div>
    </article>
  );
}
