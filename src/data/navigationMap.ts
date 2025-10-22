// src/data/navigationMap.ts

export const routes = [
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

export const allowedAgg = ["max", "min", "sum", "avg", "count"];
export const ranges = ["last_7d", "last_30d", "this_week", "this_month"];
