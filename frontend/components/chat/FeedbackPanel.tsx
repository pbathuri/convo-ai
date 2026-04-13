"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const RADAR_LABELS = [
  "Confidence",
  "Empathy",
  "Assertiveness",
  "Clarity",
  "Persuasion",
  "Diplomacy",
] as const;

function RadarChart({ values }: { values: Record<string, number> }) {
  const keys = RADAR_LABELS.map((l) => l.toLowerCase());
  const pts = keys.map((k, i) => {
    const v = values[k] ?? 0.5;
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    const r = 38 * v;
    return [50 + r * Math.cos(angle), 50 + r * Math.sin(angle)];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 100 100" className="h-44 w-full">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={keys
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
              const r = 38 * s;
              return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
            })
            .join(" ")}
          fill="none"
          stroke="currentColor"
          className="text-border-dark opacity-40"
          strokeWidth="0.5"
        />
      ))}
      <path d={d} fill="rgba(88,204,2,0.25)" stroke="#58cc02" strokeWidth="1.5" />
      {keys.map((_, i) => {
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        const x = 50 + 44 * Math.cos(angle);
        const y = 50 + 44 * Math.sin(angle);
        return (
          <text
            key={RADAR_LABELS[i]}
            x={x}
            y={y}
            fontSize="6"
            textAnchor="middle"
            className="fill-text-secondary"
          >
            {RADAR_LABELS[i].slice(0, 4)}
          </text>
        );
      })}
    </svg>
  );
}

export function FeedbackPanel({
  score,
  emotions,
  feedback,
  xpToNext,
  xpProgress,
  mobileOpen,
  onCloseMobile,
}: {
  score: number;
  emotions: Record<string, number>;
  feedback: string[];
  xpToNext: number;
  xpProgress: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const content = (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between md:hidden">
        <h3 className="font-heading font-bold">Feedback</h3>
        <button type="button" onClick={onCloseMobile} aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-green"
          style={{
            background: `conic-gradient(#58cc02 ${score}%, #e5e7eb ${score}%)`,
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold dark:bg-bg-dark-card">
            {score}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-text-secondary">Session score</div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-bold">Emotion radar</div>
        <RadarChart values={emotions} />
      </div>
      <div>
        <div className="mb-2 text-sm font-bold">Coaching tips</div>
        <ul className="space-y-2 text-sm text-text-secondary">
          {feedback.map((t, i) => (
            <li key={i} className="rounded-lg bg-bg-light-secondary px-3 py-2 dark:bg-bg-dark-hover">
              • {t}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-1 text-xs font-bold uppercase text-text-secondary">
          Skill XP
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
          <motion.div
            className="h-full bg-brand-green"
            initial={false}
            animate={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-text-secondary">{xpToNext} XP to next level</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[320px] flex-shrink-0 border-l border-border-light bg-white dark:border-border-dark dark:bg-bg-dark md:block">
        {content}
      </aside>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close feedback"
          onClick={onCloseMobile}
        />
      ) : null}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 w-[min(100vw,320px)] border-l border-border-light bg-white shadow-xl dark:border-border-dark dark:bg-bg-dark md:hidden"
        )}
      >
        {content}
      </motion.aside>
    </>
  );
}
