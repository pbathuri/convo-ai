"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DidAgentStage } from "@/components/did/DidAgentStage";
import { Button } from "@/components/ui/button";
import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { useSessionStore } from "@/stores/session-store";

type Msg = { id: string; role: "user" | "assistant"; content: string };

type Props = {
  personaId: PersonaId;
  headline: string;
  subtitle: string;
  agentId: string;
  clientKey: string;
  openingLine: string;
};

export function ChatExperience({
  personaId,
  headline,
  subtitle,
  agentId,
  clientKey,
  openingLine,
}: Props) {
  const setPersona = useSessionStore((s) => s.setPersona);
  const p = getPersona(personaId);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    { id: "opening", role: "assistant", content: openingLine },
  ]);

  useEffect(() => {
    setPersona(personaId);
  }, [personaId, setPersona]);

  useEffect(() => {
    setMessages([{ id: "opening", role: "assistant", content: openingLine }]);
  }, [openingLine]);

  const canStream = Boolean(agentId && clientKey);

  async function onSend() {
    const text = input.trim();
    if (!text || busy) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);
    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personaId, history }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: e instanceof Error ? e.message : "Request failed.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Session</h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">{headline}</span>
          {subtitle ? <span className="block">{subtitle}</span> : null}
        </p>
        {p ? (
          <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
            <Image src={p.photoUrl} alt={p.displayName} fill className="object-cover" sizes="320px" />
          </div>
        ) : null}
        {canStream ? (
          <DidAgentStage agentId={agentId} clientKey={clientKey} openingLine={openingLine} />
        ) : (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Set <code className="text-xs">NEXT_PUBLIC_DID_CLIENT_KEY</code> and the matching{" "}
            <code className="text-xs">DID_PERSONA_*</code> env var for this persona.
          </p>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <div className="min-h-[280px] flex-1 space-y-3 rounded-lg border bg-card p-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  m.role === "user"
                    ? "inline-block rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                    : "inline-block rounded-lg bg-muted px-3 py-2"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
          />
          <Button disabled={busy} onClick={() => void onSend()}>
            Send
          </Button>
        </div>
      </section>
    </div>
  );
}
