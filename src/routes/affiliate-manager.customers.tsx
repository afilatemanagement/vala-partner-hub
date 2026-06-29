import { createFileRoute } from "@tanstack/react-router";
import { Users, ShoppingBag, Repeat, KeyRound, LifeBuoy, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/customers")({
  head: () => ({ meta: [{ title: "Customers — Affiliate Manager" }] }),
  component: CustomersWall,
});

function CustomersWall() {
  return (
    <>
      <PageHeader
        title="Customer Management"
        description="Customers acquired through affiliates with orders, subscriptions, licenses and support."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Customers" }]}
        actions={<><Button variant="outline" size="sm">Segments</Button><Button size="sm">Add Customer</Button></>}
      />
      <Tabs items={["All", "Active", "Subscribers", "Licensed", "Churned", "Timeline", "Analytics"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Customers" value="0" icon={<Users className="size-4" />} tone="primary" />
          <KpiCard label="Active" value="0" icon={<TrendingUp className="size-4" />} tone="success" />
          <KpiCard label="Subscriptions" value="0" icon={<Repeat className="size-4" />} />
          <KpiCard label="Licenses" value="0" icon={<KeyRound className="size-4" />} />
          <KpiCard label="Orders 30d" value="0" icon={<ShoppingBag className="size-4" />} />
          <KpiCard label="Support Tickets" value="0" icon={<LifeBuoy className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search customers…" filters={["Status", "Affiliate", "Plan", "Country", "Spend"]} />
        <DataTableShell
          columns={[
            { key: "customer", label: "Customer" },
            { key: "affiliate", label: "Referred By" },
            { key: "orders", label: "Orders", align: "right" },
            { key: "subs", label: "Subscriptions", align: "right" },
            { key: "spend", label: "Lifetime Spend", align: "right" },
            { key: "country", label: "Country" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Users}
          emptyTitle="No customers yet"
          emptyDescription="Customers acquired by your affiliates will appear here with full purchase history."
        />
      </WallShell>
    </>
  );
}
