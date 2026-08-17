import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setAdminAuthed } from "@/lib/admin/session";
import { timingSafeStringEqual } from "@/lib/admin/authToken";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "admin-login", 5, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter the password." }, { status: 400 });

  const adminPassword = process.env.ADMIN_PASSWORD;
  const cashierPassword = process.env.CASHIER_PASSWORD;

  if (adminPassword && (await timingSafeStringEqual(parsed.data.password, adminPassword))) {
    await setAdminAuthed("admin");
    return NextResponse.json({ ok: true, role: "admin" });
  }

  if (cashierPassword && (await timingSafeStringEqual(parsed.data.password, cashierPassword))) {
    await setAdminAuthed("cashier");
    return NextResponse.json({ ok: true, role: "cashier" });
  }

  return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
}
