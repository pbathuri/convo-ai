import { NextResponse } from "next/server";
import { backendGet } from "@/lib/backend/client";
import { getSkillTree } from "@/lib/skill-tree/data";

export const dynamic = "force-dynamic";

/** Skill tree from FastAPI engine when available, else local JSON. */
export async function GET() {
  try {
    const data = await backendGet<{ tree: unknown }>("/skill-tree");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ tree: getSkillTree(), source: "local" });
  }
}
