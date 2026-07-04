import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { TopBar } from "@/components/affiliate/TopBar";
import { useAffiliateRealtimeSync } from "@/lib/affiliate-realtime";
import { permissionForPath, usePermissions } from "@/lib/affiliate-permissions";
import { PermissionGate } from "@/components/affiliate/PermissionGate";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useAffiliateRealtimeSync(!!perms?.is_boss);
  const required = permissionForPath(pathname);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-[1600px]">
        {required ? (
          <div className="p-4 lg:p-6">
            <PermissionGate permission={required}>
              <Outlet />
            </PermissionGate>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
