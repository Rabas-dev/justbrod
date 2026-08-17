# Brod Digital Loyalty — MVP

Cashier-verified QR loyalty flow (customer shows a personal QR → cashier scans it after confirming a purchase → stamp added) plus a minimal admin panel.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind
- Postgres via Supabase, accessed through Prisma
- Framer Motion + `canvas-confetti` for the stamp/reward animations
- `qrcode` (customer QR generation) + `qr-scanner` (cashier camera scanning)
- Zod for request validation

## Getting started

```bash
npm install
npx prisma migrate deploy   # applies schema to the database
npm run seed                # creates the default program
npm run dev
```

Customer flow starts at `/rewards`. Admin/cashier starts at `/admin/login`.

## Environment variables

```
DATABASE_URL="<Supabase Transaction pooler string, port 6543, ?pgbouncer=true appended>"
DIRECT_URL="<Supabase Session pooler string, port 5432 — used for migrations>"
ADMIN_PASSWORD="<a real password, not the repo default>"
ADMIN_SESSION_SECRET="<a long random string — openssl rand -base64 32>"
```

`ADMIN_SESSION_SECRET` signs the admin login cookie. If unset, the app falls back to signing with `ADMIN_PASSWORD`, which still works but means rotating the password also invalidates it as a signing key — set a dedicated secret for production.

On Vercel: add all four in Project Settings → Environment Variables before the first deploy. `DIRECT_URL` is only needed if you run migrations from Vercel's build step; for a first deploy, running `npx prisma migrate deploy` locally against the same database is simpler.

## What's implemented

- Customer flow: register/continue (name + PK phone) → loyalty card with a personal QR → cashier stamps it → reward unlock → reward code screen, with confetti on stamp/reward events
- Cashier flow (`/admin/scan`): camera QR scan or manual phone lookup → confirm eligibility → add stamp (same-day duplicate guard) → short undo window
- Server-only stamp calculation in an atomic transaction; reward eligibility is re-checked on every card load, not just at stamp time, so it self-heals if the program's required-stamp count changes later
- Reward codes (`BRD-XXXXXX`, full-entropy uppercase alphanumeric), staff redemption flow with re-redemption/expiry blocking
- Admin: dashboard KPIs, customer list, program settings, redeem screen — all behind a signed, time-limited session cookie
- Rate limiting (per-IP, in-memory) on admin login, phone lookup/registration, and reward redemption
- Security headers (CSP, X-Frame-Options, Permissions-Policy scoped to camera-on-`/admin/scan`, etc.) set in `next.config.ts`

## Known limitations — read before a real launch

- **Phone-number login has no OTP.** `/rewards/continue` and the registration upsert log a browser in as whoever owns that phone number, with only rate limiting (5–8 attempts / 5 min per IP) standing in the way. Fine for an internal pilot; add SMS OTP before handling real customer data at scale.
- **Rate limiting is in-memory per serverless instance.** It stops naive scripted abuse but isn't a hard guarantee under multi-region/multi-instance traffic on Vercel. For real production load, swap `src/lib/rateLimit.ts` for a shared store (Upstash Redis + `@upstash/ratelimit`).
- Single shared admin password — no per-staff accounts, so the stamp audit trail says "staff," not who specifically gave it.
- No automated test suite; flows were verified manually via the running app and direct API calls.
