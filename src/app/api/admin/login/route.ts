import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setAdminAuthed } from "@/lib/admin/session";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter the admin password." }, { status: 400 });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || parsed.data.password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await setAdminAuthed();
  return NextResponse.json({ ok: true });
}
