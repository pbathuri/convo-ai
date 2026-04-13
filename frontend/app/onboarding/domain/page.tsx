"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { DOMAINS } from "@/lib/constants";
import { useOnboarding } from "@/lib/onboarding-context";
import { useOnboardingFooter } from "@/lib/onboarding-footer-context";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { OptionGrid } from "@/components/onboarding/OptionGrid";

function DomainStepPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { state, dispatch } = useOnboarding();
  const { setFooter } = useOnboardingFooter();
  const [selected, setSelected] = useState<string | null>(state.domain);

  useEffect(() => {
    const p = search.get("preselect");
    if (p && DOMAINS.some((d) => d.key === p)) {
      setSelected(p);
      dispatch({ type: "SET_DOMAIN", payload: p });
    }
  }, [search, dispatch]);

  const goNext = useCallback(() => router.push("/onboarding/subdomain"), [router]);

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
    <OptionGrid cols={4}>
      {DOMAINS.map((d) => (
        <OptionCard
          key={d.key}
          icon={<span>{d.icon}</span>}
          title={d.label}
          selected={selected === d.key}
          onClick={() => {
            setSelected(d.key);
            dispatch({ type: "SET_DOMAIN", payload: d.key });
          }}
        />
      ))}
    </OptionGrid>
  );
}

export default function DomainStepPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-text-dark-secondary">Loading…</div>}>
      <DomainStepPageInner />
    </Suspense>
  );
}
