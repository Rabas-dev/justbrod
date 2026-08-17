import { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 20_000; // crude safeguard against unbounded memory growth on a long-lived instance

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Simple fixed-window rate limit, scoped per Vercel serverless instance. Not perfect across
 * regions/cold starts, but stops naive scripted abuse (login brute force, phone enumeration,
 * reward-code guessing). For production-grade protection under real traffic, move this to a
 * shared store (e.g. Upstash Redis + @upstash/ratelimit).
 */
export function rateLimit(req: NextRequest, bucket: string, limit: number, windowMs: number): boolean {
  if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();

  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
