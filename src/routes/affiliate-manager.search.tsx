import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useEffect, useRef } from "react";
import {
  Search, SlidersHorizontal, X, ArrowRight, LayoutGrid, Filter as FilterIcon,
} from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { WallShell } from "@/components/affiliate/WallShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/affiliate/EmptyState";
import { Highlighted } from "@/components/affiliate/Highlighted";
import {
  runSearch, SEARCH_KINDS, SEARCH_GROUPS, type SearchEntityKind, type SearchGroup,
} from "@/lib/affiliate-search";
import { AFFILIATE_NAV } from "@/lib/affiliate-nav";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  kind: fallback(z.array(z.string()), []).default([]),
  group: fallback(z.array(z.string()), []).default([]),
  wall: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/affiliate-manager/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Universal Search — Affiliate Manager" }] }),
  component: UniversalSearchWall,
});

function UniversalSearchWall() {
  const { q, kind, group, wall } = Route.useSearch();
  const navigate = useNavigate({ from: "/affiliate-manager/search" });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const kinds = kind as SearchEntityKind[];
  const groups = group as SearchGroup[];

  const results = useMemo(
    () => runSearch({ q, kinds, groups, wall: wall || undefined }),
    [q, kinds, groups, wall],
  );

  const byWall = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const r of results) {
      const arr = map.get(r.wall) ?? [];
      arr.push(r);
      map.set(r.wall, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [results]);

  const setSearch = (patch: Partial<{ q: string; kind: string[]; group: string[]; wall: string }>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const toggle = (key: "kind" | "group", value: string) => {
    const current = key === "kind" ? kind : group;
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setSearch({ [key]: next } as any);
  };

  const totalsByKind = useMemo(() => {
    const counts: Partial<Record<SearchEntityKind, number>> = {};
    for (const r of results) counts[r.kind] = (counts[r.kind] ?? 0) + 1;
    return counts;
  }, [results]);

  const activeFilters = kind.length + group.length + (wall ? 1 : 0);

  return (
    <>
      <PageHeader
        title="Universal Search"
        description="Search every wall, entity, action, filter and setting across the affiliate platform."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Universal Search" }]}
        actions={
          activeFilters > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setSearch({ kind: [], group: [], wall: "" })}>
              <X className="size-4" /> Clear filters ({activeFilters})
            </Button>
          ) : null
        }
      />

      <WallShell>
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center gap-2 p-3">
            <Search className="size-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={q}
              onChange={(e) => setSearch({ q: e.target.value })}
              placeholder="Search affiliates, campaigns, orders, payouts, settings…"
              className="h-10 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            {q && (
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setSearch({ q: "" })} aria-label="Clear query">
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="border-t border-border p-3">
            <FilterSection
              icon={<SlidersHorizontal className="size-3.5" />}
              label="Entity type"
              counts={totalsByKind}
              options={SEARCH_KINDS}
              selected={kind}
              onToggle={(v) => toggle("kind", v)}
            />
            <FilterSection
              className="mt-2"
              icon={<LayoutGrid className="size-3.5" />}
              label="Workspace group"
              options={SEARCH_GROUPS as readonly string[]}
              selected={group}
              onToggle={(v) => toggle("group", v)}
              labelize={(v) => v[0].toUpperCase() + v.slice(1)}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                <FilterIcon className="size-3.5" /> Wall
              </span>
              <Chip active={!wall} onClick={() => setSearch({ wall: "" })}>All walls</Chip>
              {AFFILIATE_NAV.map((n) => (
                <Chip key={n.to} active={wall === n.to} onClick={() => setSearch({ wall: n.to })}>
                  {n.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{results.length}</span> result{results.length === 1 ? "" : "s"}
              {q && <> for &ldquo;<span className="text-foreground">{q}</span>&rdquo;</>}
              {byWall.length > 0 && <> across {byWall.length} wall{byWall.length === 1 ? "" : "s"}</>}
            </span>
            <span className="hidden md:inline">Highlights show where each term matched.</span>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState
              icon={Search}
              title={q ? `No matches for "${q}"` : "Start typing to search"}
              description={
                q
                  ? "Try fewer words, different keywords, or clear the active filters."
                  : "Universal Search looks across all 26 walls — affiliates, campaigns, payouts, settings and more."
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {byWall.map(([wallLabel, items]) => (
              <section key={wallLabel} className="rounded-lg border border-border bg-surface">
                <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-semibold">{wallLabel}</h3>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{items.length}</Badge>
                  </div>
                  <Link to={items[0].to} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    Open wall <ArrowRight className="size-3" />
                  </Link>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={r.to}
                        className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <KindPill kind={r.kind} />
                            <span className="truncate text-sm font-medium">
                              <Highlighted text={r.title} q={q} />
                            </span>
                          </div>
                          {r.subtitle && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              <Highlighted text={r.subtitle} q={q} />
                            </p>
                          )}
                        </div>
                        <span className="hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                          matched in {r.matchedIn}
                          <ArrowRight className="size-3" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </WallShell>
    </>
  );
}

function FilterSection({
  label, icon, options, selected, onToggle, counts, labelize, className,
}: {
  label: string;
  icon: React.ReactNode;
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  counts?: Partial<Record<string, number>>;
  labelize?: (v: string) => string;
  className?: string;
}) {
  return (
    <div className={["flex flex-wrap items-center gap-1.5", className].filter(Boolean).join(" ")}>
      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      {options.map((opt) => {
        const c = counts?.[opt];
        return (
          <Chip key={opt} active={selected.includes(opt)} onClick={() => onToggle(opt)}>
            {labelize ? labelize(opt) : opt}
            {typeof c === "number" && <span className="ml-1 text-[10px] opacity-70">{c}</span>}
          </Chip>
        );
      })}
    </div>
  );
}

function Chip({
  children, active, onClick,
}: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground hover:bg-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function KindPill({ kind }: { kind: SearchEntityKind }) {
  return (
    <span className="inline-flex h-5 items-center rounded-sm border border-border bg-muted px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {kind}
    </span>
  );
}
