import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Clock, CheckCircle2, XCircle, Building2, Globe2 } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/payouts")({
  head: () => ({ meta: [{ title: "Payouts — Affiliate Manager" }] }),
  component: PayoutsWall,
});

function PayoutsWall() {
  return (
    <>
      <PageHeader
        title="Payouts"
        description="Withdraw requests, bank accounts, UPI, PayPal, Wise — settlement and history."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Payouts" }]}
        actions={<><Button variant="outline" size="sm">Mass Payout</Button><Button size="sm">Approve Queue</Button></>}
      />
      <Tabs items={["Queue", "Approved", "Processing", "Paid", "Failed", "Methods", "History"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Pending Requests" value="0" icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="Approved" value="0" icon={<CheckCircle2 className="size-4" />} tone="success" />
          <KpiCard label="Failed" value="0" icon={<XCircle className="size-4" />} tone="destructive" />
          <KpiCard label="Paid 30d" value="—" icon={<Banknote className="size-4" />} tone="primary" />
          <KpiCard label="Payout Methods" value="0" icon={<Building2 className="size-4" />} />
          <KpiCard label="Countries" value="0" icon={<Globe2 className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search payout requests…" filters={["Status", "Method", "Affiliate", "Country", "Amount", "Date"]} />
        <DataTableShell
          columns={[
            { key: "request", label: "Request" },
            { key: "affiliate", label: "Affiliate" },
            { key: "method", label: "Method" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "fee", label: "Fee", align: "right" },
            { key: "net", label: "Net", align: "right" },
            { key: "requested", label: "Requested" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Banknote}
          emptyTitle="No payout requests"
          emptyDescription="Payout requests will appear here for approval, settlement and reconciliation."
        />
      </WallShell>
    </>
  );
}
