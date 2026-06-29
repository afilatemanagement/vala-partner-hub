import { createFileRoute } from "@tanstack/react-router";
import { Network, GitBranch, Layers, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell, TwoCol } from "@/components/affiliate/WallShell";
import { SectionCard } from "@/components/affiliate/StatusBadge";
import { ChartEmpty, EmptyState } from "@/components/affiliate/EmptyState";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/referral-network")({
  head: () => ({ meta: [{ title: "Referral Network — Affiliate Manager" }] }),
  component: ReferralNetworkWall,
});

function ReferralNetworkWall() {
  return (
    <>
      <PageHeader
        title="Referral Network"
        description="Multi-level referral tree, parent/child relationships, commission levels, growth and expansion."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Referral Network" }]}
        actions={<><Button variant="outline" size="sm">Level Rules</Button><Button size="sm">Configure Network</Button></>}
      />
      <Tabs items={["Network Tree", "Levels", "Commission Levels", "Growth", "Expansion", "Analytics"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Network Nodes" value="0" icon={<Network className="size-4" />} tone="primary" />
          <KpiCard label="Active Levels" value="0" icon={<Layers className="size-4" />} />
          <KpiCard label="Top-Level Parents" value="0" icon={<GitBranch className="size-4" />} />
          <KpiCard label="Avg Depth" value="—" icon={<Layers className="size-4" />} />
          <KpiCard label="Network Growth 30d" value="0" icon={<TrendingUp className="size-4" />} tone="success" />
          <KpiCard label="Commission Levels" value="0" icon={<Layers className="size-4" />} />
        </KpiGrid>
        <TwoCol>
          <div className="lg:col-span-2">
            <SectionCard title="Referral Tree">
              <ChartEmpty label="Interactive parent → child referral tree appears once affiliates begin referring" />
            </SectionCard>
          </div>
          <SectionCard title="Network Health" padded={false}>
            <EmptyState icon={Network} title="No network activity" description="Network depth, fan-out and commission flow will surface here." />
          </SectionCard>
        </TwoCol>
      </WallShell>
    </>
  );
}
