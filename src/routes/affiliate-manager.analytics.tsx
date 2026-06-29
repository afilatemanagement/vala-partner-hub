import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Banknote, Globe2, BarChart3, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell, TwoCol } from "@/components/affiliate/WallShell";
import { SectionCard } from "@/components/affiliate/StatusBadge";
import { ChartEmpty, EmptyState } from "@/components/affiliate/EmptyState";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Affiliate Manager" }] }),
  component: AnalyticsWall,
});

function AnalyticsWall() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Revenue, commission, campaign, affiliate, sales, traffic, country, growth and AI forecasts."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Analytics" }]}
        actions={<><Button variant="outline" size="sm">Last 30 days</Button><Button size="sm">AI Insights</Button></>}
      />
      <Tabs items={["Overview", "Revenue", "Commission", "Campaigns", "Affiliates", "Traffic", "Country", "Forecast", "AI Insights"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Revenue 30d" value="—" icon={<TrendingUp className="size-4" />} tone="success" />
          <KpiCard label="Commission 30d" value="—" icon={<Banknote className="size-4" />} tone="primary" />
          <KpiCard label="Active Affiliates" value="0" icon={<Users className="size-4" />} />
          <KpiCard label="Countries" value="0" icon={<Globe2 className="size-4" />} />
          <KpiCard label="Forecast Accuracy" value="—" icon={<BarChart3 className="size-4" />} />
          <KpiCard label="AI Anomalies" value="0" icon={<Sparkles className="size-4" />} tone="warning" />
        </KpiGrid>
        <TwoCol>
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Revenue & Commission Trend"><ChartEmpty /></SectionCard>
            <SectionCard title="Country Performance"><ChartEmpty /></SectionCard>
          </div>
          <div className="space-y-4">
            <SectionCard title="Growth Forecast" padded={false}>
              <EmptyState icon={TrendingUp} title="Awaiting data" description="Forecasts and growth projections appear once historical data is available." />
            </SectionCard>
            <SectionCard title="AI Insights" padded={false}>
              <EmptyState icon={Sparkles} title="No insights yet" description="AI surfaces opportunities, anomalies and risks as data flows in." />
            </SectionCard>
          </div>
        </TwoCol>
      </WallShell>
    </>
  );
}
