import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, PhoneCall, CalendarClock, TrendingUp, Filter, GitMerge } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/leads")({
  head: () => ({ meta: [{ title: "Leads — Affiliate Manager" }] }),
  component: LeadsWall,
});

function LeadsWall() {
  return (
    <>
      <PageHeader
        title="Lead Management"
        description="Lead sources, assignment, follow-ups, meetings, calls, pipeline and conversion."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Leads" }]}
        actions={<><Button variant="outline" size="sm">Pipeline View</Button><Button size="sm">Add Lead</Button></>}
      />
      <Tabs items={["All", "New", "Contacted", "Qualified", "Meeting", "Won", "Lost", "Sources"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Leads" value="0" icon={<UserCheck className="size-4" />} tone="primary" />
          <KpiCard label="New 7d" value="0" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Follow-ups Due" value="0" icon={<PhoneCall className="size-4" />} tone="warning" />
          <KpiCard label="Meetings Scheduled" value="0" icon={<CalendarClock className="size-4" />} />
          <KpiCard label="Converted" value="0" icon={<GitMerge className="size-4" />} tone="success" />
          <KpiCard label="Conversion Rate" value="—" icon={<Filter className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search leads…" filters={["Stage", "Source", "Owner", "Affiliate", "Country", "Date"]} />
        <DataTableShell
          columns={[
            { key: "lead", label: "Lead" },
            { key: "source", label: "Source" },
            { key: "affiliate", label: "Referred By" },
            { key: "stage", label: "Stage" },
            { key: "owner", label: "Owner" },
            { key: "next", label: "Next Step" },
            { key: "updated", label: "Updated" },
          ]}
          emptyIcon={UserCheck}
          emptyTitle="No leads yet"
          emptyDescription="Inbound leads from affiliates, campaigns and links will appear in the pipeline here."
          emptyAction={{ label: "Add Lead" }}
        />
      </WallShell>
    </>
  );
}
