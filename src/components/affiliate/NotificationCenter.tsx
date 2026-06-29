import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, BellOff, CheckCheck, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/affiliate/StatusBadge";
import type { ReactNode } from "react";

export function NotificationCenter({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-surface">
        <SheetHeader className="border-b border-border px-4 py-3 space-y-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-base">Notifications</SheetTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8" aria-label="Mark all read">
                <CheckCheck className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Settings">
                <Settings2 className="size-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        <Tabs items={["All", "Mentions", "Approvals", "Payouts", "System"]} />
        <div className="flex-1 grid place-items-center px-6 py-12 text-center">
          <div>
            <div className="mx-auto mb-3 grid size-11 place-items-center rounded-lg bg-muted text-muted-foreground">
              <BellOff className="size-5" />
            </div>
            <h3 className="font-display text-sm font-semibold">You're all caught up</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Approvals, payouts, risk alerts and system events will surface here in realtime.
            </p>
          </div>
        </div>
        <div className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Bell className="size-3.5" /> Realtime sync active
        </div>
      </SheetContent>
    </Sheet>
  );
}
