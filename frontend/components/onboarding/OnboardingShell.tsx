"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { MascotMood } from "@/lib/types";
import { MascotAvatar } from "@/components/ui/MascotAvatar";
import { QuestionBubble } from "@/components/onboarding/QuestionBubble";
import { TransitionWrapper } from "@/components/ui/TransitionWrapper";
import type { OnboardingRoute } from "@/lib/constants";

export function OnboardingShell({
  progress,
  question,
  mood,
  showBack,
  onBack,
  segment,
  direction,
  hideDefaultChrome,
  nextDisabled,
  onNext,
  nextLabel,
  children,
}: {
  progress: number;
  question: string;
  mood: MascotMood;
  showBack: boolean;
  onBack: () => void;
  segment: OnboardingRoute;
  direction: number;
  hideDefaultChrome: boolean;
  nextDisabled: boolean;
  onNext: () => void;
  nextLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-dark text-text-dark-primary">
      <div className="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-black/30">
        <motion.div
          layoutId="onboarding-progress-fill"
          className="h-full bg-brand-green shadow-[0_0_12px_rgba(88,204,2,0.45)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {!hideDefaultChrome ? (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-28 pt-8">
          <div className="mb-4 flex items-start gap-3">
            {showBack ? (
              <button
                type="button"
                aria-label="Back"
                className="mt-1 rounded-lg p-2 text-text-dark-primary hover:bg-bg-dark-hover"
                onClick={onBack}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            ) : (
              <div className="w-10" />
            )}
            <div className="flex flex-1 gap-3">
              <MascotAvatar mood={mood} size="md" />
              <QuestionBubble className="flex-1">{question}</QuestionBubble>
            </div>
          </div>
          <TransitionWrapper routeKey={segment} direction={direction}>
            {children}
          </TransitionWrapper>
        </div>
      ) : (
        <div className="flex flex-1 flex-col pt-2">{children}</div>
      )}

      {!hideDefaultChrome && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-dark bg-bg-dark/95 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl justify-end">
            <button
              type="button"
              disabled={nextDisabled}
              onClick={onNext}
              className="min-h-[52px] min-w-[120px] rounded-xl px-8 font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:bg-bg-dark-card disabled:text-text-dark-secondary disabled:opacity-60 enabled:bg-brand-green enabled:text-white enabled:shadow-[0_2px_0_#46a302] enabled:hover:brightness-105"
            >
              {nextLabel ?? "NEXT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
