import { describe, it, expect, beforeEach, vi } from "vitest";

// In-memory capture of supabase writes so we can assert exactly one
// activity_log event is emitted per row-action helper.
type Insert = { table: string; rows: unknown };
type Update = { table: string; patch: Record<string, unknown>; id?: string };

const inserts: Insert[] = [];
const updates: Update[] = [];

vi.mock("@/integrations/supabase/client", () => {
  const from = (table: string) => {
    const chain = {
      insert(rows: unknown) {
        inserts.push({ table, rows });
        return Promise.resolve({ error: null, data: null });
      },
      update(patch: Record<string, unknown>) {
        const rec: Update = { table, patch };
        updates.push(rec);
        return {
          eq(_col: string, id: string) {
            rec.id = id;
            return Promise.resolve({ error: null, data: null });
          },
        };
      },
    };
    return chain;
  };
  return {
    supabase: {
      from,
      auth: {
        getSession: () =>
          Promise.resolve({ data: { session: { user: { id: "tester" } } } }),
      },
    },
  };
});

import {
  activateAffiliate,
  deactivateAffiliate,
  setAffiliateStatus,
  updateCommission,
  updateWallet,
  updatePayout,
} from "../affiliate-row-actions";

beforeEach(() => {
  inserts.length = 0;
  updates.length = 0;
});

function auditRows() {
  return inserts.filter((i) => i.table === "activity_log");
}

describe("row-action audit integration", () => {
  it("activateAffiliate writes 1 update + 1 activity_log event", async () => {
    await activateAffiliate("aff-1");
    expect(updates).toEqual([
      { table: "affiliates", patch: { status: "verified" }, id: "aff-1" },
    ]);
    const audits = auditRows();
    expect(audits).toHaveLength(1);
    const row = (audits[0].rows as { action: string; entity: string; metadata: Record<string, unknown> });
    expect(row.action).toBe("affiliate.activate");
    expect(row.entity).toBe("aff-1");
    expect(row.metadata.status).toBe("verified");
    expect(row.metadata.entity).toBe("affiliate");
  });

  it("deactivateAffiliate writes 1 update + 1 activity_log event", async () => {
    await deactivateAffiliate("aff-2", "policy");
    expect(updates).toHaveLength(1);
    expect(updates[0].patch).toEqual({ status: "suspended" });
    const audits = auditRows();
    expect(audits).toHaveLength(1);
    expect((audits[0].rows as { action: string }).action).toBe("affiliate.deactivate");
    expect((audits[0].rows as { metadata: { reason?: string } }).metadata.reason).toBe("policy");
  });

  it("setAffiliateStatus writes exactly one audit event per call", async () => {
    await setAffiliateStatus("aff-3", "pending");
    await setAffiliateStatus("aff-3", "verified");
    expect(updates).toHaveLength(2);
    const audits = auditRows();
    expect(audits).toHaveLength(2);
    expect(audits.map((a) => (a.rows as { action: string }).action)).toEqual([
      "affiliate.status_change",
      "affiliate.status_change",
    ]);
  });

  it("updateCommission writes 1 update + 1 activity_log event", async () => {
    await updateCommission("c-1", { status: "approved", amount_cents: 500 });
    expect(updates).toEqual([
      { table: "commissions", patch: { status: "approved", amount_cents: 500 }, id: "c-1" },
    ]);
    const audits = auditRows();
    expect(audits).toHaveLength(1);
    expect((audits[0].rows as { action: string }).action).toBe("commission.update");
  });

  it("updateWallet writes 1 update + 1 activity_log event", async () => {
    await updateWallet("w-1", { balance_cents: 12345 });
    expect(updates).toHaveLength(1);
    expect(updates[0].table).toBe("wallets");
    const audits = auditRows();
    expect(audits).toHaveLength(1);
    expect((audits[0].rows as { action: string }).action).toBe("wallet.update");
    expect((audits[0].rows as { metadata: { balance_cents: number } }).metadata.balance_cents).toBe(12345);
  });

  it("updatePayout writes 1 update + 1 activity_log event", async () => {
    await updatePayout("p-1", { status: "paid" });
    expect(updates).toHaveLength(1);
    expect(updates[0].table).toBe("payouts");
    const audits = auditRows();
    expect(audits).toHaveLength(1);
    expect((audits[0].rows as { action: string }).action).toBe("payout.update");
  });

  it("no audit event is written when the primary mutation is not called", async () => {
    expect(auditRows()).toHaveLength(0);
  });

  it("N calls produce exactly N audit rows (no duplicates)", async () => {
    await activateAffiliate("a");
    await updateCommission("c", { status: "paid" });
    await updateWallet("w", { balance_cents: 1 });
    await updatePayout("p", { status: "processing" });
    await deactivateAffiliate("a");
    expect(auditRows()).toHaveLength(5);
  });
});
