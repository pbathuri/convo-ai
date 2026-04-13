import { NextResponse } from "next/server";

// SCAFFOLD: Pull from learning_progression.json or database

export async function GET() {
  return NextResponse.json({
    skills: [
      { id: "intro", name: "Introduction", status: "completed", xp: 100 },
      { id: "basics", name: "Basic Concepts", status: "active", xp: 45 },
      { id: "intermediate", name: "Intermediate", status: "locked", xp: 0 },
      { id: "advanced", name: "Advanced", status: "locked", xp: 0 },
      {
        id: "mastery",
        name: "Mastery",
        status: "locked",
        xp: 0,
        milestone: true,
      },
    ],
  });
}
