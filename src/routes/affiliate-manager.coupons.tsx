import { createFileRoute } from "@tanstack/react-router";
import { Tag, BadgePercent, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/coupons")({
  head: () => ({ meta: [{ title: "Coupons — Affiliate Manager" }] }),
  component: CouponsWall,
});

function CouponsWall() {
  return (
    <>
      <PageHeader
        title="Coupons"
        description="Discount coupons issued to affiliates and customers — usage, expiry and analytics."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Coupons" }]}
        actions={<><Button variant="outline" size="sm">Bulk Generate</Button><Button size="sm">New Coupon</Button></>}
      />
      <Tabs items={["All", "Active", "Scheduled", "Expired", "Disabled"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Coupons" value="0" icon={<Tag className="size-4" />} tone="primary" />
          <KpiCard label="Active" value="0" icon={<BadgePercent className="size-4" />} tone="success" />
          <KpiCard label="Redemptions" value="0" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Expiring Soon" value="0" icon={<Calendar className="size-4" />} tone="warning" />
          <KpiCard label="Discount Value" value="—" icon={<Tag className="size-4" />} />
          <KpiCard label="Conversion Lift" value="—" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search coupons…" filters={["Status", "Discount Type", "Campaign", "Expiry"]} />
        <DataTableShell
          columns={[
            { key: "code", label: "Code" },
            { key: "type", label: "Discount" },
            { key: "value", label: "Value", align: "right" },
            { key: "usage", label: "Usage", align: "right" },
            { key: "expiry", label: "Expiry" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Tag}
          emptyTitle="No coupons yet"
          emptyDescription="Create or bulk-generate coupons and track redemptions per affiliate."
          emptyAction={{ label: "New Coupon" }}
        />
      </WallShell>
    </>
  );
}
