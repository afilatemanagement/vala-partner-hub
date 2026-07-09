import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EntityFilter = {
  column: string;
  op?: "eq" | "ilike" | "in" | "gte" | "lte";
  value: unknown;
};

export type EntityListOptions = {
  table: string;
  select?: string;
  search?: { q?: string; columns: string[] };
  filters?: EntityFilter[];
  order?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
};

export type EntityListResult<T = Record<string, unknown>> = {
  rows: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Generic paginated list fetcher for every affiliate-manager wall. Uses
 * head+count for total, indexed range for the current page, ilike for
 * search, and stable query keys so realtime invalidations coalesce
 * per-table.
 */
export function useEntityList<T = Record<string, unknown>>(opts: EntityListOptions) {
  const {
    table,
    select = "*",
    search,
    filters = [],
    order = { column: "created_at", ascending: false },
    page = 1,
    pageSize = 25,
  } = opts;

  return useQuery<EntityListResult<T>>({
    queryKey: ["entity", table, { select, search, filters, order, page, pageSize }],
    staleTime: 15_000,
    queryFn: async () => {
      let q = supabase
        .from(table as never)
        .select(select, { count: "exact" })
        .order(order.column, { ascending: !!order.ascending })
        .range((page - 1) * pageSize, page * pageSize - 1);

      for (const f of filters) {
        if (f.value == null || f.value === "" || f.value === "all") continue;
        const op = f.op ?? "eq";
        // @ts-expect-error dynamic filter dispatch
        q = q[op](f.column, f.value);
      }
      if (search?.q && search.columns.length) {
        const or = search.columns.map((c) => `${c}.ilike.%${search.q}%`).join(",");
        q = q.or(or);
      }

      const { data, error, count } = await q;
      if (error) throw error;
      const total = count ?? 0;
      return {
        rows: (data ?? []) as T[],
        count: total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    },
  });
}

/** Just the head count for a table + optional filters — used by KPI cards. */
export function useEntityCount(table: string, filters: EntityFilter[] = []) {
  return useQuery({
    queryKey: ["entity-count", table, filters],
    staleTime: 15_000,
    queryFn: async () => {
      let q = supabase.from(table as never).select("*", { count: "exact", head: true });
      for (const f of filters) {
        if (f.value == null || f.value === "" || f.value === "all") continue;
        const op = f.op ?? "eq";
        // @ts-expect-error dynamic filter dispatch
        q = q[op](f.column, f.value);
      }
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    },
  });
}
