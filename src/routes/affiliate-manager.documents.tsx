import { createFileRoute } from "@tanstack/react-router";
import { FileText, FileSignature, ReceiptText, Award, FileBadge, History } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/documents")({
  head: () => ({ meta: [{ title: "Documents — Affiliate Manager" }] }),
  component: DocumentsWall,
});

function DocumentsWall() {
  return (
    <>
      <PageHeader
        title="Documents"
        description="Affiliate agreements, NDAs, invoices, certificates, tax and KYC documents."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Documents" }]}
        actions={<><Button variant="outline" size="sm">Templates</Button><Button size="sm">Upload</Button></>}
      />
      <Tabs items={["All", "Agreements", "NDA", "Invoices", "Certificates", "Tax", "KYC", "Version History"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Documents" value="0" icon={<FileText className="size-4" />} tone="primary" />
          <KpiCard label="Agreements" value="0" icon={<FileSignature className="size-4" />} />
          <KpiCard label="Invoices" value="0" icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Certificates" value="0" icon={<Award className="size-4" />} />
          <KpiCard label="KYC Files" value="0" icon={<FileBadge className="size-4" />} />
          <KpiCard label="Revisions" value="0" icon={<History className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search documents…" filters={["Type", "Affiliate", "Status", "Signed", "Date"]} />
        <DataTableShell
          columns={[
            { key: "name", label: "Document" },
            { key: "type", label: "Type" },
            { key: "affiliate", label: "Affiliate" },
            { key: "version", label: "Version", align: "right" },
            { key: "signed", label: "Signed" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={FileText}
          emptyTitle="No documents yet"
          emptyDescription="Agreements, NDAs, tax forms and certificates with digital signatures will appear here."
        />
      </WallShell>
    </>
  );
}
