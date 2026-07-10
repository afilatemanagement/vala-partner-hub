import { ChevronDown, Download, Filter, Search, Settings2, Upload, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

export function FilterBar({
  placeholder = "Search…",
  filters,
  trailing,
  value,
  onChange,
  showIO = true,
}: {
  placeholder?: string;
  filters?: string[];
  trailing?: ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  showIO?: boolean;
}) {
  const controlled = typeof value === "string";
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 lg:px-6 py-2.5">
      <div className="relative w-full sm:w-80">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={controlled ? value : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-9 pl-8 pr-8 bg-muted/60"
        />
        {controlled && value && value.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange?.("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {(filters ?? ["Status", "Country", "Tier", "Date"]).map((f) => (
          <Button key={f} variant="outline" size="sm" className="h-9 gap-1 font-normal" type="button">
            {f} <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" type="button">
          <Filter className="size-3.5" /> More
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        {trailing}
        {showIO && (
          <>
            <Button asChild variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
              <Link to="/affiliate-manager/import"><Upload className="size-3.5" /> Import</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
              <Link to="/affiliate-manager/export"><Download className="size-3.5" /> Export</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="size-9" aria-label="Table settings" type="button">
          <Settings2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
