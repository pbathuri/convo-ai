import Link from "next/link";

const moreLinks = [
  { href: "/sessions", label: "Sessions" },
  { href: "/chat", label: "Live room" },
  { href: "/settings", label: "Settings" },
  { href: "/analytics", label: "Analytics" },
  { href: "/admin", label: "Admin" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)]/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground">
        <span>Conversate — live AI interview practice</span>
        <nav className="flex flex-wrap gap-3">
          {moreLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
