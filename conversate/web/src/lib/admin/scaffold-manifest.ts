/** Admin scaffold pages — not wired in commercial-v1 MVP. */
export const ADMIN_SCAFFOLD_PAGES = [
  { path: "/admin/kb", feature: "KB queue", activatesWhen: "DATABASE_URL + admin RBAC" },
  { path: "/admin/scoring", feature: "Scoring config", activatesWhen: "GOOGLE_AI_STUDIO_KEY" },
  { path: "/admin/cost", feature: "Cost dashboard", activatesWhen: "billing export wired" },
  { path: "/admin/audit-log", feature: "Audit log", activatesWhen: "audit table populated" },
  { path: "/admin/scraper-runs", feature: "Scraper runs", activatesWhen: "pipelines/scraper scheduled" },
] as const;
