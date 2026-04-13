"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/lib/onboarding-context";
import { CELEBRATION_MESSAGES, LOADING_FUN_FACTS } from "@/lib/mock-data";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import { useAppStore } from "@/lib/app-store";

type Phase = 1 | 2 | 3;

export default function ReadyPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const [phase, setPhase] = useState<Phase>(1);
  const [factIdx, setFactIdx] = useState(0);
  const navigated = useRef(false);

  const msgKey = state.experienceLevel ?? "default";
  const celebrationText =
    CELEBRATION_MESSAGES[msgKey] ?? CELEBRATION_MESSAGES.default;

  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => setPhase(2), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => setPhase(3), 3000);
    const i = setInterval(() => {
      setFactIdx((k) => (k + 1) % LOADING_FUN_FACTS.length);
    }, 2000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 3 || navigated.current) return;
    navigated.current = true;
    const d = state.domain ?? "business_communication";
    const s = state.subdomain ?? "negotiation";
    useAppStore.getState().syncFromOnboarding(d, s);
    if (state.dailyGoal != null) {
      useAppStore.setState({
        daily_goal: state.dailyGoal,
      });
    }
    const dest =
      state.learningPath === "assess_level"
        ? "/learn"
        : "/learn/chat?first=1";
    router.replace(dest);
  }, [phase, router, state.domain, state.subdomain, state.dailyGoal, state.learningPath]);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex max-w-lg flex-col items-center text-center"
          >
            <div className="mb-6 max-w-md rounded-2xl border border-border-dark bg-bg-dark-card px-5 py-4 text-text-dark-primary shadow-card-dark">
              <div className="mb-2 h-0 w-0 self-center border-x-8 border-x-transparent border-t-8 border-t-bg-dark-card" />
              {celebrationText}
            </div>
            <MascotAvatar mood="celebrating" size="xl" animate />
            <button
              type="button"
              className="fixed bottom-6 right-6 rounded-xl bg-bg-dark-card px-6 py-3 text-sm font-bold uppercase tracking-wider text-text-dark-secondary"
              onClick={() => setPhase(2)}
            >
              NEXT
            </button>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.span
              className="mb-2 text-2xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden
            >
              {"\u2728"}
            </motion.span>
            <MascotAvatar mood="thinking" size="lg" animate />
            <p className="mt-6 animate-pulse-opacity text-sm font-bold uppercase tracking-widest text-text-dark-secondary">
              LOADING...
            </p>
            <p className="mt-4 max-w-md text-center text-sm text-text-dark-secondary">
              {LOADING_FUN_FACTS[factIdx]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
