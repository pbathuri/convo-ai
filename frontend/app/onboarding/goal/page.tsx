"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LEARNING_GOALS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";

export default function GoalStepPage() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(null);

  const goNext = useCallback(() => router.push("/onboarding/level"), [router]);

  useEffect(() => {
    setFooter({
      disabled: !selected,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  return (
    <div className="flex flex-col gap-3">
      {LEARNING_GOALS.map((o) => (
        <OptionCard
          key={o.key}
          horizontal
          icon={<span className="text-3xl">{o.icon}</span>}
          title={o.label}
          selected={selected === o.key}
          onClick={() => {
            setSelected(o.key);
            dispatch({ type: "SET_GOAL", payload: o.key });
          }}
        />
      ))}
    </div>
  );
}
