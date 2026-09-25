import { AlertTriangle, Info } from "lucide-react";

export function Banner({ tone, children }: { tone: "error" | "info"; children: React.ReactNode }) {
  const Icon = tone === "error" ? AlertTriangle : Info;
  const cls = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-brand-blue/20 bg-brand-blue/5 text-brand-blue";

  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${cls}`}>
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      {children}
    </div>
  );
}
