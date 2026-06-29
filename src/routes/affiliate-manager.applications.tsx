import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, FileCheck2, ShieldAlert, Clock, BadgeCheck, XCircle } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/applications")({
  head: () => ({ meta: [{ title: "Applications — Affiliate Manager" }] }),
  component: ApplicationsWall,
});

function ApplicationsWall() {
  return (
    <>
      <PageHeader
        title="Affiliate Applications"
        description="Registration, KYC, document verification, agreements, risk assessment and approval workflow."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Applications" }]}
        actions={
          <>
            <Button variant="outline" size="sm">Approval Rules</Button>
            <Button size="sm">New Application</Button>
          </>
        }
      />
      <Tabs items={["All", "Pending Review", "KYC In Progress", "Awaiting Agreement", "Approved", "Rejected", "Audit Timeline"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total" value="0" icon={<ClipboardList className="size-4" />} />
          <KpiCard label="Pending" value="0" icon={<Clock className="size-4" />} tone="warning" />
          <KpiCard label="KYC Verified" value="0" icon={<FileCheck2 className="size-4" />} tone="success" />
          <KpiCard label="Approved" value="0" icon={<BadgeCheck className="size-4" />} tone="primary" />
          <KpiCard label="Risk Flagged" value="0" icon={<ShieldAlert className="size-4" />} tone="destructive" />
          <KpiCard label="Rejected" value="0" icon={<XCircle className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search applicants by name, email, country…" filters={["Stage", "KYC Status", "Country", "Risk", "Submitted"]} />
        <DataTableShell
          columns={[
            { key: "applicant", label: "Applicant" },
            { key: "country", label: "Country" },
            { key: "stage", label: "Stage" },
            { key: "kyc", label: "KYC" },
            { key: "risk", label: "Risk" },
            { key: "submitted", label: "Submitted" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={ClipboardList}
          emptyTitle="No applications yet"
          emptyDescription="New affiliate applications appear here for review, KYC, and approval."
          emptyAction={{ label: "Invite Applicants" }}
        />
      </WallShell>
    </>
  );
}
