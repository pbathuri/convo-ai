import type { PersonaId } from "@/lib/personas";
import { getPersona } from "@/lib/personas";
import { getRubricForPersona } from "./rubrics";
import type { ScoreOutput } from "./schema";

const METRIC_PATTERN =
  /\d+%|\$\d|million|billion|\d+\s*(users|customers|ms|seconds|days|weeks|months)/i;
const STAR_PATTERN = /\b(situation|task|action|result)\b/i;
const TRADEOFF_PATTERN =
  /\b(trade-?off|tradeoff|chose|decided|because|however)\b/i;

function scoreDimension(
  text: string,
  dimName: string,
): { score: number; rationale: string } {
  let score = 55;
  const notes: string[] = [];

  if (METRIC_PATTERN.test(text)) {
    score += 15;
    notes.push("includes quantified impact");
  } else {
    notes.push("add metrics to strengthen this dimension");
  }

  if (STAR_PATTERN.test(text)) {
    score += 10;
    notes.push("structured narrative");
  }

  if (TRADEOFF_PATTERN.test(text)) {
    score += 10;
    notes.push("discusses trade-offs");
  }

  const lower = text.toLowerCase();
  if (
    dimName.toLowerCase().includes("customer") &&
    /customer|user|client/.test(lower)
  ) {
    score += 8;
    notes.push("customer-centric language");
  }
  if (
    dimName.toLowerCase().includes("technical") &&
    /system|api|latency|scale|code/.test(lower)
  ) {
    score += 8;
    notes.push("technical depth present");
  }

  score = Math.min(92, Math.max(45, score));
  return {
    score,
    rationale: notes.join("; ") || "Heuristic review of transcript.",
  };
}

export function scoreTranscriptHeuristic(opts: {
  personaId: PersonaId;
  transcript: string;
  degradedReason: string;
}): ScoreOutput {
  const persona = getPersona(opts.personaId);
  const rubric = getRubricForPersona(opts.personaId);
  const text = opts.transcript.trim();
  const quote = text.slice(0, 200) || "(empty)";

  const dimensions = rubric.dimensions.map((d) => {
    const { score, rationale } = scoreDimension(text, d.name);
    return {
      name: d.name,
      score,
      rationale: `${rationale} (${opts.degradedReason})`,
    };
  });

  const overallScore = Math.round(
    dimensions.reduce(
      (sum, d, i) => sum + d.score * (rubric.dimensions[i]?.weight ?? 0.25),
      0,
    ),
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (METRIC_PATTERN.test(text)) strengths.push("You cited measurable impact");
  else weaknesses.push("Needs more quantified impact");
  if (STAR_PATTERN.test(text)) strengths.push("Clear situational structure");
  else weaknesses.push("Use STAR: situation, task, action, result");
  if (!TRADEOFF_PATTERN.test(text))
    weaknesses.push("Explain trade-offs and why you chose your path");

  const actionItems = [
    weaknesses[0] ?? "Add one metric to your lead story",
    "Practice a 90-second concise version",
    persona?.openingQuestion
      ? `Rehearse: ${persona.openingQuestion.slice(0, 80)}…`
      : "Prepare one follow-up depth answer",
  ].slice(0, 3);

  return {
    overallScore,
    dimensions,
    strengths: strengths.length
      ? strengths
      : ["Shows effort in practice session"],
    weaknesses: weaknesses.length ? weaknesses : ["Expand with specifics"],
    actionItems,
    evidence: [{ quote, dimension: dimensions[0]?.name ?? "Overall" }],
    confidence: 0.55,
    nextDrill: persona?.openingQuestion,
  };
}

export function transcriptHasScorableContent(transcript: string): boolean {
  const lines = transcript
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.some((line) => {
    const content = line.replace(/^(user|agent|system):\s*/i, "").trim();
    return content.length > 0;
  });
}
