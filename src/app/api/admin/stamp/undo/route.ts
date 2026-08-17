import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { undoLastStamp, CheckinError } from "@/lib/loyalty/checkin";

const schema = z.object({ customerId: z.string().trim().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing customer." }, { status: 400 });

  try {
    const state = await undoLastStamp(parsed.data.customerId);
    return NextResponse.json(state);
  } catch (err) {
    if (err instanceof CheckinError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
