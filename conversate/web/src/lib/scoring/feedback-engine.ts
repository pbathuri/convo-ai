import type { ScoreOutput } from "./schema";

export type FeedbackReport = {
  headline: string;
  topFixes: string[];
  actionItems: string[];
  evidence: ScoreOutput["evidence"];
  nextDrill?: string;
  overallScore: number;
};

export function buildFeedbackReport(output: ScoreOutput): FeedbackReport {
  return {
    headline:
      output.overallScore >= 80
        ? "Strong session — polish the details"
        : output.overallScore >= 60
          ? "Solid foundation — focus your top gaps"
          : "High-impact fixes available",
    topFixes: output.weaknesses.slice(0, 3),
    actionItems: output.actionItems,
    evidence: output.evidence,
    nextDrill: output.nextDrill,
    overallScore: output.overallScore,
  };
}
