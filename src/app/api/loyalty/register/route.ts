import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { normalizePakistaniPhone } from "@/lib/loyalty/phone";
import { setSessionCustomerId } from "@/lib/loyalty/session";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60),
  phone: z.string().trim().min(6, "Please enter a valid mobile number"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const phone = normalizePakistaniPhone(parsed.data.phone);
  if (!phone) {
    return NextResponse.json({ error: "Please enter a valid Pakistani mobile number" }, { status: 400 });
  }

  const customer = await db.customer.upsert({
    where: { phone },
    update: {},
    create: { name: parsed.data.name, phone },
  });

  await setSessionCustomerId(customer.id);

  return NextResponse.json({ customerId: customer.id });
}
