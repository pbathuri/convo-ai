import { NextResponse } from "next/server";
import { getSkillTree } from "@/lib/skill-tree/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ tree: getSkillTree() });
}
