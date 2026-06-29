import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, BadgeCheck, Banknote, Coins, Download, Globe2, Link2, Megaphone,
  ShoppingBag, TrendingUp, UserCheck, Users, Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell, TwoCol } from "@/components/affiliate/WallShell";
import { SectionCard } from "@/components/affiliate/StatusBadge";
import { ChartEmpty, EmptyState } from "@/components/affiliate/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/")({
  head: () => ({
    meta: [{ title: "Dashboard — Affiliate Manager" }],
  }),
  component: DashboardWall,
});

function DashboardWall() {
  return (
    <>
      <PageHeader
        title="Global Affiliate Overview"
        description="Realtime control center for every affiliate, referral, campaign, commission and payout across Software Vala."
        crumbs={[{ label: "Boss Panel" }, { label: "Affiliate Manager" }, { label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="size-3.5" /> Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Megaphone className="size-3.5" /> Launch Campaign
            </Button>
          </>
        }
      />

      <WallShell>
        <KpiGrid>
          <KpiCard label="Total Affiliates" value="0" hint="Verified · Pending · Suspended" icon={<Users className="size-4" />} tone="primary" />
          <KpiCard label="Verified" value="0" hint="KYC approved" icon={<BadgeCheck className="size-4" />} tone="success" />
          <KpiCard label="Countries" value="0" hint="Active regions" icon={<Globe2 className="size-4" />} />
          <KpiCard label="Referral Links" value="0" hint="All time" icon={<Link2 className="size-4" />} />
          <KpiCard label="Leads Generated" value="0" hint="Last 30 days" icon={<UserCheck className="size-4" />} />
          <KpiCard label="Customers Acquired" value="0" hint="Last 30 days" icon={<ShoppingBag className="size-4" />} />
          <KpiCard label="Sales" value="0" hint="Completed orders" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Revenue" value="—" hint="Gross, last 30 days" icon={<Coins className="size-4" />} />
          <KpiCard label="Commission Earned" value="—" hint="Approved" icon={<Banknote className="size-4" />} />
          <KpiCard label="Wallet Balance" value="—" hint="Across all wallets" icon={<Wallet className="size-4" />} />
          <KpiCard label="Pending Payouts" value="—" hint="Awaiting settlement" icon={<Wallet className="size-4" />} tone="warning" />
          <KpiCard label="Active Campaigns" value="0" hint="Running now" icon={<Megaphone className="size-4" />} />
        </KpiGrid>

        <TwoCol>
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Revenue & Commission" action={<Button variant="ghost" size="sm">Last 30 days</Button>}>
              <ChartEmpty label="Revenue / commission trend appears once orders flow in" />
            </SectionCard>
            <SectionCard title="Global Affiliate Map" action={<Button variant="ghost" size="sm">All regions</Button>}>
              <ChartEmpty label="Country distribution map appears once affiliates onboard" />
            </SectionCard>
          </div>
          <div className="space-y-4">
            <SectionCard title="Top Affiliates" action={<Button variant="ghost" size="sm">View all</Button>} padded={false}>
              <EmptyState icon={Users} title="No affiliates yet" description="Top performers will rank here by revenue, conversions and commission earned." />
            </SectionCard>
            <SectionCard title="Live Activity" action={<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><span className="size-1.5 rounded-full bg-success" /> Live</span>} padded={false}>
              <EmptyState icon={Activity} title="Quiet on the wire" description="Clicks, signups, sales and payouts will stream in here in realtime." />
            </SectionCard>
            <SectionCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-2">
                {["Approve KYC", "Create Campaign", "Issue Payout", "Generate Codes", "Broadcast", "New Affiliate"].map((a) => (
                  <Button key={a} variant="outline" size="sm" className="justify-start">{a}</Button>
                ))}
              </div>
            </SectionCard>
          </div>
        </TwoCol>
      </WallShell>
    </>
  );
}
