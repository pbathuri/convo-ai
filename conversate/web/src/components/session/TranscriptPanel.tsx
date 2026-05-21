"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/interview-room";

type Props = { sessionId: string };

export function TranscriptPanel({ sessionId }: Props) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  async function saveTranscript() {
    const lines = draft.split("\n").filter(Boolean);
    const messages = lines.map((line, i) => {
      const [role, ...rest] = line.split(":");
      const r = role?.trim().toLowerCase();
      const content = rest.join(":").trim() || line;
      return {
        role: (r === "user" || r === "agent" ? r : "user") as "user" | "agent",
        content,
        sequence: i,
      };
    });
    await fetch(`/api/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    setSaved(messages.map((m) => `${m.role}: ${m.content}`));
  }

  return (
    <GlassCard className="space-y-2">
      <h3 className="text-sm font-medium">Transcript (fallback paste)</h3>
      <p className="text-xs text-muted-foreground">
        Per docs/audits/transcript-capture-feasibility.md — paste lines as{" "}
        <code>user: ...</code> or <code>agent: ...</code> if SDK callbacks are unavailable.
      </p>
      <textarea
        className="min-h-[120px] w-full rounded border bg-background p-2 text-sm"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="user: I led a project...\nagent: Tell me more about metrics..."
      />
      <Button type="button" size="sm" onClick={() => void saveTranscript()}>
        Save transcript
      </Button>
      {saved.length > 0 ? (
        <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-muted-foreground">
          {saved.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : null}
    </GlassCard>
  );
}
