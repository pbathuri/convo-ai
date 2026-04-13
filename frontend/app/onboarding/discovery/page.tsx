"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DISCOVERY_SOURCES } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionGrid } from "@/components/onboarding/OptionGrid";

export default function DiscoveryStepPage() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(null);

  const goNext = useCallback(() => router.push("/onboarding/goal"), [router]);

  useEffect(() => {
    setFooter({
      disabled: !selected,
      onNext: goNext,
    });
    return () => setFooter(null);
  }, [selected, setFooter, goNext]);

  return (
    <OptionGrid cols={2}>
      {DISCOVERY_SOURCES.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => {
            setSelected(o.key);
            dispatch({ type: "SET_DISCOVERY", payload: o.key });
          }}
          className={`rounded-xl border p-4 text-left transition-all ${selected === o.key
            ? "border-2 border-brand-green bg-bg-dark-hover"
            : "border-border-dark bg-bg-dark-card hover:border-brand-green/60"
            }`}
        >
          <span className="mr-2 text-2xl">{o.icon}</span>
          <span className="font-semibold text-text-dark-primary">{o.label}</span>
        </button>
      ))}
    </OptionGrid>
  );
}
