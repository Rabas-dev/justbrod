# Brod Digital Loyalty — MVP

Mobile-first QR loyalty flow (scan → check-in → stamp → reward) plus a minimal admin panel, built per the Brod loyalty spec's cut-down v1 scope.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Postgres via Supabase, accessed through Prisma
- Framer Motion for the stamp/reward animations
- Zod for request validation

## Getting started

Needs two Supabase Postgres connection strings in `.env` (already configured for this project):

```
DATABASE_URL="<Supabase Transaction pooler string, port 6543, ?pgbouncer=true appended>"
DIRECT_URL="<Supabase Session pooler string, port 5432 — used for migrations>"
ADMIN_PASSWORD="<pick something real before deploying>"
```

Note: Supabase's true "direct connection" host (`db.<ref>.supabase.co`) is IPv6-only on this project's tier, so `DIRECT_URL` points at the pooler's session-mode port (5432) instead — that's what Prisma migrations use here.

```bash
npm install
npx prisma migrate dev   # applies schema to Supabase (only needed after schema changes)
npm run seed              # creates the default program + a demo QR code
npm run dev
```

The seed command prints a scan URL like:

```
http://localhost:3000/rewards?q=<token>
```

Open that URL to walk the customer flow. Admin is at `/admin` — password is `ADMIN_PASSWORD` in `.env` (defaults to `brod-admin-2026`, change before deploying).

## What's implemented (MVP scope)

- Customer flow: QR landing → registration (name + PK phone, normalized server-side) → loyalty card → check-in → duplicate-scan state → reward unlock → reward code screen
- Server-only stamp calculation, atomic check-in transaction, one-check-in-per-day DB constraint
- Reward codes (`BRD-XXXXXX`), staff redemption flow with re-redemption/expiry blocking
- Admin: dashboard KPIs, customer list, program settings (required stamps / reward name / validity — no code changes needed), QR code list + creation, password-gated
- Design tokens as CSS vars (`--brod-*` in `globals.css`) — swap in real brand colors there

## Deliberately out of scope for this MVP (see the full spec for the complete build)

- OTP/SMS verification for "continue as returning member" (currently phone-number lookup only — fine for a pilot, not for production trust)
- Admin roles (single shared admin password, no SUPER_ADMIN/MANAGER/STAFF split)
- Audit logs, QR scan analytics, rate limiting, PWA manifest/service worker
- Multi-QR check-in analytics, social links/reviews being admin-configurable (currently placeholder link)
- Automated tests (Playwright/unit) — the acceptance sequence from the spec was manually verified via API calls during this build
