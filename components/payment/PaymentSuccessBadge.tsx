import { Check } from "lucide-react";

const SIZE_CLASSES = { md: "size-12 text-xl", lg: "size-14 text-2xl" } as const;
const ICON_SIZE = { md: 22, lg: 26 } as const;

export function PaymentSuccessBadge({ size = "md" }: { size?: keyof typeof SIZE_CLASSES }) {
  return (
    <span className={`bg-brand-orange flex items-center justify-center rounded-full text-white ${SIZE_CLASSES[size]}`}>
      <Check size={ICON_SIZE[size]} strokeWidth={3} aria-hidden="true" />
    </span>
  );
}
