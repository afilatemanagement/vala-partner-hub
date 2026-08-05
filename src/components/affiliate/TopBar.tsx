import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AFFILIATE_NAV } from "@/lib/affiliate-nav";
import { Bell, Command, HelpCircle, LogOut, Plus, Search, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommandPalette, useCommandPalette } from "@/components/affiliate/CommandPalette";
import { NotificationCenter } from "@/components/affiliate/NotificationCenter";
import { RightActionPanel } from "@/components/affiliate/RightActionPanel";
import { useSession, userInitials } from "@/lib/use-session";
import { useQueryClient } from "@tanstack/react-query";

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const palette = useCommandPalette();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { user, loading: sessionLoading } = useSession();
  const queryClient = useQueryClient();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
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

        <div className="ml-auto hidden w-full max-w-md items-center gap-2 md:flex">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/affiliate-manager/search", search: { q, kind: [], group: [], wall: "" } });
            }}
            className="relative w-full"
            role="search"
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search affiliates, campaigns, orders…"
              className="h-9 pl-8 pr-24 bg-muted/60 border-border transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Universal search"
            />
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  aria-label="Clear search"
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => palette.setOpen(true)}
                className="flex items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                aria-label="Open command palette"
                title="Command palette (⌘K)"
              >
                <Command className="size-3" /> K
              </button>
              <Button type="submit" size="sm" variant="secondary" className="h-6 px-2 text-[11px]">
                Search
              </Button>
            </div>
          </form>
        </div>


        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            aria-label="Search"
            onClick={() => palette.setOpen(true)}
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 px-2"
            aria-label="Open command palette (Command or Control + K)"
            title="Command palette (⌘K)"
            onClick={() => palette.setOpen(true)}
          >
            <Command className="size-4" aria-hidden="true" />
            <span className="hidden text-[11px] text-muted-foreground sm:inline">⌘K</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-9 sm:inline-flex"
            aria-label="Help & keyboard shortcuts"
            title="Help (⌘K)"
            onClick={() => palette.setOpen(true)}
          >
            <HelpCircle className="size-4" aria-hidden="true" />
          </Button>
          <NotificationCenter
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 relative"
                aria-label="Notifications — 1 or more unread alerts"
              >
                <Bell className="size-4" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 size-1.5 rounded-full bg-accent ring-2 ring-surface"
                />
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label="Notification status"
                  className="sr-only"
                >
                  You have unread notifications
                </span>
              </Button>
            }
          />
          <RightActionPanel
            trigger={
              <Button size="sm" className="ml-1 h-9 gap-1.5">
                <Plus className="size-4" /> New
              </Button>
            }
          />
          {sessionLoading ? (
            <div
              className="ml-2 size-8 animate-pulse rounded-full bg-muted"
              aria-hidden="true"
            />
          ) : !user ? (
            <Button asChild size="sm" variant="secondary" className="ml-2 h-9">
              <Link to="/auth">Sign in</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Operator menu — signed in as ${user.email ?? "operator"}`}
                  className="ml-2 grid size-8 place-items-center rounded-full bg-primary-soft text-primary font-semibold text-xs transition hover:ring-2 hover:ring-primary/30"
                >
                  {userInitials(user.email)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user.email ?? "Boss Panel Operator"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/affiliate-manager/settings">
                    <User className="size-4 mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliate-manager/settings">
                    <Settings className="size-4 mr-2" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => palette.setOpen(true)}>
                  <Command className="size-4 mr-2" /> Command palette
                  <span className="ml-auto text-[10px] text-muted-foreground">⌘K</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    await queryClient.cancelQueries();
                    queryClient.clear();
                    await supabase.auth.signOut();
                    toast.success("Signed out");
                    navigate({ to: "/auth", replace: true });
                  }}
                >
                  <LogOut className="size-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

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
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />
    </header>
  );
}
