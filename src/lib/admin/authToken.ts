// HMAC-signed session token, built on Web Crypto so it works identically in the Node
// runtime (route handlers) and the Edge runtime (middleware) without extra polyfills.

const encoder = new TextEncoder();

function bufToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuf(b64url: string): ArrayBuffer {
  const padded = b64url + "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSignedToken(secret: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(issuedAt));
  return `${issuedAt}.${bufToBase64Url(signature)}`;
}

/** Constant-time comparison (via fixed-size digests, so length differences don't leak either). */
export async function timingSafeStringEqual(a: string, b: string): Promise<boolean> {
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const bytesA = new Uint8Array(digestA);
  const bytesB = new Uint8Array(digestB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}

export async function verifySignedToken(
  token: string | undefined,
  secret: string,
  maxAgeSeconds: number
): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, signatureB64] = token.split(".");
  if (!issuedAt || !signatureB64) return false;

  const issuedAtNum = Number(issuedAt);
  if (!Number.isFinite(issuedAtNum)) return false;
  if (Math.floor(Date.now() / 1000) - issuedAtNum > maxAgeSeconds) return false;

  try {
    const key = await hmacKey(secret);
    return await crypto.subtle.verify("HMAC", key, base64UrlToBuf(signatureB64), encoder.encode(issuedAt));
  } catch {
    return false;
  }
}
