import { Award, Briefcase, GraduationCap, Globe2, type LucideIcon } from "lucide-react";

export type ParticipantKey = "students" | "freshGrads" | "youngPros" | "enthusiasts";

export type Participant = {
  key: ParticipantKey;
  icon: LucideIcon;
};

export const PARTICIPANTS: Participant[] = [
  { key: "students", icon: GraduationCap },
  { key: "freshGrads", icon: Award },
  { key: "youngPros", icon: Briefcase },
  { key: "enthusiasts", icon: Globe2 },
];
