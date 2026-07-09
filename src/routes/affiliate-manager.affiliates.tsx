import { createFileRoute } from "@tanstack/react-router";
import { Users, BadgeCheck, ShieldAlert, PauseCircle, Globe2 } from "lucide-react";
import { EntityWall, Row, Cell, StatusCell } from "@/components/affiliate/EntityWall";

type Affiliate = {
  id: string; display_name: string; email: string | null; code: string | null;
  country: string | null; status: string; health_score: number | null; risk_score: number | null;
};

export const Route = createFileRoute("/affiliate-manager/affiliates")({
  head: () => ({ meta: [{ title: "Affiliates — Affiliate Manager" }] }),
  component: () => (
    <EntityWall<Affiliate>
      title="Affiliate Directory"
      description="Every affiliate, referral partner and sales partner across every country and category."
      crumbLabel="Affiliates"
      table="affiliates"
      searchColumns={["display_name", "email", "code", "country"]}
      searchPlaceholder="Search affiliates by name, email, code, country…"
      filters={["Status", "Country", "Category", "Tier", "Health", "Risk"]}
      tabs={["All", "Verified", "Pending", "Suspended", "Top Performers", "At Risk"]}
      kpis={[
        { label: "Total", icon: <Users className="size-4" />, tone: "primary" },
        { label: "Verified", icon: <BadgeCheck className="size-4" />, tone: "success", filter: [{ column: "status", value: "verified" }] },
        { label: "Pending", tone: "warning", filter: [{ column: "status", value: "pending" }] },
        { label: "Suspended", icon: <PauseCircle className="size-4" />, tone: "destructive", filter: [{ column: "status", value: "suspended" }] },
        { label: "At Risk", icon: <ShieldAlert className="size-4" />, tone: "warning", filter: [{ column: "risk_score", op: "gte", value: 70 }] },
        { label: "Countries", icon: <Globe2 className="size-4" /> },
      ]}
      columns={[
        { key: "affiliate", label: "Affiliate" },
        { key: "code", label: "Code" },
        { key: "country", label: "Country" },
        { key: "health", label: "Health", align: "right" },
        { key: "risk", label: "Risk", align: "right" },
        { key: "status", label: "Status" },
      ]}
      renderRow={(a) => (
        <Row id={a.id}>
          <Cell><div className="font-medium">{a.display_name}</div><div className="text-[11px] text-muted-foreground">{a.email ?? "—"}</div></Cell>
          <Cell className="font-mono text-[12px]">{a.code ?? "—"}</Cell>
          <Cell>{a.country ?? "—"}</Cell>
          <Cell align="right" className="tabular-nums">{a.health_score ?? "—"}</Cell>
          <Cell align="right" className="tabular-nums">{a.risk_score ?? "—"}</Cell>
          <Cell><StatusCell value={a.status} /></Cell>
        </Row>
      )}
      emptyIcon={Users}
      emptyTitle="No affiliates yet"
      emptyDescription="Approved affiliates appear here with performance, health, and risk."
      primaryActionLabel="Add Affiliate"
    />
  ),
});
