import { Award, Briefcase, Globe2, Users, type LucideIcon } from "lucide-react";

export type BenefitKey = "realProject" | "certificate" | "knowledge" | "network";

export type Benefit = {
  key: BenefitKey;
  icon: LucideIcon;
};

export const BENEFITS: Benefit[] = [
  { key: "realProject", icon: Briefcase },
  { key: "certificate", icon: Award },
  { key: "knowledge", icon: Globe2 },
  { key: "network", icon: Users },
];
