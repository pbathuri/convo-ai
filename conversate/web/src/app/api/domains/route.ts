import { NextResponse } from "next/server";
import { backendGet } from "@/lib/backend/client";
import { LEGACY_DOMAINS } from "@/lib/domains/legacy";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await backendGet<{
      domains: typeof LEGACY_DOMAINS;
      status: string;
      liveModules?: string[];
      note?: string;
    }>("/domains");
    return NextResponse.json({ ...data, source: "backend" });
  } catch {
    return NextResponse.json({
      domains: LEGACY_DOMAINS,
      status: "archive",
      source: "local",
      note: "Interview personas are live in /personas; legacy domains ship in a future release.",
    });
  }
}
