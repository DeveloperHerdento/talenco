import type { LucideIcon } from "lucide-react";

type HoverIconBadgeProps = {
  icon: LucideIcon;
  size: number;
  iconSize: number;
};

export function HoverIconBadge({ icon: Icon, size, iconSize }: HoverIconBadgeProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#ff9977] bg-[rgba(255,192,114,0.3)] transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/20"
      style={{ width: size, height: size }}
    >
      <Icon
        size={iconSize}
        strokeWidth={1.75}
        className="text-brand-orange transition-colors duration-300 group-hover:text-white"
      />
    </div>
  );
}
