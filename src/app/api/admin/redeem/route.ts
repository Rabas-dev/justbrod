import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { redeemRewardCode } from "@/lib/loyalty/redemption";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ code: z.string().min(1) });

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "admin-redeem", 20, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a reward code." }, { status: 400 });

  const result = await redeemRewardCode(parsed.data.code);
  if (!result.ok) {
    const messages: Record<string, string> = {
      NOT_FOUND: "That reward code wasn't found.",
      ALREADY_REDEEMED: "This reward has already been redeemed.",
      EXPIRED: "This reward has expired.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 400 });
  }

  return NextResponse.json(result);
}
