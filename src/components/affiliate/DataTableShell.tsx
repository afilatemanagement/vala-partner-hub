import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChevronDown, Inbox } from "lucide-react";
import { EmptyState } from "./EmptyState";

export type Column = { key: string; label: string; align?: "left" | "right" | "center"; className?: string };

export function DataTableShell({
  columns,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  rows,
  footer,
  isLoading,
}: {
  columns: Column[];
  emptyIcon?: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: { label: string; onClick?: () => void };
  rows?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="w-9 px-3 py-2.5">
                <input type="checkbox" className="size-3.5 rounded border-border" aria-label="Select all rows" />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={[
                    "px-3 py-2.5 font-medium",
                    c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                    c.className ?? "",
                  ].join(" ")}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <ChevronDown className="size-3 opacity-40" />
                  </span>
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  <td className="w-9 px-3 py-3"><div className="size-3.5 rounded bg-muted animate-pulse" /></td>
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-3">
                      <div className={`h-3.5 rounded bg-muted animate-pulse ${c.align === "right" ? "ml-auto w-16" : "w-3/4"}`} />
                    </td>
                  ))}
                  <td className="w-10" />
                </tr>
              ))
            ) : rows ?? (
              <tr>
                <td colSpan={columns.length + 2}>
                  <EmptyState
                    icon={emptyIcon ?? Inbox}
                    title={emptyTitle}
                    description={emptyDescription}
                    primaryAction={emptyAction}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[12px] text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
