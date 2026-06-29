import { createFileRoute } from "@tanstack/react-router";
import { Store, Star, TrendingUp, Layers, Globe2, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — Affiliate Manager" }] }),
  component: MarketplaceWall,
});

function MarketplaceWall() {
  return (
    <>
      <PageHeader
        title="Marketplace"
        description="Software Vala marketplace catalog — listings, featured slots, performance and approvals."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Marketplace" }]}
        actions={<><Button variant="outline" size="sm">Featured Slots</Button><Button size="sm">List Item</Button></>}
      />
      <Tabs items={["All Listings", "Featured", "New", "Top Selling", "Pending Approval", "Categories"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Listings" value="0" icon={<Store className="size-4" />} tone="primary" />
          <KpiCard label="Featured" value="0" icon={<Star className="size-4" />} />
          <KpiCard label="Approved" value="0" icon={<BadgeCheck className="size-4" />} tone="success" />
          <KpiCard label="Categories" value="0" icon={<Layers className="size-4" />} />
          <KpiCard label="Countries" value="0" icon={<Globe2 className="size-4" />} />
          <KpiCard label="GMV 30d" value="—" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search marketplace…" filters={["Category", "Country", "Featured", "Status"]} />
        <DataTableShell
          columns={[
            { key: "listing", label: "Listing" },
            { key: "category", label: "Category" },
            { key: "price", label: "Price", align: "right" },
            { key: "sales", label: "Sales", align: "right" },
            { key: "rating", label: "Rating", align: "right" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Store}
          emptyTitle="No marketplace items"
          emptyDescription="Marketplace listings synced from the main catalog will appear here."
        />
      </WallShell>
    </>
  );
}
