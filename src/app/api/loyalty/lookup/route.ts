import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizePakistaniPhone } from "@/lib/loyalty/phone";
import { setSessionCustomerId } from "@/lib/loyalty/session";

const schema = z.object({ phone: z.string().trim().min(6) });

export async function POST(req: NextRequest) {
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
