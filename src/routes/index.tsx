import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala — Boss Panel" },
      { name: "description", content: "Enterprise control center for Software Vala." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
        <div className="grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="size-5" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Software Vala — Boss Panel
        </h1>
        <p className="mt-2 max-w-xl text-center text-sm text-muted-foreground">
          This sandbox hosts the Affiliate Manager child module. In production it is launched from
          the existing Boss Panel navigation.
        </p>
        <Link
          to="/affiliate-manager"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open Affiliate Manager <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
