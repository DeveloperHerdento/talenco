import { ClipboardList, CreditCard, GraduationCap, PlaneLanding, type LucideIcon } from "lucide-react";

export type TimelineStatus = "completed" | "active" | "upcoming";

export type TimelineKey = "registration" | "payment" | "arrival" | "program";

export type TimelineStep = {
  key: TimelineKey;
  date: string;
  start: string;
  end: string;
  icon: LucideIcon;
};

export const TIMELINE: TimelineStep[] = [
  {
    key: "registration",
    date: "3 Aug – 3 Nov 2026",
    start: "2026-08-03",
    end: "2026-11-03",
    icon: ClipboardList,
  },
  { key: "payment", date: "4 Nov 2026", start: "2026-11-04", end: "2026-11-04", icon: CreditCard },
  {
    key: "arrival",
    date: "29 November 2026",
    start: "2026-11-29",
    end: "2026-11-29",
    icon: PlaneLanding,
  },
  {
    key: "program",
    date: "30 November – 12 December 2026",
    start: "2026-11-30",
    end: "2026-12-12",
    icon: GraduationCap,
  },
];

export function getTimelineStatus(step: TimelineStep, now: Date = new Date()): TimelineStatus {
  const start = new Date(`${step.start}T00:00:00`);
  const end = new Date(`${step.end}T23:59:59`);
  if (now > end) return "completed";
  if (now >= start && now <= end) return "active";
  return "upcoming";
}
