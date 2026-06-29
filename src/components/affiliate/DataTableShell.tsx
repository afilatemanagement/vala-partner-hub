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
}: {
  columns: Column[];
  emptyIcon?: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: { label: string };
  rows?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="w-9 px-3 py-2.5">
                <input type="checkbox" className="size-3.5 rounded border-border" />
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
            {rows ?? (
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
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[12px] text-muted-foreground">
        <div>{footer ?? "0 results"}</div>
        <div className="flex items-center gap-1">
          <button className="rounded px-2 py-1 hover:bg-muted" disabled>
            Prev
          </button>
          <span className="px-2">Page 1 of 1</span>
          <button className="rounded px-2 py-1 hover:bg-muted" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
