import { Link, useRouterState } from "@tanstack/react-router";
import { AFFILIATE_NAV } from "@/lib/affiliate-nav";
import { Bell, Command, HelpCircle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      {/* Row 1 — brand, search, actions */}
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Link to="/affiliate-manager" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-display font-bold">
            S
          </div>
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Software Vala</span>
            <span className="font-display text-sm font-semibold">Affiliate Manager</span>
          </div>
        </Link>

        <div className="ml-2 hidden md:flex items-center text-[11px] text-muted-foreground">
          <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5">Boss Panel</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Affiliate</span>
        </div>

        <div className="ml-auto flex w-full max-w-md items-center">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search affiliates, campaigns, orders…"
              className="h-9 pl-8 pr-16 bg-muted/60 border-border focus-visible:bg-surface"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground sm:flex">
              <Command className="size-3" /> K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9" aria-label="Help">
            <HelpCircle className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 relative" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
          </Button>
          <Button size="sm" className="ml-1 h-9 gap-1.5">
            <Plus className="size-4" /> New
          </Button>
          <div className="ml-2 grid size-8 place-items-center rounded-full bg-primary-soft text-primary font-semibold text-xs">
            SV
          </div>
        </div>
      </div>

      {/* Row 2 — wall tabs */}
      <nav className="no-scrollbar flex items-stretch gap-0 overflow-x-auto border-t border-border px-2 lg:px-4">
        {AFFILIATE_NAV.map((item) => {
          const active =
            item.to === "/affiliate-manager"
              ? pathname === "/affiliate-manager" || pathname === "/affiliate-manager/"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "relative whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
