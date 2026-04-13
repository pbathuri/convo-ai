"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ONBOARDING_QUESTIONS,
  STEP_PROGRESS_PCT,
  stepFromPathname,
  type OnboardingRoute,
} from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import type { MascotMood } from "@/lib/types";
import { OnboardingFooterProvider, useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const ROUTE_PREV: Record<string, string> = {
  domain: "/",
  subdomain: "/onboarding/domain",
  experience: "/onboarding/subdomain",
  discovery: "/onboarding/experience",
  goal: "/onboarding/discovery",
  level: "/onboarding/goal",
  daily: "/onboarding/level",
  path: "/onboarding/daily",
  ready: "/onboarding/path",
};

function moodForStep(step: number, segment: string): MascotMood {
  if (segment === "ready") return "thinking";
  if (step <= 3) return "default";
  if (step <= 5) return "thinking";
  if (step <= 7) return "excited";
  if (step === 8) return "default";
  return "default";
}

function InnerOnboarding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { footer } = useOnboardingFooter();
  const segment = (pathname.split("/").pop() || "domain") as OnboardingRoute;
  const step = stepFromPathname(pathname);
  const progress = STEP_PROGRESS_PCT[step] ?? 11;
  const prevRef = useRef(step);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const delta = step - prevRef.current;
    if (delta !== 0) setDirection(delta > 0 ? 1 : -1);
    prevRef.current = step;
    dispatch({ type: "SET_STEP", payload: step });
  }, [step, dispatch]);

  const mood = moodForStep(step, segment);
  const showBack = segment !== "domain";
  const hideDefaultChrome = segment === "ready";
  const question = ONBOARDING_QUESTIONS[segment] ?? "";

  const onBack = () => {
    const p = ROUTE_PREV[segment];
    if (p) router.push(p);
  };

  return (
    <OnboardingShell
      progress={progress}
      question={question}
      mood={mood}
      showBack={showBack}
      onBack={onBack}
      segment={segment}
      direction={direction}
      hideDefaultChrome={hideDefaultChrome}
      nextDisabled={footer?.disabled ?? true}
      onNext={() => footer?.onNext()}
      nextLabel={footer?.label}
    >
      {children}
    </OnboardingShell>
  );
}

export function OnboardingLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingFooterProvider>
      <InnerOnboarding>{children}</InnerOnboarding>
    </OnboardingFooterProvider>
  );
}
