import { NextRequest, NextResponse } from "next/server";
import { verifySignedToken } from "@/lib/admin/authToken";

const COOKIE_NAME = "brod_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const secret = getSecret();
  const authed = secret ? await verifySignedToken(req.cookies.get(COOKIE_NAME)?.value, secret, MAX_AGE_SECONDS) : false;

  if (!authed) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
