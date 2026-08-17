import { cookies } from "next/headers";

const COOKIE_NAME = "brod_admin";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}

export async function setAdminAuthed() {
  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminAuthed() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
