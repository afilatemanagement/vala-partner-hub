import { createFileRoute } from "@tanstack/react-router";
import { Activity, MousePointerClick, Eye, TrendingUp, Trophy, Target } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell, TwoCol } from "@/components/affiliate/WallShell";
import { SectionCard } from "@/components/affiliate/StatusBadge";
import { ChartEmpty, EmptyState } from "@/components/affiliate/EmptyState";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/performance")({
  head: () => ({ meta: [{ title: "Performance — Affiliate Manager" }] }),
  component: PerformanceWall,
});

function PerformanceWall() {
  return (
    <>
      <PageHeader
        title="Performance"
        description="Clicks, visitors, conversions, revenue, ROI, CTR, growth and leaderboard."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Performance" }]}
        actions={<><Button variant="outline" size="sm">Last 30 days</Button><Button size="sm">Compare</Button></>}
      />
      <Tabs items={["Overview", "Traffic", "Conversions", "Revenue", "Leaderboard", "Cohorts"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Clicks" value="0" icon={<MousePointerClick className="size-4" />} />
          <KpiCard label="Visitors" value="0" icon={<Eye className="size-4" />} />
          <KpiCard label="Conversions" value="0" icon={<Target className="size-4" />} tone="success" />
          <KpiCard label="CTR" value="—" icon={<Activity className="size-4" />} />
          <KpiCard label="Revenue" value="—" icon={<TrendingUp className="size-4" />} tone="primary" />
          <KpiCard label="ROI" value="—" icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
        <TwoCol>
          <div className="lg:col-span-2">
            <SectionCard title="Performance Trend"><ChartEmpty /></SectionCard>
          </div>
          <SectionCard title="Leaderboard" padded={false}>
            <EmptyState icon={Trophy} title="No performers yet" description="Top affiliates by revenue, conversions and growth will rank here." />
          </SectionCard>
        </TwoCol>
      </WallShell>
    </>
  );
}
