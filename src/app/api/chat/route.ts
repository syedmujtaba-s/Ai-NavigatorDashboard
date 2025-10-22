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

 if (t.includes("dashboard") || t.includes("home"))
  return { name: "navigate", args: { routeId: "dashboard_home" } };

if (t.includes("calendar"))
  return { name: "navigate", args: { routeId: "calendar" } };

if (t.includes("profile") || t.includes("user"))
  return { name: "navigate", args: { routeId: "profile" } };

if (t.includes("form"))
  return { name: "navigate", args: { routeId: "form_elements" } };

if (t.includes("table"))
  return { name: "navigate", args: { routeId: "basic_tables" } };

if (t.includes("bar"))
  return { name: "navigate", args: { routeId: "bar_chart" } };

if (t.includes("line"))
  return { name: "navigate", args: { routeId: "line_chart" } };

if (t.includes("alert"))
  return { name: "navigate", args: { routeId: "alerts" } };

if (t.includes("avatar"))
  return { name: "navigate", args: { routeId: "avatars" } };

if (t.includes("badge"))
  return { name: "navigate", args: { routeId: "badge" } };

if (t.includes("button"))
  return { name: "navigate", args: { routeId: "buttons" } };

if (t.includes("image"))
  return { name: "navigate", args: { routeId: "images" } };

if (t.includes("video"))
  return { name: "navigate", args: { routeId: "videos" } };

if (t.includes("signin") || t.includes("login"))
  return { name: "navigate", args: { routeId: "signin" } };

if (t.includes("signup") || t.includes("register"))
  return { name: "navigate", args: { routeId: "signup" } };


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
// default help text
return {
  name: "text",
  text:
    "Hmm 🤔 I didn’t recognize that command. Maybe try 'go to home', 'open bar chart', or 'show calendar'."
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
