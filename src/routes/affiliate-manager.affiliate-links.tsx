import { createFileRoute } from "@tanstack/react-router";
import { Link2, QrCode, MousePointerClick, TrendingUp, Globe2, ScanLine } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/affiliate-links")({
  head: () => ({ meta: [{ title: "Affiliate Links — Affiliate Manager" }] }),
  component: LinksWall,
});

function LinksWall() {
  return (
    <>
      <PageHeader
        title="Affiliate Links"
        description="Tracking links, deep links, campaign links, short links, QR codes and custom domains."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Affiliate Links" }]}
        actions={<><Button variant="outline" size="sm">Bulk Generate</Button><Button size="sm">Create Link</Button></>}
      />
      <Tabs items={["All Links", "Tracking", "Deep Links", "Campaign", "Short Links", "QR Codes", "Custom Domains"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Links" value="0" icon={<Link2 className="size-4" />} tone="primary" />
          <KpiCard label="Clicks 30d" value="0" icon={<MousePointerClick className="size-4" />} />
          <KpiCard label="Conversions" value="0" icon={<TrendingUp className="size-4" />} tone="success" />
          <KpiCard label="Conversion Rate" value="—" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="QR Scans" value="0" icon={<ScanLine className="size-4" />} />
          <KpiCard label="Custom Domains" value="0" icon={<Globe2 className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search links by slug, destination, affiliate, campaign…" filters={["Type", "Campaign", "Affiliate", "Domain", "Status"]} />
        <DataTableShell
          columns={[
            { key: "link", label: "Link" },
            { key: "affiliate", label: "Affiliate" },
            { key: "campaign", label: "Campaign" },
            { key: "type", label: "Type" },
            { key: "clicks", label: "Clicks", align: "right" },
            { key: "conv", label: "Conversions", align: "right" },
            { key: "rate", label: "CR", align: "right" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={QrCode}
          emptyTitle="No links generated"
          emptyDescription="Tracking, deep, campaign and short links — plus QR codes — will appear here."
          emptyAction={{ label: "Create First Link" }}
        />
      </WallShell>
    </>
  );
}
