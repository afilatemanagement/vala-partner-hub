import { ChevronDown, Download, Filter, Search, Settings2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

export function FilterBar({
  placeholder = "Search…",
  filters,
  trailing,
}: {
  placeholder?: string;
  filters?: string[];
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 lg:px-6 py-2.5">
      <div className="relative w-full sm:w-80">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={placeholder} className="h-9 pl-8 bg-muted/60" />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {(filters ?? ["Status", "Country", "Tier", "Date"]).map((f) => (
          <Button key={f} variant="outline" size="sm" className="h-9 gap-1 font-normal">
            {f} <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
          <Filter className="size-3.5" /> More
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        {trailing}
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
          <Upload className="size-3.5" /> Import
        </Button>
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
          <Download className="size-3.5" /> Export
        </Button>
        <Button variant="ghost" size="icon" className="size-9" aria-label="Table settings">
          <Settings2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
