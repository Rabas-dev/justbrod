import { cookies } from "next/headers";

const COOKIE_NAME = "brod_customer_id";

export async function getSessionCustomerId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setSessionCustomerId(customerId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, customerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
