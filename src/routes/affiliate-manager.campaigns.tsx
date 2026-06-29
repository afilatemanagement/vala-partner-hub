import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Wallet, Users, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/campaigns")({
  head: () => ({ meta: [{ title: "Campaigns — Affiliate Manager" }] }),
  component: CampaignsWall,
});

function CampaignsWall() {
  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Create, assign, budget, schedule and approve product and partner campaigns."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Campaigns" }]}
        actions={<><Button variant="outline" size="sm">Templates</Button><Button size="sm">Create Campaign</Button></>}
      />
      <Tabs items={["All", "Live", "Scheduled", "Pending Approval", "Paused", "Ended", "Drafts"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="All Campaigns" value="0" icon={<Megaphone className="size-4" />} tone="primary" />
          <KpiCard label="Live" value="0" icon={<CheckCircle2 className="size-4" />} tone="success" />
          <KpiCard label="Scheduled" value="0" icon={<Calendar className="size-4" />} />
          <KpiCard label="Affiliates Assigned" value="0" icon={<Users className="size-4" />} />
          <KpiCard label="Budget Allocated" value="—" icon={<Wallet className="size-4" />} />
          <KpiCard label="Revenue Generated" value="—" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search campaigns…" filters={["Status", "Product", "Owner", "Budget", "Timeline"]} />
        <DataTableShell
          columns={[
            { key: "campaign", label: "Campaign" },
            { key: "owner", label: "Owner" },
            { key: "products", label: "Products" },
            { key: "budget", label: "Budget", align: "right" },
            { key: "affiliates", label: "Affiliates", align: "right" },
            { key: "revenue", label: "Revenue", align: "right" },
            { key: "timeline", label: "Timeline" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Megaphone}
          emptyTitle="No campaigns yet"
          emptyDescription="Launch a campaign, assign products and affiliates, set budgets and approval flow."
          emptyAction={{ label: "Create Campaign" }}
        />
      </WallShell>
    </>
  );
}
