import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopBar } from "@/components/affiliate/TopBar";
import { useAffiliateRealtimeSync } from "@/lib/affiliate-realtime";
import { usePermissions } from "@/lib/affiliate-permissions";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/affiliate-manager")({
  head: () => ({
    meta: [
      { title: "Affiliate Manager — Software Vala Boss Panel" },
      { name: "description", content: "Global affiliate, referral, commission and payout control center." },
    ],
  }),
  component: AffiliateManagerLayout,
});

function AffiliateManagerLayout() {
  const { data: perms } = usePermissions();
  useAffiliateRealtimeSync(!!perms?.is_boss);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-[1600px]">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
