"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SKILL_LEVELS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";

function Bars({ n }: { n: number }) {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={2 + i * 5}
          y={18 - (i + 1) * 3}
          width="4"
          height={(i + 1) * 3}
          rx="1"
          fill={i < n ? "#58cc02" : "#3C4A52"}
        />
      ))}
    </svg>
  );
}

export default function LevelStepPage() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(null);

  const goNext = useCallback(() => router.push("/onboarding/daily"), [router]);

  useEffect(() => {
    setFooter({
      disabled: !selected,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  return (
    <div className="flex flex-col gap-3">
      {SKILL_LEVELS.map((o) => (
        <OptionCard
          key={o.key}
          horizontal
          icon={<Bars n={o.bars} />}
          title={o.label}
          selected={selected === o.key}
          onClick={() => {
            setSelected(o.key);
            dispatch({ type: "SET_SKILL_LEVEL", payload: o.key });
          }}
        />
      ))}
    </div>
  );
}
