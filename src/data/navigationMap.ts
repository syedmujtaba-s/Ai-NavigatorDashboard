// src/data/navigationMap.ts
export type RouteItem = {
  id: string;
  path: string;
  description: string;
  widgets?: string[];
};

export const routes: RouteItem[] = [
  {
    id: "dashboard_home",
    path: "/",
    description: "Main overview with KPIs & charts",
    widgets: [
      "customers_card",
      "orders_card",
      "monthly_sales_chart",
      "monthly_target_gauge",
      "statistics_area_chart",
      "customers_demographic_map",
      "recent_orders_table"
    ]
  },
  { id: "customers", path: "/customers", description: "Customer list & demographics" },
  { id: "orders", path: "/orders", description: "Orders list with filters & status" },
  { id: "sales", path: "/sales", description: "Sales charts & targets" }
];

export const metrics = [
  { key: "sales", type: "currency", description: "Gross sales" },
  { key: "orders", type: "count", description: "Order count" },
  { key: "customers", type: "count", description: "Customer count" }
];

export const allowedAgg = ["max", "min", "sum", "avg", "count"] as const;
export type Agg = typeof allowedAgg[number];

export const ranges = ["last_7d", "last_30d", "this_week", "this_month"] as const;
export type Range = typeof ranges[number];
