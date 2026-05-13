// RESERVED FOR V2 — D-ID LLM webhook override. Not used in V1.
// V1 architecture: D-ID Agents run their own GPT-4.1 brain with
// the persona prompt configured in D-ID Studio.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "./env";

const MODEL = "gemini-2.0-flash";

function getModel() {
  const { GOOGLE_AI_STUDIO_KEY } = getServerEnv();
  if (!GOOGLE_AI_STUDIO_KEY) {
    throw new Error("GOOGLE_AI_STUDIO_KEY is not set");
  }
  const gen = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_KEY);
  return gen.getGenerativeModel({ model: MODEL });
}

export async function generateOpeningLine(
  personaLabel: string,
): Promise<string> {
  const model = getModel();
  const prompt = `You are "${personaLabel}", a voice conversation practice partner.
Say exactly one short opening sentence (max 22 words) to greet the user and invite them to begin. No bullet points.`;
  const r = await model.generateContent(prompt);
  const text = r.response.text().trim();
  return (
    text ||
    `Hi — I'm your ${personaLabel}. Whenever you're ready, tell me what you want to work on.`
  );
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function generateChatReply(
  personaLabel: string,
  history: ChatTurn[],
): Promise<string> {
  const model = getModel();
  const lines = history.map(
    (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
  );
  const prompt = `You are "${personaLabel}". Reply helpfully and concisely (under 120 words).\n\n${lines.join("\n")}\nAssistant:`;
  const r = await model.generateContent(prompt);
  return r.response.text().trim();
}
