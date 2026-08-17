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
  if (!parsed.success) return NextResponse.json({ error: "Enter the admin password." }, { status: 400 });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !(await timingSafeStringEqual(parsed.data.password, expected))) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await setAdminAuthed();
  return NextResponse.json({ ok: true });
}
