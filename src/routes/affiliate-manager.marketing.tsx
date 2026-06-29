import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, ImageIcon, Workflow, LayoutTemplate } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/marketing")({
  head: () => ({ meta: [{ title: "Marketing — Affiliate Manager" }] }),
  component: MarketingWall,
});

function MarketingWall() {
  return (
    <>
      <PageHeader
        title="Marketing"
        description="Email, SMS, WhatsApp, push, landing pages, banners, creatives and automation."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Marketing" }]}
        actions={<><Button variant="outline" size="sm">Templates</Button><Button size="sm">New Campaign</Button></>}
      />
      <Tabs items={["Campaigns", "Email", "SMS", "WhatsApp", "Push", "Landing Pages", "Banners", "Creatives", "Automation"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Active Campaigns" value="0" icon={<Mail className="size-4" />} tone="primary" />
          <KpiCard label="Messages Sent 30d" value="0" icon={<MessageSquare className="size-4" />} />
          <KpiCard label="Push Subscribers" value="0" icon={<Bell className="size-4" />} />
          <KpiCard label="Landing Pages" value="0" icon={<LayoutTemplate className="size-4" />} />
          <KpiCard label="Creative Assets" value="0" icon={<ImageIcon className="size-4" />} />
          <KpiCard label="Automations" value="0" icon={<Workflow className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search marketing assets…" filters={["Channel", "Status", "Owner", "Audience", "Date"]} />
        <DataTableShell
          columns={[
            { key: "name", label: "Asset" },
            { key: "channel", label: "Channel" },
            { key: "audience", label: "Audience" },
            { key: "sent", label: "Sent", align: "right" },
            { key: "open", label: "Open Rate", align: "right" },
            { key: "ctr", label: "CTR", align: "right" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Mail}
          emptyTitle="No marketing assets"
          emptyDescription="Create email, SMS, WhatsApp and push campaigns — plus landing pages and banners — here."
          emptyAction={{ label: "Create Campaign" }}
        />
      </WallShell>
    </>
  );
}
