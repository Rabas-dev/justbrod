import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getLoyaltyState } from "@/lib/loyalty/checkin";
import { normalizePakistaniPhone } from "@/lib/loyalty/phone";

const schema = z
  .object({ qrToken: z.string().trim().min(1).optional(), phone: z.string().trim().min(1).optional() })
  .refine((v) => v.qrToken || v.phone, { message: "Provide a QR token or phone number." });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing customer lookup." }, { status: 400 });

  const customer = parsed.data.qrToken
    ? await db.customer.findUnique({ where: { qrToken: parsed.data.qrToken } })
    : await (async () => {
        const phone = normalizePakistaniPhone(parsed.data.phone!);
        if (!phone) return null;
        return db.customer.findUnique({ where: { phone } });
      })();

  if (!customer) return NextResponse.json({ error: "No Brod Rewards customer found." }, { status: 404 });

  const state = await getLoyaltyState(customer.id);
  return NextResponse.json(state);
}
