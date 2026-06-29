import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageCircle, PhoneCall, Mail, BookOpen, Timer } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/support")({
  head: () => ({ meta: [{ title: "Support — Affiliate Manager" }] }),
  component: SupportWall,
});

function SupportWall() {
  return (
    <>
      <PageHeader
        title="Support"
        description="Tickets, live chat, WhatsApp, email, calls, knowledge base, SLA and escalation."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Support" }]}
        actions={<><Button variant="outline" size="sm">SLA Policies</Button><Button size="sm">New Ticket</Button></>}
      />
      <Tabs items={["Tickets", "Live Chat", "Email", "Calls", "Knowledge Base", "Remote Support", "SLA", "Escalations"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Open Tickets" value="0" icon={<LifeBuoy className="size-4" />} tone="warning" />
          <KpiCard label="In Progress" value="0" icon={<Timer className="size-4" />} />
          <KpiCard label="Resolved 30d" value="0" icon={<LifeBuoy className="size-4" />} tone="success" />
          <KpiCard label="Chats" value="0" icon={<MessageCircle className="size-4" />} />
          <KpiCard label="Calls Logged" value="0" icon={<PhoneCall className="size-4" />} />
          <KpiCard label="KB Articles" value="0" icon={<BookOpen className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search tickets…" filters={["Status", "Priority", "Channel", "Assignee", "SLA"]} />
        <DataTableShell
          columns={[
            { key: "ticket", label: "Ticket" },
            { key: "subject", label: "Subject" },
            { key: "affiliate", label: "Affiliate" },
            { key: "priority", label: "Priority" },
            { key: "channel", label: "Channel" },
            { key: "assignee", label: "Assignee" },
            { key: "sla", label: "SLA" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={LifeBuoy}
          emptyTitle="No support tickets"
          emptyDescription="Affiliate-raised tickets across all channels will queue here with SLA tracking."
        />
      </WallShell>
    </>
  );
}
