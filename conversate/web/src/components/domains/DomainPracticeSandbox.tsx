"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/interview-room";

const LIVE_MODULES = [
  {
    module: "business_communication",
    name: "Business Communication",
    subdomains: [
      "Networking",
      "Persuasion",
      "Elevator Pitching",
      "Negotiation",
    ],
  },
  {
    module: "philosophy",
    name: "Philosophy",
    subdomains: [
      "Existentialism",
      "Ethics and Morality",
      "Logic and Reasoning",
      "Political Philosophy",
    ],
  },
  {
    module: "sales_conversation",
    name: "Sales Conversation",
    subdomains: [
      "Elevator Pitch Practice",
      "Objection Handling",
      "Value Proposition Framing",
      "Closing the Deal",
    ],
  },
] as const;

type LiveModuleId = (typeof LIVE_MODULES)[number]["module"];

export function DomainPracticeSandbox() {
  const [module, setModule] = useState<LiveModuleId>(LIVE_MODULES[0].module);
  const [subdomain, setSubdomain] = useState<string>(LIVE_MODULES[0].subdomains[0]);
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [meta, setMeta] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const active = LIVE_MODULES.find((m) => m.module === module) ?? LIVE_MODULES[0];

  return (
    <GlassCard className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase text-[var(--sakura-petal-500)]">
          Preview — backend prompt engine
        </p>
        <h2 className="text-lg font-semibold">Domain practice sandbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generates coaching prompts from ported Streamlit domain modules via
          Render FastAPI.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          Module
          <select
            className="mt-1 w-full rounded border bg-background px-2 py-1.5 text-sm"
            value={module}
            onChange={(e) => {
              const next = LIVE_MODULES.find((m) => m.module === e.target.value);
              if (!next) return;
              setModule(next.module as LiveModuleId);
              setSubdomain(next.subdomains[0]);
              setPrompt(null);
            }}
          >
            {LIVE_MODULES.map((m) => (
              <option key={m.module} value={m.module}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Subdomain
          <select
            className="mt-1 w-full rounded border bg-background px-2 py-1.5 text-sm"
            value={subdomain}
            onChange={(e) => {
              setSubdomain(e.target.value);
              setPrompt(null);
            }}
          >
            {active.subdomains.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-xs">
        Your message
        <textarea
          className="mt-1 min-h-[80px] w-full rounded border bg-background px-2 py-1.5 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type what you would say in this coaching scenario…"
        />
      </label>

      <Button
        type="button"
        disabled={loading || !input.trim()}
        onClick={() => {
          setLoading(true);
          setError(null);
          void fetch("/api/domains/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              module,
              subdomain,
              user_input: input.trim(),
            }),
          })
            .then(async (res) => {
              const body = (await res.json()) as {
                prompt?: string;
                meta?: Record<string, string>;
                error?: string;
              };
              if (!res.ok) {
                setError(body.error ?? `HTTP ${res.status}`);
                setPrompt(null);
                return;
              }
              setPrompt(body.prompt ?? null);
              setMeta(body.meta ?? null);
            })
            .catch(() => setError("Network error"))
            .finally(() => setLoading(false));
        }}
      >
        {loading ? "Generating…" : "Generate coaching prompt"}
      </Button>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {meta ? (
        <p className="text-xs text-muted-foreground">
          Persona: {meta.persona} · Style: {meta.style}
        </p>
      ) : null}
      {prompt ? (
        <pre className="max-h-64 overflow-auto rounded border bg-muted/30 p-3 text-xs whitespace-pre-wrap">
          {prompt}
        </pre>
      ) : null}
    </GlassCard>
  );
}
