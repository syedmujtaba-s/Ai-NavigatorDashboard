// src/app/api/kpi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { allowedAgg, ranges } from "@/data/navigationMap";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const metric = url.searchParams.get("metric") ?? "sales";
  const agg = url.searchParams.get("agg") ?? "sum";
  const range = url.searchParams.get("range") ?? "last_7d";

  if (!allowedAgg.includes(agg as any)) {
    return NextResponse.json({ error: "Invalid aggregation" }, { status: 400 });
  }
  if (!ranges.includes(range as any)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  // Fake data (replace with DB later)
  const fake = {
    sales:    { max: 42000, min: 2000, sum: 210000, avg: 7000, count: 30 },
    orders:   { max: 320,   min: 15,   sum: 1830,   avg: 61,   count: 1830 },
    customers:{ max: 180,   min: 5,    sum: 820,    avg: 27,   count: 820 }
  };

  const pick = (fake as any)[metric];
  if (!pick) return NextResponse.json({ error: "Unknown metric" }, { status: 400 });

  const value = pick[agg];

  return NextResponse.json({ metric, agg, range, value });
}
