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
      <span
        className={`text-gradient-brand font-bold tracking-[1px] uppercase ${
          title ? "text-lg md:text-xl" : "text-xl md:text-2xl"
        }`}
      >
        {eyebrow}
      </span>
      {title && (
        <h2 className={`font-medium text-3xl md:text-4xl ${light ? "text-white" : "text-black"}`}>{title}</h2>
      )}
      {subtitle && <p className="text-sm tracking-wide text-[#0d5bc9] md:text-base">{subtitle}</p>}
    </div>
  );
}
