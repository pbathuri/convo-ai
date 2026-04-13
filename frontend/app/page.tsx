"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DOMAINS } from "@/lib/constants";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function LandingPage() {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-bg-light">
      <header className="flex items-center justify-between px-4 py-4 md:px-10">
        <div className="font-heading text-xl font-bold text-brand-green md:text-2xl">
          <span aria-hidden>{"\u{1F9E0}"}</span> Convo AI
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="hidden sm:inline">SITE LANG:</span>
          <select
            className="rounded-input border border-border-light bg-white px-2 py-1 text-text-primary"
            defaultValue="en"
            aria-label="Site language"
          >
            <option value="en">EN</option>
          </select>
        </label>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-4 md:px-10">
        <div className="flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
          <HeroIllustration />
          <div className="flex max-w-[480px] flex-col items-stretch gap-6 text-center md:text-left">
            <h1 className="font-heading text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              The free, fun, and effective way to master any conversation!
            </h1>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                fullWidth
                className="!py-4 !text-lg"
                onClick={() => router.push("/onboarding/domain")}
              >
                GET STARTED
              </Button>
              <Button
                variant="secondary"
                fullWidth
                className="!font-bold !uppercase !tracking-wider"
                onClick={() => router.push("/learn")}
              >
                I ALREADY HAVE AN ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-white/95 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-2 md:px-6">
          <button
            type="button"
            aria-label="Scroll domains left"
            className="rounded-full p-2 text-text-secondary hover:bg-bg-light-secondary"
            onClick={() => scrollByDir(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            ref={scrollerRef}
            onScroll={(e) => {
              const t = e.currentTarget;
              const w = t.scrollWidth / DOMAINS.length;
              setActiveIdx(Math.min(DOMAINS.length - 1, Math.round(t.scrollLeft / w)));
            }}
            className="no-scrollbar flex flex-1 gap-3 overflow-x-auto scroll-smooth py-1"
          >
            {DOMAINS.map((d, i) => (
              <Link
                key={d.key}
                href={`/onboarding/domain?preselect=${encodeURIComponent(d.key)}`}
                className={cn(
                  "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors md:text-sm",
                  activeIdx === i
                    ? "border-brand-green text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                )}
                onClick={() => setActiveIdx(i)}
              >
                <span>{d.icon}</span>
                <span>{d.label.split(" ")[0]}</span>
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll domains right"
            className="rounded-full p-2 text-text-secondary hover:bg-bg-light-secondary"
            onClick={() => scrollByDir(1)}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
