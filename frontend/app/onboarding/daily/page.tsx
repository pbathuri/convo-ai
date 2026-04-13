"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DAILY_GOALS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";

export default function DailyStepPage() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<number | null>(null);

  const goNext = useCallback(() => router.push("/onboarding/path"), [router]);

  useEffect(() => {
    setFooter({
      disabled: selected == null,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  useEffect(() => {
    if (selected == null) return;
    const t = setTimeout(goNext, 400);
    return () => clearTimeout(t);
  }, [selected, goNext]);

  return (
    <div className="flex flex-col gap-3">
      {DAILY_GOALS.map((o) => (
        <button
          key={o.minutes}
          type="button"
          onClick={() => {
            setSelected(o.minutes);
            dispatch({ type: "SET_DAILY", payload: o.minutes });
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-all ${selected === o.minutes
            ? "border-2 border-brand-green bg-bg-dark-hover"
            : "border-border-dark bg-bg-dark-card hover:border-brand-green/50"
            }`}
        >
          <span className="font-bold text-text-dark-primary">{o.label}</span>
          <span className="text-sm text-text-dark-secondary">{o.tag}</span>
        </button>
      ))}
    </div>
  );
}
