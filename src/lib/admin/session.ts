import { cookies } from "next/headers";
import { createSignedToken, verifySignedToken } from "./authToken";

const COOKIE_NAME = "brod_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export type AdminRole = "admin" | "cashier";

// Falls back to ADMIN_PASSWORD so the app still works without extra setup, but a dedicated
// secret is stronger (the password is also used for brute-force-able login attempts).
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set.");
  return secret;
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const store = await cookies();
  const role = await verifySignedToken(store.get(COOKIE_NAME)?.value, getSecret(), MAX_AGE_SECONDS);
  return role === "admin" || role === "cashier" ? role : null;
}

export async function isAdminAuthed(): Promise<boolean> {
  return (await getAdminRole()) !== null;
}

export async function setAdminAuthed(role: AdminRole) {
  const store = await cookies();
  const token = await createSignedToken(getSecret(), role);
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminAuthed() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
