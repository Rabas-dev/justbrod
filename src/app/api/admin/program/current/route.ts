import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const program = await db.program.findFirst({ where: { active: true } });
  if (!program) return NextResponse.json({ error: "No active program" }, { status: 404 });
  return NextResponse.json({
    requiredStamps: program.requiredStamps,
    rewardName: program.rewardName,
    rewardValidDays: program.rewardValidDays,
  });
}
