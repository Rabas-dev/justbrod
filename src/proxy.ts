import { NextRequest, NextResponse } from "next/server";
import { verifySignedToken } from "@/lib/admin/authToken";

const COOKIE_NAME = "brod_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

// Cashiers only need the scanning flow: the page itself, plus the lookup/stamp/undo/logout
// APIs it calls. Everything else in /admin and /api/admin is admin-only.
const CASHIER_ALLOWED_PAGES = ["/admin/scan"];
const CASHIER_ALLOWED_API_PREFIXES = [
  "/api/admin/lookup",
  "/api/admin/stamp",
  "/api/admin/logout",
];

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const secret = getSecret();
  const role = secret ? await verifySignedToken(req.cookies.get(COOKIE_NAME)?.value, secret, MAX_AGE_SECONDS) : null;

  if (!role) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (role === "cashier") {
    const allowed = pathname.startsWith("/api/admin")
      ? CASHIER_ALLOWED_API_PREFIXES.some((p) => pathname.startsWith(p))
      : CASHIER_ALLOWED_PAGES.some((p) => pathname.startsWith(p));

    if (!allowed) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/scan";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
