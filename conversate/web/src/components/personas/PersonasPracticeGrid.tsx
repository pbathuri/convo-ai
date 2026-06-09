"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PersonaLiveBadge } from "@/components/personas/PersonaLiveBadge";
import { CompanyAccent } from "@/components/ui/interview-room/CompanyAccent";
import { PremiumCTA } from "@/components/ui/sakura";
import {
  PERSONAS,
  type InterviewMode,
  type PersonaDefinition,
  getPersonaLiveStatus,
  isPersonaLiveEmbedded,
  LIVE_EMBEDDED_PERSONA_IDS,
} from "@/lib/personas";

const MODES: InterviewMode[] = ["behavioral", "technical", "case", "mixed"];

export function PersonasPracticeGrid() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState<string>("all");
  const [mode, setMode] = useState<string>("all");

  const companies = useMemo(
    () =>
      Array.from(new Set(PERSONAS.map((p) => p.companyName))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERSONAS.filter((p) => {
      if (company !== "all" && p.companyName !== company) return false;
      if (mode !== "all" && !p.interviewModes.includes(mode as InterviewMode))
        return false;
      if (!q) return true;
      const hay = `${p.displayName} ${p.companyName} ${p.role} ${p.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, company, mode]);

  const liveCount = LIVE_EMBEDDED_PERSONA_IDS.length;
  const inProgressCount = PERSONAS.length - liveCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          placeholder="Search practice rooms…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--sakura-glass-border)] bg-background px-3 py-2 text-sm"
        />
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-lg border border-[var(--sakura-glass-border)] bg-background px-3 py-2 text-sm"
          aria-label="Filter by company"
        >
          <option value="all">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-lg border border-[var(--sakura-glass-border)] bg-background px-3 py-2 text-sm"
          aria-label="Filter by interview mode"
        >
          <option value="all">All modes</option>
          {MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {(query || company !== "all" || mode !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCompany("all");
              setMode("all");
            }}
            className="text-sm text-[var(--sakura-petal-500)] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-emerald-700">{liveCount} live</span>{" "}
        embedded interviewer{liveCount === 1 ? "" : "s"} ·{" "}
        <span className="font-medium text-amber-700">{inProgressCount} in progress</span>{" "}
        (transcript-only preview until agents are embedded).
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No rooms match your filters.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PersonaCard key={p.id} persona={p} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PersonaCard({ persona: p }: { persona: PersonaDefinition }) {
  const liveStatus = getPersonaLiveStatus(p.id);
  const isLive = isPersonaLiveEmbedded(p.id);

  return (
    <li
      className={`overflow-hidden rounded-2xl border bg-[var(--sakura-glass-bg)] shadow-[var(--sakura-shadow-soft)] ${isLive
          ? "border-emerald-500/40"
          : "border-[var(--sakura-glass-border)] opacity-95"
        }`}
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={p.photoUrl}
          alt={p.displayName}
          fill
          className={`object-cover ${isLive ? "" : "grayscale-[20%]"}`}
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <PersonaLiveBadge
          status={liveStatus}
          className="absolute left-3 top-3"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[var(--sakura-glass-bg)]/90 px-2 py-1 text-xs backdrop-blur">
          <CompanyAccent personaId={p.id} className="h-2 w-2 rounded-full" />
          <span>{p.companyName}</span>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h2 className="font-semibold text-[var(--sakura-plum)]">{p.displayName}</h2>
        <p className="text-sm text-muted-foreground">{p.role}</p>
        <div className="flex flex-wrap gap-1">
          {p.interviewModes.map((m) => (
            <span
              key={m}
              className="rounded-full bg-[var(--sakura-petal-100)] px-2 py-0.5 text-[10px] font-medium uppercase text-[var(--sakura-plum-muted)]"
            >
              {m}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {p.defaultDurationMinutes} min · {p.defaultDifficulty}
        </p>
        {isLive ? (
          <PremiumCTA href={`/chat?persona=${p.id}`} className="w-full text-center">
            Enter live room
          </PremiumCTA>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-dashed border-[var(--sakura-glass-border)] bg-muted/50 px-4 py-2.5 text-center text-sm font-medium text-muted-foreground"
          >
            In progress — coming soon
          </button>
        )}
      </div>
    </li>
  );
}
