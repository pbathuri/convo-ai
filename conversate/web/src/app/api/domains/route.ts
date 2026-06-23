import { NextResponse } from "next/server";
import { LEGACY_DOMAINS } from "@/lib/domains/legacy";

export async function GET() {
  return NextResponse.json({
    domains: LEGACY_DOMAINS,
    status: "archive",
    note: "Interview personas are live in /personas; legacy domains ship in a future release.",
  });
}
