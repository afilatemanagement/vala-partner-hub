import { createFileRoute } from "@tanstack/react-router";
import { Users, BadgeCheck, ShieldAlert, Globe2, TrendingUp, PauseCircle } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/affiliates")({
  head: () => ({ meta: [{ title: "Affiliates — Affiliate Manager" }] }),
  component: AffiliatesWall,
});

function AffiliatesWall() {
  return (
    <>
      <PageHeader
        title="Affiliate Directory"
        description="Every affiliate, referral partner and sales partner across every country and category."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Affiliates" }]}
        actions={
          <>
            <Button variant="outline" size="sm">Bulk Actions</Button>
            <Button size="sm">Add Affiliate</Button>
          </>
        }
      />
      <Tabs items={["All", "Verified", "Pending", "Suspended", "Top Performers", "At Risk", "Segments"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Affiliates" value="0" icon={<Users className="size-4" />} tone="primary" />
          <KpiCard label="Verified" value="0" icon={<BadgeCheck className="size-4" />} tone="success" />
          <KpiCard label="At Risk" value="0" icon={<ShieldAlert className="size-4" />} tone="warning" />
          <KpiCard label="Suspended" value="0" icon={<PauseCircle className="size-4" />} tone="destructive" />
          <KpiCard label="Countries" value="0" icon={<Globe2 className="size-4" />} />
          <KpiCard label="Active 30d" value="0" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search affiliates by name, email, code, country…" filters={["Status", "Country", "Category", "Tier", "Health", "Risk"]} />
        <DataTableShell
          columns={[
            { key: "affiliate", label: "Affiliate" },
            { key: "location", label: "Location" },
            { key: "category", label: "Category" },
            { key: "sales", label: "Sales", align: "right" },
            { key: "revenue", label: "Revenue", align: "right" },
            { key: "commission", label: "Commission", align: "right" },
            { key: "health", label: "Health" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Users}
          emptyTitle="No affiliates yet"
          emptyDescription="Once approved, affiliates appear here with performance, health score and risk."
          emptyAction={{ label: "Add Affiliate" }}
        />
      </WallShell>
    </>
  );
}
