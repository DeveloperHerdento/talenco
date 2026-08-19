type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false }: SectionHeadingProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 md:gap-5 ${alignClass}`}>
      {title ? (
        <>
          <span className="text-gradient-brand text-lg font-bold tracking-[1px] uppercase md:text-xl">
            {eyebrow}
          </span>
          <h2 className={`font-medium text-3xl md:text-4xl ${light ? "text-white" : "text-black"}`}>{title}</h2>
        </>
      ) : (
        <h2 className={`font-medium text-3xl md:text-4xl ${light ? "text-white" : "text-black"}`}>{eyebrow}</h2>
      )}
      {subtitle && <p className="text-sm tracking-wide text-[#0d5bc9] md:text-base">{subtitle}</p>}
    </div>
  );
}
