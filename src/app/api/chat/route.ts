// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { navigateTool, getKpiTool, setFilterTool, NavigateArgs, GetKpiArgs, SetFilterArgs } from "@/server/tools";

type RouterResult = 
  | { name: "navigate"; args: NavigateArgs }
  | { name: "get_kpi"; args: GetKpiArgs }
  | { name: "set_filter"; args: SetFilterArgs }
  | { name: "text"; text: string };

function simpleRouter(userText: string): RouterResult {
  const t = userText.toLowerCase();

  // navigate intents
  if (t.includes("orders"))    return { name: "navigate", args: { routeId: "orders" } };
  if (t.includes("customers")) return { name: "navigate", args: { routeId: "customers" } };
  if (t.includes("sales"))     return { name: "navigate", args: { routeId: "sales" } };
  if (t.includes("home") || t.includes("dashboard"))
    return { name: "navigate", args: { routeId: "dashboard_home" } };

  // KPI intents: e.g., "max sales this week"
  const aggMatch    = /(max|min|sum|avg|average|count)/.exec(t);
  const metricMatch = /(sales|orders|customers)/.exec(t);
  const rangeMatch  = /(last 7|last seven|last 30|this week|this month)/.exec(t);

  if (aggMatch && metricMatch) {
    const agg = aggMatch[1] === "average" ? "avg" : aggMatch[1];
    let range = "last_7d";
    if (rangeMatch) {
      const phrase = rangeMatch[0];
      if (phrase.includes("30")) range = "last_30d";
      else if (phrase.includes("this week"))  range = "this_week";
      else if (phrase.includes("this month")) range = "this_month";
    }
    return { name: "get_kpi", args: { metric: metricMatch[1], agg, range } };
  }

  // set filter (toy) e.g. "filter status delivered"
  if (t.startsWith("filter ")) {
    const parts = t.split(" "); // filter status delivered
    return { name: "set_filter", args: { field: parts[1] ?? "status", op: "eq", value: parts[2] ?? "delivered" } };
  }

  // default help text
  return {
    name: "text",
    text:
      "I can navigate (home/sales/orders/customers) or fetch KPIs, e.g. 'max sales this week'. Try 'go to orders'."
  };
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const plan = simpleRouter(message);

  if (plan.name === "navigate") {
    const res = await navigateTool(plan.args);
    return NextResponse.json({ type: "navigate", ...res });
  }
  if (plan.name === "get_kpi") {
    const res = await getKpiTool(plan.args);
    return NextResponse.json({ type: "kpi", ...res });
  }
  if (plan.name === "set_filter") {
    const res = await setFilterTool(plan.args);
    return NextResponse.json({ type: "filter", ...res });
  }
  return NextResponse.json({ type: "text", content: plan.text });
}
