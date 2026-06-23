"use client";

import { EMOTION_TRAIT_KEYS, type EmotionTraits } from "@/lib/emotion/schema";

type Props = {
  traits: EmotionTraits;
  className?: string;
};

const LABELS: Record<(typeof EMOTION_TRAIT_KEYS)[number], string> = {
  confidence: "Confidence",
  empathy: "Empathy",
  clarity: "Clarity",
  assertiveness: "Assertiveness",
  positivity: "Positivity",
};

export function EmotionRadar({ traits, className = "" }: Props) {
  const n = EMOTION_TRAIT_KEYS.length;
  const cx = 120;
  const cy = 120;
  const maxR = 88;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, value: number) => {
    const r = (value / 10) * maxR;
    const a = angle(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const gridLevels = [2, 4, 6, 8, 10];
  const dataPoints = EMOTION_TRAIT_KEYS.map((key, i) =>
    point(i, traits[key]),
  );
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={className}>
      <svg
        viewBox="0 0 240 240"
        className="mx-auto h-56 w-56 max-w-full"
        role="img"
        aria-label="Emotional communication radar chart"
      >
        {gridLevels.map((level) => {
          const pts = EMOTION_TRAIT_KEYS.map((_, i) => {
            const p = point(i, level);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="var(--sakura-glass-border)"
              strokeWidth={0.5}
            />
          );
        })}
        {EMOTION_TRAIT_KEYS.map((key, i) => {
          const outer = point(i, 10);
          const label = point(i, 11.5);
          return (
            <g key={key}>
              <line
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--sakura-glass-border)"
                strokeWidth={0.5}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[8px]"
              >
                {LABELS[key]}
              </text>
            </g>
          );
        })}
        <polygon
          points={polygon}
          fill="var(--sakura-petal-400)"
          fillOpacity={0.35}
          stroke="var(--sakura-petal-500)"
          strokeWidth={2}
        />
        {dataPoints.map((p, i) => (
          <circle
            key={EMOTION_TRAIT_KEYS[i]}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="var(--sakura-plum)"
          />
        ))}
      </svg>
      {traits.insight ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {traits.insight}
        </p>
      ) : null}
    </div>
  );
}
