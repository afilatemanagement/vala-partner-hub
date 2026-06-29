import { createFileRoute } from "@tanstack/react-router";
import { Package2, Truck, CheckCircle2, XCircle, Clock, Receipt } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/orders")({
  head: () => ({ meta: [{ title: "Orders — Affiliate Manager" }] }),
  component: OrdersWall,
});

function OrdersWall() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="All orders tied to affiliate-driven sales with fulfillment and invoicing status."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Orders" }]}
        actions={<><Button variant="outline" size="sm">Invoices</Button><Button size="sm">New Order</Button></>}
      />
      <Tabs items={["All", "Pending", "Processing", "Fulfilled", "Cancelled", "Disputed", "Timeline"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Orders" value="0" icon={<Package2 className="size-4" />} tone="primary" />
          <KpiCard label="Processing" value="0" icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="Fulfilled" value="0" icon={<CheckCircle2 className="size-4" />} tone="success" />
          <KpiCard label="Shipped" value="0" icon={<Truck className="size-4" />} />
          <KpiCard label="Cancelled" value="0" icon={<XCircle className="size-4" />} tone="destructive" />
          <KpiCard label="Invoices Issued" value="0" icon={<Receipt className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search orders…" filters={["Status", "Affiliate", "Customer", "Product", "Date"]} />
        <DataTableShell
          columns={[
            { key: "order", label: "Order #" },
            { key: "customer", label: "Customer" },
            { key: "affiliate", label: "Affiliate" },
            { key: "items", label: "Items", align: "right" },
            { key: "total", label: "Total", align: "right" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Package2}
          emptyTitle="No orders yet"
          emptyDescription="Orders attributed to affiliates will appear here with fulfillment timeline."
        />
      </WallShell>
    </>
  );
}
