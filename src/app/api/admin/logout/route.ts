import { NextResponse } from "next/server";
import { clearAdminAuthed } from "@/lib/admin/session";

export async function POST(req: Request) {
  await clearAdminAuthed();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
