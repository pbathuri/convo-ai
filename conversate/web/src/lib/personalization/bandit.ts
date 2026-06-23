/**
 * ε-greedy contextual bandit for drill selection (RL loop).
 * Arms = weakness-keyword drills; reward = session overall score.
 */

export type DrillArm = {
  key: string;
  drill: string;
  weaknessMatch: string;
};

export type BanditObservation = {
  armKey: string;
  reward: number;
};

export const DRILL_ARMS: DrillArm[] = [
  {
    key: "metric",
    weaknessMatch: "metric",
    drill: "Practice one story with before/after numbers and customer impact.",
  },
  {
    key: "quantif",
    weaknessMatch: "quantif",
    drill: "Add three concrete metrics to your opening STAR answer.",
  },
  {
    key: "structure",
    weaknessMatch: "structure",
    drill: "Outline Situation → Task → Action → Result in under 90 seconds.",
  },
  {
    key: "vague",
    weaknessMatch: "vague",
    drill: "Replace general claims with one specific decision you owned.",
  },
  {
    key: "ownership",
    weaknessMatch: "ownership",
    drill: "Clarify what only you could have done versus the team.",
  },
  {
    key: "customer",
    weaknessMatch: "customer",
    drill: "Tie your example to end-user or customer outcome explicitly.",
  },
  {
    key: "trade",
    weaknessMatch: "trade",
    drill: "Name two options you rejected and why you chose your path.",
  },
];

const EPSILON = 0.15;

function armForWeakness(weakness: string): DrillArm | undefined {
  const lower = weakness.toLowerCase();
  return DRILL_ARMS.find((a) => lower.includes(a.weaknessMatch));
}

function meanReward(observations: BanditObservation[], armKey: string): number {
  const hits = observations.filter((o) => o.armKey === armKey);
  if (hits.length === 0) return 0;
  return hits.reduce((s, o) => s + o.reward, 0) / hits.length;
}

export function buildBanditObservations(
  sessions: { weaknesses: string[]; score: number }[],
): BanditObservation[] {
  const out: BanditObservation[] = [];
  for (const s of sessions) {
    const top = s.weaknesses[0];
    if (!top) continue;
    const arm = armForWeakness(top);
    if (!arm) continue;
    out.push({ armKey: arm.key, reward: s.score });
  }
  return out;
}

export function banditSelectDrill(opts: {
  weaknesses: string[];
  observations: BanditObservation[];
  fallbackDrill: string;
  rng?: () => number;
}): {
  drill: string;
  armKey: string | null;
  strategy: "exploit" | "explore" | "weakness-match" | "fallback";
  expectedReward?: number;
} {
  const rng = opts.rng ?? Math.random;
  const contextual = opts.weaknesses[0]
    ? armForWeakness(opts.weaknesses[0])
    : undefined;

  if (opts.observations.length === 0) {
    if (contextual) {
      return {
        drill: contextual.drill,
        armKey: contextual.key,
        strategy: "weakness-match",
      };
    }
    return { drill: opts.fallbackDrill, armKey: null, strategy: "fallback" };
  }

  if (rng() < EPSILON) {
    const exploreArm = DRILL_ARMS[Math.floor(rng() * DRILL_ARMS.length)];
    return {
      drill: exploreArm.drill,
      armKey: exploreArm.key,
      strategy: "explore",
    };
  }

  let best = DRILL_ARMS[0];
  let bestReward = -1;
  for (const arm of DRILL_ARMS) {
    const reward = meanReward(opts.observations, arm.key);
    if (reward > bestReward) {
      bestReward = reward;
      best = arm;
    }
  }

  return {
    drill: best.drill,
    armKey: best.key,
    strategy: "exploit",
    expectedReward: bestReward,
  };
}
