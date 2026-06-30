import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck, Banknote, Download, Layers, Megaphone, Plus, Ticket, Upload, UserPlus, Wallet, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const create: { label: string; icon: LucideIcon; desc: string; to?: string }[] = [
  { label: "Add Affiliate", icon: UserPlus, desc: "Manually create an affiliate", to: "/affiliate-manager/affiliates" },
  { label: "Launch Campaign", icon: Megaphone, desc: "New campaign with products & budget", to: "/affiliate-manager/campaigns" },
  { label: "Generate Codes", icon: Ticket, desc: "Bulk create referral / coupon codes", to: "/affiliate-manager/referral-codes" },
  { label: "Issue Payout", icon: Wallet, desc: "One-off or batch payout", to: "/affiliate-manager/payouts" },
  { label: "Adjust Commission", icon: Banknote, desc: "Manual credit or debit", to: "/affiliate-manager/commissions" },
  { label: "Create Workflow", icon: Workflow, desc: "Automation rule", to: "/affiliate-manager/settings" },
];

const ops: { label: string; icon: LucideIcon; desc: string; to: string }[] = [
  { label: "Mass Bulk Actions", icon: Layers, desc: "Approve, suspend, message, assign, payout", to: "/affiliate-manager/bulk-actions" },
  { label: "Mass Approve", icon: BadgeCheck, desc: "Process the approval queue", to: "/affiliate-manager/bulk-actions" },
  { label: "Import Center", icon: Upload, desc: "Affiliates, links, codes, campaigns, payouts", to: "/affiliate-manager/import" },
  { label: "Export Center", icon: Download, desc: "CSV, XLSX, JSON with filters & schedule", to: "/affiliate-manager/export" },
];

export function RightActionPanel({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-surface">
        <SheetHeader className="border-b border-border px-4 py-3 space-y-0">
          <SheetTitle className="font-display text-base flex items-center gap-2">
            <Plus className="size-4" /> Quick Create
          </SheetTitle>
        </SheetHeader>
        <Tabs items={["Create", "Bulk Ops", "Recent"]} />
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <Section title="Create">
            {create.map((it) => <ActionRow key={it.label} {...it} />)}
          </Section>
          <Section title="Bulk Operations">
            {ops.map((it) => <ActionRow key={it.label} {...it} />)}
          </Section>
        </div>
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Press <kbd className="rounded border border-border bg-muted px-1">⌘</kbd> <kbd className="rounded border border-border bg-muted px-1">K</kbd> for command palette</span>
          <Button size="sm" variant="outline">Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ActionRow({ label, icon: Icon, desc, to }: { label: string; icon: LucideIcon; desc: string; to?: string }) {
  const inner = (
    <>
      <div className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="truncate text-[12px] text-muted-foreground">{desc}</div>
      </div>
    </>
  );
  const cls = "group flex w-full items-center gap-3 rounded-md border border-border bg-surface p-3 text-left transition-colors hover:border-border-strong hover:bg-muted/40";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button className={cls}>{inner}</button>;
}
