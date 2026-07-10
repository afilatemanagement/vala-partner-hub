import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { KpiCard, KpiGrid } from "./KpiCard";
import { WallShell } from "./WallShell";
import { FilterBar } from "./FilterBar";
import { DataTableShell, type Column } from "./DataTableShell";
import { Tabs, StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { useEntityList, useEntityCount, type EntityFilter } from "@/lib/affiliate-entity";

export type KpiSpec = {
  label: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
  filter?: EntityFilter[]; // extra head-count filters against `table`
  formatter?: (n: number) => string;
};

export type EntityWallProps<T extends Record<string, unknown>> = {
  title: string;
  description?: string;
  crumbLabel: string;
  table: string;
  select?: string;
  searchColumns?: string[];
  searchPlaceholder?: string;
  filters?: string[];
  tabs?: string[];
  kpis: KpiSpec[];
  columns: Column[];
  renderRow: (row: T) => ReactNode;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  order?: { column: string; ascending?: boolean };
};

/**
 * Generic enterprise wall renderer: PageHeader → Tabs → KPI grid → FilterBar
 * → DataTable, all bound to a Supabase table via useEntityList + useEntityCount.
 * Handles loading, empty, error, and pagination out of the box.
 */
export function EntityWall<T extends Record<string, unknown>>(p: EntityWallProps<T>) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState<string | undefined>(p.tabs?.[0]);
  const list = useEntityList<T>({
    table: p.table,
    select: p.select,
    search: p.searchColumns && p.searchColumns.length > 0 ? { q, columns: p.searchColumns } : undefined,
    order: p.order,
    page,
    pageSize: 25,
  });

  const totalPages = list.data?.totalPages ?? 1;
  const count = list.data?.count ?? 0;

  return (
    <>
      <PageHeader
        title={p.title}
        description={p.description}
        crumbs={[{ label: "Affiliate Manager" }, { label: p.crumbLabel }]}
        actions={
          <>
            <Button variant="outline" size="sm">Bulk Actions</Button>
            {p.primaryActionLabel && (
              <Button size="sm" onClick={p.onPrimaryAction}>{p.primaryActionLabel}</Button>
            )}
          </>
        }
      />
      {p.tabs && <Tabs items={p.tabs} active={activeTab} onChange={setActiveTab} />}
      <WallShell>
        <KpiGrid>
          {p.kpis.map((k) => (
            <KpiCounter key={k.label} table={p.table} spec={k} />
          ))}
        </KpiGrid>
        <FilterBar
          placeholder={p.searchPlaceholder ?? "Search…"}
          filters={p.filters}
          value={q}
          onChange={(v) => { setQ(v); setPage(1); }}
        />
        <DataTableShell
          columns={p.columns}
          isLoading={list.isLoading}
          emptyIcon={p.emptyIcon}
          emptyTitle={list.isError ? "Failed to load" : p.emptyTitle}
          emptyDescription={
            list.isError
              ? (list.error instanceof Error ? list.error.message : "Please retry.")
              : q
                ? `No results for “${q}”. Try a different query.`
                : p.emptyDescription
          }
          emptyAction={
            list.isError
              ? { label: "Retry", onClick: () => list.refetch() }
              : p.primaryActionLabel
                ? { label: p.primaryActionLabel, onClick: p.onPrimaryAction }
                : undefined
          }
          rows={list.data?.rows.length ? list.data.rows.map(p.renderRow) : undefined}
          footer={
            <>
              <span className="tabular-nums">
                {list.isLoading ? "Loading…" : `${count.toLocaleString()} result${count === 1 ? "" : "s"}`}
                {!list.isLoading && count > 0 && ` · Page ${page} of ${totalPages}`}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2" disabled={page <= 1} onClick={() => setPage((n) => Math.max(1, n - 1))}>Prev</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" disabled={page >= totalPages} onClick={() => setPage((n) => n + 1)}>Next</Button>
              </div>
            </>
          }
        />
      </WallShell>
    </>
  );
}

function KpiCounter({ table, spec }: { table: string; spec: KpiSpec }) {
  const c = useEntityCount(table, spec.filter);
  const value =
    c.isLoading ? "…" : c.isError ? "—" : spec.formatter ? spec.formatter(c.data ?? 0) : (c.data ?? 0).toLocaleString();
  return <KpiCard label={spec.label} value={value} icon={spec.icon} tone={spec.tone} />;
}

/** Convenience cell renderer for status columns across walls. */
export function StatusCell({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const tone: "success" | "warning" | "destructive" | "info" | "neutral" | "primary" =
    /^(verified|approved|active|paid|resolved|completed|sent|connected)$/i.test(value) ? "success"
    : /^(pending|reviewing|processing|scheduled|open|draft)$/i.test(value) ? "warning"
    : /^(suspended|rejected|failed|error|revoked|cancelled|no_show|closed|disconnected)$/i.test(value) ? "destructive"
    : /^(info|new|scheduled)$/i.test(value) ? "info"
    : "neutral";
  return <StatusBadge tone={tone}>{value}</StatusBadge>;
}

/** Standard tbody row wrapper matching DataTableShell's checkbox column. */
export function Row({ id, children }: { id: string; children: ReactNode }) {
  return (
    <tr key={id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
      <td className="w-9 px-3 py-2.5"><input type="checkbox" className="size-3.5 rounded border-border" /></td>
      {children}
      <td className="w-10" />
    </tr>
  );
}

export function Cell({
  children,
  align,
  className,
}: { children: ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  return (
    <td className={[
      "px-3 py-2.5",
      align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
      className ?? "",
    ].join(" ")}>{children}</td>
  );
}

export function fmtMoney(cents: number | null | undefined) {
  const n = (cents ?? 0) / 100;
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function fmtDate(v: string | null | undefined) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
