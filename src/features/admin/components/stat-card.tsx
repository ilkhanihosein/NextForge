import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl p-6 glass">
      <div
        className="absolute -end-6 -top-6 size-24 rounded-full bg-brand/10 blur-2xl"
        aria-hidden
      />
      <Icon className="size-5 text-brand" aria-hidden />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-4xl tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
