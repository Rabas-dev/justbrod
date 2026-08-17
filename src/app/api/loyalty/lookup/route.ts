import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizePakistaniPhone } from "@/lib/loyalty/phone";
import { setSessionCustomerId } from "@/lib/loyalty/session";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ phone: z.string().trim().min(6) });

export async function POST(req: NextRequest) {
  // This endpoint logs a browser in as whoever owns the phone number, with no OTP —
  // rate limiting is the only thing standing between it and scripted account takeover.
  if (!rateLimit(req, "loyalty-lookup", 8, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid mobile number" }, { status: 400 });

  const phone = normalizePakistaniPhone(parsed.data.phone);
  if (!phone) return NextResponse.json({ error: "Please enter a valid Pakistani mobile number" }, { status: 400 });

  const customer = await db.customer.findUnique({ where: { phone } });
  if (!customer) {
    return NextResponse.json({ error: "We couldn't find a Brod Rewards account with that number." }, { status: 404 });
  }

  await setSessionCustomerId(customer.id);
  return NextResponse.json({ customerId: customer.id });
}
