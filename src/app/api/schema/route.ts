// src/app/api/schema/route.ts
import { NextResponse } from "next/server";
import { routes, metrics, allowedAgg, ranges } from "@/data/navigationMap";

export async function GET() {
  return NextResponse.json({
    routes,
    metrics,
    allowedAgg,
    ranges,
    version: 1
  });
}
