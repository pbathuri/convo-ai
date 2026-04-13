import { NextResponse } from "next/server";

// SCAFFOLD: Replace with actual backend call to Python AI service
// Expected: POST { message: string, context: { domain, subdomain, history } }
// Returns: { response: string, score: number, emotions: Record<string, number>, feedback: string[] }

export async function POST(req: Request) {
  await req.json().catch(() => ({}));
  return NextResponse.json({
    response:
      "This is a placeholder AI response. Connect the Python backend to enable real conversations.",
    score: 72,
    emotions: {
      confidence: 0.7,
      empathy: 0.6,
      assertiveness: 0.8,
      clarity: 0.75,
      persuasion: 0.5,
      diplomacy: 0.65,
    },
    feedback: [
      "Try to use more open-ended questions",
      "Good use of active listening phrases",
    ],
    xp_earned: 15,
  });
}
