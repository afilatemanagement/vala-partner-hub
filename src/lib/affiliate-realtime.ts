import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PayloadRecord = Record<string, unknown> & { id?: string; status?: string };

const INVALIDATE_KEYS: Record<string, string[][]> = {
  affiliates: [["affiliate", "list"], ["affiliate", "dashboard"], ["affiliate", "top"]],
  commissions: [["affiliate", "commissions"], ["affiliate", "dashboard"]],
  wallets: [["affiliate", "wallets"], ["affiliate", "dashboard"]],
  payouts: [["affiliate", "payouts"], ["affiliate", "dashboard"]],
  activity_log: [["affiliate", "activity"], ["affiliate", "dashboard"]],
};

/**
 * Mounts a single realtime bridge that syncs affiliate status, commission,
 * wallet, payout, and activity changes across every open workspace. It
 * invalidates the matching TanStack Query cache keys and surfaces a toast
 * so operators see cross-wall updates the moment they land.
 */
export function useAffiliateRealtimeSync(enabled: boolean) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel("affiliate-live-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "affiliates" }, (p) =>
        handle("affiliates", p, qc),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "commissions" }, (p) =>
        handle("commissions", p, qc),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, (p) =>
        handle("wallets", p, qc),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "payouts" }, (p) =>
        handle("payouts", p, qc),
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (p) =>
        handle("activity_log", p, qc),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, qc]);
}

function handle(
  table: keyof typeof INVALIDATE_KEYS,
  payload: { eventType: string; new: PayloadRecord | null; old: PayloadRecord | null },
  qc: ReturnType<typeof useQueryClient>,
) {
  for (const key of INVALIDATE_KEYS[table] ?? []) {
    qc.invalidateQueries({ queryKey: key });
  }
  const rec = (payload.new ?? payload.old) as PayloadRecord | null;
  const label = describe(table, payload.eventType, rec);
  if (label) toast(label.title, { description: label.body });
}

function describe(
  table: string,
  event: string,
  rec: PayloadRecord | null,
): { title: string; body?: string } | null {
  if (!rec) return null;
  const short = typeof rec.id === "string" ? rec.id.slice(0, 8) : "";
  switch (table) {
    case "affiliates":
      return event === "UPDATE"
        ? { title: "Affiliate status updated", body: `${short} → ${rec.status ?? "changed"}` }
        : event === "INSERT"
        ? { title: "New affiliate joined", body: short }
        : null;
    case "commissions":
      return { title: `Commission ${event.toLowerCase()}d`, body: short };
    case "wallets":
      return { title: "Wallet transaction", body: short };
    case "payouts":
      return { title: `Payout ${event.toLowerCase()}d`, body: short };
    case "activity_log":
      return { title: "New activity", body: short };
    default:
      return null;
  }
}
