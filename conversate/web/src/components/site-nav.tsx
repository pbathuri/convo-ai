import Link from "next/link";

const links = [
  { href: "/chat", label: "Session" },
  { href: "/personas", label: "Personas" },
  { href: "/sessions", label: "Sessions" },
  { href: "/progress", label: "Progress" },
  { href: "/admin", label: "Admin" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export function SiteNav() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Conversate
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
