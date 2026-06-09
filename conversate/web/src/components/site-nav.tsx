import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/personas", label: "Practice" },
  { href: "/progress", label: "Insights" },
  { href: "/chat", label: "Live room" },
];

export function SiteNav() {
  return (
    <header className="border-b border-[var(--sakura-glass-border)] bg-[var(--sakura-glass-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Conversate
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {primaryLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
