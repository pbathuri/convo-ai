"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";

export default function ExperienceStepPage() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(state.experienceLevel);

  const goNext = useCallback(() => router.push("/onboarding/discovery"), [router]);

  useEffect(() => {
    setFooter({
      disabled: !selected,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(goNext, 400);
    return () => clearTimeout(t);
  }, [selected, goNext]);

  return (
    <div className="flex flex-col gap-3">
      {EXPERIENCE_LEVELS.map((o) => (
        <OptionCard
          key={o.key}
          horizontal
          icon={<span className="text-3xl">{o.icon}</span>}
          title={o.label}
          subtitle={o.description}
          selected={selected === o.key}
          onClick={() => {
            setSelected(o.key);
            dispatch({ type: "SET_EXPERIENCE", payload: o.key });
          }}
        />
      ))}
    </div>
  );
}
