import { createFileRoute } from "@tanstack/react-router";
import { Package, Sparkles, Tag, TrendingUp, Star, Layers } from "lucide-react";
import { PageHeader } from "@/components/affiliate/PageHeader";
import { KpiCard, KpiGrid } from "@/components/affiliate/KpiCard";
import { WallShell } from "@/components/affiliate/WallShell";
import { FilterBar } from "@/components/affiliate/FilterBar";
import { DataTableShell } from "@/components/affiliate/DataTableShell";
import { Tabs } from "@/components/affiliate/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/affiliate-manager/products")({
  head: () => ({ meta: [{ title: "Products — Affiliate Manager" }] }),
  component: ProductsWall,
});

function ProductsWall() {
  return (
    <>
      <PageHeader
        title="Product Promotion"
        description="Marketplace products, featured products, campaign products, pricing, discount rules and SEO."
        crumbs={[{ label: "Affiliate Manager" }, { label: "Products" }]}
        actions={<><Button variant="outline" size="sm">Discount Rules</Button><Button size="sm">Promote Product</Button></>}
      />
      <Tabs items={["All Products", "Featured", "Campaign", "Pricing", "Discounts", "SEO", "Homepage"]} />
      <WallShell>
        <KpiGrid>
          <KpiCard label="Promoted Products" value="0" icon={<Package className="size-4" />} tone="primary" />
          <KpiCard label="Featured" value="0" icon={<Star className="size-4" />} />
          <KpiCard label="Campaign Linked" value="0" icon={<Sparkles className="size-4" />} />
          <KpiCard label="Active Discounts" value="0" icon={<Tag className="size-4" />} tone="warning" />
          <KpiCard label="Categories" value="0" icon={<Layers className="size-4" />} />
          <KpiCard label="Revenue 30d" value="—" icon={<TrendingUp className="size-4" />} tone="success" />
        </KpiGrid>
        <FilterBar placeholder="Search products…" filters={["Category", "Status", "Campaign", "Price", "Discount"]} />
        <DataTableShell
          columns={[
            { key: "product", label: "Product" },
            { key: "category", label: "Category" },
            { key: "price", label: "Price", align: "right" },
            { key: "discount", label: "Discount", align: "right" },
            { key: "campaign", label: "Campaign" },
            { key: "sales", label: "Sales 30d", align: "right" },
            { key: "status", label: "Status" },
          ]}
          emptyIcon={Package}
          emptyTitle="No products linked"
          emptyDescription="Link marketplace products to promote them through affiliates and campaigns."
          emptyAction={{ label: "Add Product" }}
        />
      </WallShell>
    </>
  );
}
