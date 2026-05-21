"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/interview-room";
import type { SpeechSegment } from "@/lib/speech/types";

type Props = {
  sessionId: string;
  speechSegments?: SpeechSegment[];
  onManualSaved?: (entryCount: number) => void;
};

export function TranscriptPanel({
  sessionId,
  speechSegments = [],
  onManualSaved,
}: Props) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<{ source: string; line: string }[]>([]);

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
    const entries = messages.map((m) => ({
      source: "manual",
      line: `${m.role}: ${m.content}`,
    }));
    setSaved(entries);
    onManualSaved?.(entries.length);
    setDraft("");
  }

  const browserLines = speechSegments
    .filter((s) => s.isFinal)
    .map((s) => ({
      source: "browser speech",
      line: `user: ${s.text}`,
    }));

  return (
    <GlassCard className="space-y-3">
      <h3 className="text-sm font-medium">Session transcript</h3>
      <p className="text-xs text-muted-foreground">
        Candidate-side capture only — not a full two-party D-ID transcript.
        Sources: <strong>browser speech</strong>, <strong>manual paste</strong>,
        or future <strong>D-ID callback</strong> (not wired in V1).
      </p>

      {browserLines.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">Browser speech</p>
          <ul className="max-h-32 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            {browserLines.map((s) => (
              <li key={s.line}>
                <span className="text-[10px] uppercase text-primary/80">
                  {s.source}
                </span>{" "}
                {s.line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {saved.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">Saved (manual)</p>
          <ul className="max-h-32 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            {saved.map((s) => (
              <li key={s.line}>
                <span className="text-[10px] uppercase text-primary/80">
                  {s.source}
                </span>{" "}
                {s.line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-2 border-t pt-3">
        <p className="text-xs font-medium">Manual paste</p>
        <p className="text-xs text-muted-foreground">
          Paste lines as <code>user: ...</code> or <code>agent: ...</code>
        </p>
        <textarea
          className="min-h-[100px] w-full rounded border bg-background p-2 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="user: I led a project...\nagent: Tell me more about metrics..."
        />
        <Button type="button" size="sm" onClick={() => void saveTranscript()}>
          Save manual transcript
        </Button>
      </div>
    </GlassCard>
  );
}
