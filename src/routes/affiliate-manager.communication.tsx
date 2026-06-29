import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Mail, MessageSquare, Bell, CalendarClock, MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/communication")({
  head: () => ({ meta: [{ title: "Communication — Affiliate Manager" }] }),
  component: CommunicationWall,
});

function CommunicationWall() {
  return (
    <>
      <PageHeader
        title="Communication"
        description="Announcements, broadcasts, email, SMS, WhatsApp, push, meetings and internal chat."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Communication" }]}
        actions={<><Button variant="outline" size="sm">Schedule</Button><Button size="sm">Broadcast</Button></>}
      />
      <Tabs items={["Inbox", "Announcements", "Broadcasts", "Meetings", "Internal Chat", "Logs"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Announcements" value="0" icon={<Megaphone className="size-4" />} tone="primary" />
          <KpiCard label="Broadcasts 30d" value="0" icon={<MessagesSquare className="size-4" />} />
          <KpiCard label="Emails Sent" value="0" icon={<Mail className="size-4" />} />
          <KpiCard label="SMS/WhatsApp" value="0" icon={<MessageSquare className="size-4" />} />
          <KpiCard label="Push Sent" value="0" icon={<Bell className="size-4" />} />
          <KpiCard label="Meetings" value="0" icon={<CalendarClock className="size-4" />} />
        </KpiGrid>
        <FilterBar placeholder="Search messages…" filters={["Channel", "Audience", "Owner", "Date"]} />
        <DataTableShell
          columns={[
            { key: "subject", label: "Subject" },
            { key: "channel", label: "Channel" },
            { key: "audience", label: "Audience" },
            { key: "sent", label: "Sent", align: "right" },
            { key: "delivered", label: "Delivered", align: "right" },
            { key: "by", label: "By" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Megaphone}
          emptyTitle="No communications yet"
          emptyDescription="Announcements, broadcasts and direct messages will be logged here."
        />
      </WallShell>
    </>
  );
}
