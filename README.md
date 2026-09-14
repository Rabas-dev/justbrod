# Brod Digital Loyalty — MVP

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

A digital stamp-card loyalty app built for a real restaurant, Brod. Replaces paper stamp cards with a **cashier-verified QR flow**: a customer shows a personal QR code, the cashier scans it after confirming a purchase, and a stamp is added — plus a minimal admin panel to run the program.

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind
- **Database:** Postgres via Supabase, accessed through Prisma
- **UI/Animation:** Framer Motion + `canvas-confetti` for stamp/reward animations
- **QR:** `qrcode` (customer QR generation) + `qr-scanner` (cashier camera scanning)
- **Validation:** Zod for request validation

## Getting Started

```bash
npm install
npx prisma migrate deploy   # applies schema to the database
npm run seed                # creates the default program
npm run dev
```

- **Customer flow** starts at `/rewards`
- **Admin/cashier flow** starts at `/admin/login`

## Environment Variables

```env
DATABASE_URL="<Supabase Transaction pooler string, port 6543, ?pgbouncer=true appended>"
DIRECT_URL="<Supabase Session pooler string, port 5432 — used for migrations>"
ADMIN_PASSWORD="<a real password, not the repo default>"
ADMIN_SESSION_SECRET="<a long random string — openssl rand -base64 32>"
CASHIER_PASSWORD="<a separate password for cashier-only logins>"
```

- `ADMIN_SESSION_SECRET` signs the admin login cookie. If unset, the app falls back to signing with `ADMIN_PASSWORD` — which still works, but means rotating the password also invalidates it as a signing key. Set a dedicated secret for production.
- `CASHIER_PASSWORD` is optional. Logging in with it grants a restricted "cashier" session that can only reach `/admin/scan` and its lookup/stamp APIs; every other admin page and API route (dashboard, customers, redeem, program) 403s or redirects away. Leave it unset if you don't need a separate cashier login.
- **On Vercel:** add these in Project Settings → Environment Variables before the first deploy. `DIRECT_URL` is only needed if you run migrations from Vercel's build step — for a first deploy, running `npx prisma migrate deploy` locally against the same database is simpler.

## What's Implemented

**Customer flow**
- Register/continue (name + PK phone) → loyalty card with a personal QR → cashier stamps it → reward unlock → reward code screen
- Confetti on stamp and reward events

**Cashier flow** (`/admin/scan`)
- Camera QR scan or manual phone lookup → confirm eligibility → add stamp (same-day duplicate guard) → short undo window

**Backend & data integrity**
- Server-only stamp calculation inside an atomic transaction
- Reward eligibility is re-checked on every card load, not just at stamp time — so it self-heals if the program's required-stamp count changes later
- Reward codes (`BRD-XXXXXX`, full-entropy uppercase alphanumeric), with a staff redemption flow that blocks re-redemption and expiry

**Admin**
- Dashboard KPIs, customer list, program settings, and a redeem screen — all behind a signed, time-limited session cookie

**Security**
- Rate limiting (per-IP, in-memory) on admin login, phone lookup/registration, and reward redemption
- Security headers (CSP, X-Frame-Options, Permissions-Policy scoped to camera access on `/admin/scan`, etc.) set in `next.config.ts`

## Known Limitations — Read Before a Real Launch

- **Phone-number login has no OTP.** `/rewards/continue` and the registration upsert log a browser in as whoever owns that phone number, with only rate limiting (5–8 attempts / 5 min per IP) standing in the way. Fine for an internal pilot; add SMS OTP before handling real customer data at scale.
- **Rate limiting is in-memory per serverless instance.** It stops naive scripted abuse but isn't a hard guarantee under multi-region/multi-instance traffic on Vercel. For real production load, swap `src/lib/rateLimit.ts` for a shared store (Upstash Redis + `@upstash/ratelimit`).
- **Single shared admin password** — no per-staff accounts, so the stamp audit trail says "staff," not who specifically gave it.
- **No automated test suite** — flows were verified manually via the running app and direct API calls.

---

Built by **[Rabas Ahmed](https://github.com/Rabas-dev)**
