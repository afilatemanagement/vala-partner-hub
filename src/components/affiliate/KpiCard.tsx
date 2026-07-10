import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  hint,
  delta,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  icon?: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
}) {
  const accent =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
      ? "text-success"
      : tone === "warning"
      ? "text-warning-foreground"
      : tone === "destructive"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
            {value}
          </div>
        </div>
        {icon && (
          <div className={`grid size-9 place-items-center rounded-md bg-muted ${accent}`}>{icon}</div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">{hint ?? "\u00a0"}</span>
        {delta && (
          <span
            className={[
              "inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-medium tabular-nums",
              delta.direction === "up"
                ? "bg-success/10 text-success"
                : delta.direction === "down"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {delta.direction === "up" && <ArrowUpRight className="size-3" />}
            {delta.direction === "down" && <ArrowDownRight className="size-3" />}
            {delta.direction === "flat" && <Minus className="size-3" />}
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {children}
    </div>
  );
}
