import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Coins, Repeat, Clock, ScrollText, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/commissions")({
  head: () => ({ meta: [{ title: "Commissions — Affiliate Manager" }] }),
  component: CommissionsWall,
});

function CommissionsWall() {
  return (
    <>
      <PageHeader
        title="Commissions"
        description="Commission plans, rules, pending, paid, recurring, adjustments and reports."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Commissions" }]}
        actions={<><Button variant="outline" size="sm" className="gap-1.5"><SlidersHorizontal className="size-3.5" /> Plans</Button><Button size="sm">New Rule</Button></>}
      />
      <Tabs items={["Overview", "Plans", "Rules", "Pending", "Paid", "Recurring", "Adjustments", "History", "Reports"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Active Plans" value="0" icon={<ScrollText className="size-4" />} tone="primary" />
          <KpiCard label="Rules" value="0" icon={<SlidersHorizontal className="size-4" />} />
          <KpiCard label="Pending" value="—" icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="Approved" value="—" icon={<Banknote className="size-4" />} tone="success" />
          <KpiCard label="Paid 30d" value="—" icon={<Coins className="size-4" />} />
          <KpiCard label="Recurring MRR" value="—" icon={<Repeat className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search commission entries…" filters={["Status", "Affiliate", "Plan", "Period", "Order"]} />
        <DataTableShell
          columns={[
            { key: "entry", label: "Entry" },
            { key: "affiliate", label: "Affiliate" },
            { key: "order", label: "Order" },
            { key: "plan", label: "Plan" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "period", label: "Period" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Banknote}
          emptyTitle="No commission entries"
          emptyDescription="Commissions accrue here per order, subscription renewal or adjustment."
          emptyAction={{ label: "Create Plan" }}
        />
      </WallShell>
    </>
  );
}
