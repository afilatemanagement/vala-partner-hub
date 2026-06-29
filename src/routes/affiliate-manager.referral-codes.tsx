import { createFileRoute } from "@tanstack/react-router";
import { Ticket, BadgePercent, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/referral-codes")({
  head: () => ({ meta: [{ title: "Referral Codes — Affiliate Manager" }] }),
  component: CodesWall,
});

function CodesWall() {
  return (
    <>
      <PageHeader
        title="Referral Codes"
        description="Coupon codes, referral codes and campaign codes with usage, expiry and analytics."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Referral Codes" }]}
        actions={<><Button variant="outline" size="sm">Bulk Generate</Button><Button size="sm">New Code</Button></>}
      />
      <Tabs items={["All Codes", "Referral", "Coupon", "Campaign", "Expired", "Disabled"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Codes" value="0" icon={<Ticket className="size-4" />} tone="primary" />
          <KpiCard label="Active" value="0" icon={<BadgePercent className="size-4" />} tone="success" />
          <KpiCard label="Redemptions 30d" value="0" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Expiring Soon" value="0" icon={<Calendar className="size-4" />} tone="warning" />
          <KpiCard label="Expired" value="0" icon={<Calendar className="size-4" />} />
          <KpiCard label="Conversion Rate" value="—" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search codes…" filters={["Type", "Affiliate", "Campaign", "Status", "Expiry"]} />
        <DataTableShell
          columns={[
            { key: "code", label: "Code" },
            { key: "type", label: "Type" },
            { key: "affiliate", label: "Owner" },
            { key: "campaign", label: "Campaign" },
            { key: "usage", label: "Usage", align: "right" },
            { key: "expiry", label: "Expiry" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Ticket}
          emptyTitle="No referral codes"
          emptyDescription="Generate referral, coupon and campaign codes individually or in bulk."
          emptyAction={{ label: "Generate Codes" }}
        />
      </WallShell>
    </>
  );
}
