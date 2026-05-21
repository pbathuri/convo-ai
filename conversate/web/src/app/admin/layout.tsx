import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/personas", label: "Personas" },
  { href: "/admin/kb", label: "KB" },
  { href: "/admin/scraper-runs", label: "Scraper" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/scoring", label: "Scoring" },
  { href: "/admin/cost", label: "Cost" },
  { href: "/admin/audit-log", label: "Audit log" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-8 p-6">
      <aside className="w-48 shrink-0 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Operator console
        </p>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded px-2 py-1 hover:bg-muted"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
