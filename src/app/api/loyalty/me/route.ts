import { NextResponse } from "next/server";
import { getLoyaltyState } from "@/lib/loyalty/checkin";
import { getSessionCustomerId } from "@/lib/loyalty/session";

export async function GET() {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ customer: null });

  try {
    const state = await getLoyaltyState(customerId);
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ customer: null });
  }
}
