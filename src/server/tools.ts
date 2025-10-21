// src/server/tools.ts
"use server";

import { routes, allowedAgg, ranges, Agg, Range } from "@/data/navigationMap";

export type NavigateArgs = { routeId: string; params?: Record<string, string> };
export type GetKpiArgs = { metric: string; agg: string; range: string; group_by?: string };
export type SetFilterArgs = { field: string; op: string; value: string };

export async function navigateTool(args: NavigateArgs) {
  const route = routes.find(r => r.id === args.routeId);
  if (!route) return { ok: false, error: "route_not_found" };
  return { ok: true, path: route.path, highlightWidget: args.params?.widgetId ?? null };
}
type MetricData = {
  max: number;
  min: number;
  sum: number;
  avg: number;
  count: number;
};

type FakeData = {
  sales: MetricData;
  orders: MetricData;
  customers: MetricData;
};

export async function getKpiTool(args: GetKpiArgs) {
  if (!allowedAgg.includes(args.agg as Agg)) return { ok: false, error: "bad_agg" };
  if (!ranges.includes(args.range as Range)) return { ok: false, error: "bad_range" };

  const fake: FakeData = {
    sales:    { max: 42000, min: 2000, sum: 210000, avg: 7000, count: 30 },
    orders:   { max: 320,   min: 15,   sum: 1830,   avg: 61,   count: 1830 },
    customers:{ max: 180,   min: 5,    sum: 820,    avg: 27,   count: 820 }
  };

  const pick = fake[args.metric as keyof FakeData];
  if (!pick) return { ok: false, error: "unknown_metric" };

  const value = pick[args.agg as keyof MetricData];
  return { ok: true, data: { metric: args.metric, agg: args.agg, range: args.range, value } };
}

export async function setFilterTool(args: SetFilterArgs) {
  // Validate operator
  const validOps = ["eq", "gt", "lt", "gte", "lte", "contains"];
  if (!validOps.includes(args.op)) {
    return { ok: false, error: "invalid_operator" };
  }

  // For demo purposes, just echo back the filter
  return { 
    ok: true, 
    filter: { 
      field: args.field, 
      op: args.op, 
      value: args.value 
    } 
  };
}
