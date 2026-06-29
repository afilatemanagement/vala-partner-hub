import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Clock, ShieldCheck, History } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/wallet")({
  head: () => ({ meta: [{ title: "Wallet — Affiliate Manager" }] }),
  component: WalletWall,
});

function WalletWall() {
  return (
    <>
      <PageHeader
        title="Wallet"
        description="Affiliate wallets — credits, debits, transactions, audit and reconciliation."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Wallet" }]}
        actions={<><Button variant="outline" size="sm">Reconcile</Button><Button size="sm">Adjust Wallet</Button></>}
      />
      <Tabs items={["Wallets", "Credits", "Debits", "Transactions", "Holds", "Audit"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Wallets" value="0" icon={<Wallet className="size-4" />} tone="primary" />
          <KpiCard label="Total Balance" value="—" icon={<Wallet className="size-4" />} />
          <KpiCard label="Credits 30d" value="—" icon={<ArrowDownToLine className="size-4" />} tone="success" />
          <KpiCard label="Debits 30d" value="—" icon={<ArrowUpFromLine className="size-4" />} />
          <KpiCard label="Pending Holds" value="—" icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="Audit Events" value="0" icon={<ShieldCheck className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search transactions…" filters={["Type", "Affiliate", "Currency", "Date"]} />
        <DataTableShell
          columns={[
            { key: "tx", label: "Transaction" },
            { key: "affiliate", label: "Affiliate" },
            { key: "type", label: "Type" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "balance", label: "Balance After", align: "right" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={History}
          emptyTitle="No wallet activity"
          emptyDescription="Wallet credits, debits and holds will appear here with full audit trail."
        />
      </WallShell>
    </>
  );
}
