"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { X, Volume2 } from "lucide-react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { FeedbackPanel } from "@/components/chat/FeedbackPanel";
import { TimerBar } from "@/components/chat/TimerBar";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import { DEFAULT_FIRST_PROMPT } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types";
import { useAppStore } from "@/lib/app-store";
import { DOMAINS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

function ChatPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const firstExercise = params.get("first") === "1";
  const skillId = params.get("skill") ?? "basics";

  const { domain, subdomain } = useAppStore();
  const xp = useAppStore((s) => s.xp);
  const domainLabel = DOMAINS.find((d) => d.key === domain)?.label ?? "Practice";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [firstPhase, setFirstPhase] = useState({
    textMode: false,
    spoken: "",
    micDone: false,
    lessonIndex: 1,
    lessonTotal: 5,
  });

  const [feedback, setFeedback] = useState({
    score: 72,
    emotions: {
      confidence: 0.7,
      empathy: 0.6,
      assertiveness: 0.8,
      clarity: 0.75,
      persuasion: 0.5,
      diplomacy: 0.65,
    } as Record<string, number>,
    tips: ["Try to use more open-ended questions", "Good use of active listening phrases"],
  });

  const [elapsed, setElapsed] = useState(0);
  const totalTime = 300;

  useEffect(() => {
    if (firstExercise) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [firstExercise]);

  useEffect(() => {
    if (firstExercise || messages.length > 0) return;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome! I'm your ${domainLabel.toLowerCase()} coach. Today we'll practice together.`,
      },
    ]);
  }, [firstExercise, domainLabel, messages.length]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: { domain, subdomain, history: messages },
        }),
      });
      const data = await res.json();
      setFeedback({
        score: data.score,
        emotions: data.emotions,
        tips: data.feedback,
      });
      useAppStore.getState().addXp(data.xp_earned ?? 0);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: data.response },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, domain, subdomain, messages]);

  if (firstExercise) {
    const canCheck =
      firstPhase.textMode && firstPhase.spoken.trim().length > 0
        ? true
        : firstPhase.micDone;

    return (
      <div className="flex min-h-screen flex-col bg-bg-dark text-text-dark-primary">
        <div className="border-b border-border-dark px-4 pb-3 pt-20 md:pt-6">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <Link
              href="/learn"
              className="rounded-lg p-2 hover:bg-bg-dark-hover"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Link>
            <ProgressBar
              thin
              value={(firstPhase.lessonIndex / firstPhase.lessonTotal) * 100}
              className="flex-1"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-8">
          <h2 className="mb-8 text-center text-xl font-bold text-text-dark-primary">
            Practice this conversation prompt
          </h2>
          <div className="mb-8 flex gap-3">
            <MascotAvatar mood="speaking" size="md" />
            <div className="relative flex-1 rounded-2xl border border-border-dark bg-bg-dark-card px-4 py-3">
              <button
                type="button"
                className="absolute right-3 top-3 text-brand-blue"
                aria-label="Play audio"
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <p className="pr-10 text-text-dark-primary">{DEFAULT_FIRST_PROMPT}</p>
            </div>
          </div>
          {!firstPhase.textMode ? (
            <button
              type="button"
              onClick={() => {
                if (!recording) {
                  setRecording(true);
                } else {
                  setRecording(false);
                  setFirstPhase((p) => ({ ...p, micDone: true }));
                }
              }}
              className={`mb-6 w-full rounded-2xl border-2 py-6 text-lg font-bold uppercase tracking-wide ${recording
                ? "border-brand-red text-brand-red"
                : "border-brand-blue text-brand-blue"
                }`}
            >
              {"\u{1F3A4}"} TAP AND SPEAK
            </button>
          ) : (
            <textarea
              className="mb-6 min-h-[100px] w-full rounded-input border border-border-dark bg-bg-dark-card p-3 text-text-dark-primary"
              placeholder="Type your response..."
              value={firstPhase.spoken}
              onChange={(e) =>
                setFirstPhase((p) => ({ ...p, spoken: e.target.value }))
              }
            />
          )}
          <div className="mt-auto flex items-center justify-between gap-4 pb-8">
            <button
              type="button"
              className="text-sm font-bold uppercase text-text-dark-secondary"
              onClick={() =>
                setFirstPhase((p) => ({
                  ...p,
                  textMode: true,
                  spoken: "",
                  micDone: false,
                }))
              }
            >
              I CAN&apos;T SPEAK NOW
            </button>
            <Button
              variant="primary"
              disabled={!canCheck}
              className="!px-6 !py-3"
              onClick={() => router.replace("/learn/chat")}
            >
              CHECK
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const showListeningByInput =
    !typing &&
    !recording &&
    lastMessage?.role === "user";

  return (
    <div className="flex min-h-screen flex-col bg-bg-light">
      <div className="sticky top-0 z-10 border-b border-border-light bg-white px-4 py-3 dark:border-border-dark dark:bg-bg-dark md:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/learn" className="text-text-secondary hover:text-text-primary">
            {"\u2190"} Back
          </Link>
          <span className="font-heading font-bold text-text-primary dark:text-text-dark-primary">
            {domainLabel} — {skillId}
          </span>
          <div className="ml-auto w-full max-w-xs md:w-48">
            <TimerBar elapsedSec={elapsed} totalSec={totalTime} />
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setPanelOpen(true)}
          >
            Feedback
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-h-[60vh] flex-1 flex-col md:min-h-0">
          <ChatContainer messages={messages} typing={typing} />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            recording={recording}
            onToggleRecord={() => setRecording((r) => !r)}
            disabled={typing}
            showListeningMascot={showListeningByInput}
          />
        </div>
        <FeedbackPanel
          score={feedback.score}
          emotions={feedback.emotions}
          feedback={feedback.tips}
          xpToNext={100 - (xp % 100)}
          xpProgress={xp % 100}
          mobileOpen={panelOpen}
          onCloseMobile={() => setPanelOpen(false)}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <ChatPageInner />
    </Suspense>
  );
}
