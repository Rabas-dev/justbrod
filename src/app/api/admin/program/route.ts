import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  requiredStamps: z.number().int().min(1).max(50),
  rewardName: z.string().trim().min(1).max(80),
  rewardValidDays: z.number().int().min(1).max(365),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid program settings" }, { status: 400 });

  const program = await db.program.findFirst({ where: { active: true } });
  if (!program) return NextResponse.json({ error: "No active program" }, { status: 404 });

  const updated = await db.program.update({ where: { id: program.id }, data: parsed.data });
  return NextResponse.json(updated);
}
