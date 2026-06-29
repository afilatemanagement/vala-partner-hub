import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ShieldAlert, FileBadge, Scale, ScrollText, BadgeAlert } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Affiliate Manager" }] }),
  component: ComplianceWall,
});

function ComplianceWall() {
  return (
    <>
      <PageHeader
        title="Compliance"
        description="Identity, tax, KYC, anti-fraud, risk alerts, policy compliance, audit logs and legal."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Compliance" }]}
        actions={<><Button variant="outline" size="sm">Policies</Button><Button size="sm">Run Audit</Button></>}
      />
      <Tabs items={["Overview", "Identity", "Tax", "KYC", "Anti-Fraud", "Risk Alerts", "Policies", "Audit Logs", "Legal"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="KYC Verified" value="0" icon={<ShieldCheck className="size-4" />} tone="success" />
          <KpiCard label="KYC Pending" value="0" icon={<FileBadge className="size-4" />} tone="warning" />
          <KpiCard label="Risk Alerts" value="0" icon={<ShieldAlert className="size-4" />} tone="destructive" />
          <KpiCard label="Policy Breaches" value="0" icon={<BadgeAlert className="size-4" />} />
          <KpiCard label="Audit Events" value="0" icon={<ScrollText className="size-4" />} />
          <KpiCard label="Legal Cases" value="0" icon={<Scale className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search compliance events…" filters={["Type", "Severity", "Affiliate", "Country", "Date"]} />
        <DataTableShell
          columns={[
            { key: "event", label: "Event" },
            { key: "type", label: "Type" },
            { key: "affiliate", label: "Affiliate" },
            { key: "severity", label: "Severity" },
            { key: "detected", label: "Detected" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={ShieldCheck}
          emptyTitle="No compliance alerts"
          emptyDescription="Identity, KYC, tax, fraud and policy events surface here with full audit trail."
        />
      </WallShell>
    </>
  );
}
