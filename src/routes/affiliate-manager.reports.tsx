import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText, FileJson, Download, CalendarClock, PieChart } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/reports")({
  head: () => ({ meta: [{ title: "Reports — Affiliate Manager" }] }),
  component: ReportsWall,
});

function ReportsWall() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Affiliate, commission, revenue, sales, campaign, payout and traffic reports. Export PDF, Excel, CSV."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Reports" }]}
        actions={<><Button variant="outline" size="sm" className="gap-1.5"><CalendarClock className="size-3.5" /> Schedule</Button><Button size="sm" className="gap-1.5"><Download className="size-3.5" /> New Report</Button></>}
      />
      <Tabs items={["All Reports", "Scheduled", "Saved", "Templates", "History"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Saved Reports" value="0" icon={<FileText className="size-4" />} tone="primary" />
          <KpiCard label="Scheduled" value="0" icon={<CalendarClock className="size-4" />} />
          <KpiCard label="Generated 30d" value="0" icon={<PieChart className="size-4" />} />
          <KpiCard label="Excel Exports" value="0" icon={<FileSpreadsheet className="size-4" />} />
          <KpiCard label="PDF Exports" value="0" icon={<FileText className="size-4" />} />
          <KpiCard label="CSV/JSON" value="0" icon={<FileJson className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search reports…" filters={["Category", "Owner", "Schedule", "Format", "Date"]} />
        <DataTableShell
          columns={[
            { key: "report", label: "Report" },
            { key: "category", label: "Category" },
            { key: "schedule", label: "Schedule" },
            { key: "format", label: "Format" },
            { key: "owner", label: "Owner" },
            { key: "lastRun", label: "Last Run" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={FileText}
          emptyTitle="No reports yet"
          emptyDescription="Build reusable affiliate, commission, payout and traffic reports — export to PDF, Excel or CSV."
          emptyAction={{ label: "Create Report" }}
        />
      </WallShell>
    </>
  );
}
