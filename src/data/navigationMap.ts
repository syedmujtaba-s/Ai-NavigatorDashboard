// src/data/navigationMap.ts

export type Route = {
  id: string;
  name: string;
  path: string;
};

export const routes: Route[] = [
  { id: "dashboard_home", name: "Dashboard", path: "/" }, // ✅ fixed path
  { id: "calendar", name: "Calendar", path: "/calendar" },
  { id: "profile", name: "Profile", path: "/profile" },
  { id: "form_elements", name: "Form Elements", path: "/form-elements" },
  { id: "basic_tables", name: "Basic Tables", path: "/basic-tables" },
  { id: "bar_chart", name: "Bar Chart", path: "/bar-chart" },
  { id: "line_chart", name: "Line Chart", path: "/line-chart" },
  { id: "alerts", name: "Alerts", path: "/alerts" },
  { id: "avatars", name: "Avatars", path: "/avatars" },
  { id: "badge", name: "Badge", path: "/badge" },
  { id: "buttons", name: "Buttons", path: "/buttons" },
  { id: "images", name: "Images", path: "/images" },
  { id: "videos", name: "Videos", path: "/videos" },
  { id: "signin", name: "Sign In", path: "/signin" },
  { id: "signup", name: "Sign Up", path: "/signup" },
];

export const allowedAgg = ["max", "min", "sum", "avg", "count"] as const;
export type Agg = typeof allowedAgg[number];

export const ranges = ["last_7d", "last_30d", "this_week", "this_month"] as const;
export type Range = typeof ranges[number];

export const metrics = [
  { key: "sales", type: "currency", description: "Gross sales" },
  { key: "orders", type: "count", description: "Order count" },
  { key: "customers", type: "count", description: "Customer count" }
] as const;
export type Metric = typeof metrics[number]["key"];
