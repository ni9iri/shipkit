# ShipKit

Next.js SaaS starter: landing page with pricing, sign-in (magic link + Google), Stripe one-time payments that grant access, transactional email, Postgres via Prisma, and SEO defaults.

## Setup

1. `npm install`
2. `cp .env.example .env` and fill it in (see comments in the file). Generate `AUTH_SECRET` with `npx auth secret`.
3. Create one-time Prices in Stripe and put their IDs in `STRIPE_PRICE_*`. Plan names, prices and features shown on the page live in `src/config.ts`.
4. `npx prisma migrate dev` to create the tables.
5. `npm run dev`, and in another terminal forward webhooks:
   `stripe listen --forward-to localhost:3000/api/stripe/webhook` (copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`).

## How it fits together

| Piece | Where |
| --- | --- |
| Branding, plans | `src/config.ts` |
| Auth (Auth.js, database sessions) | `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts` |
| Checkout | `POST /api/stripe/create-checkout` → Stripe Checkout (only plans in config are accepted) |
| Access | `POST /api/stripe/webhook`: `checkout.session.completed` sets `User.hasAccess`, `charge.refunded` (full refund) clears it |
| Purchase email | `src/lib/email.ts` (Resend) |
| Protected page | `src/app/dashboard/page.tsx` (session check in the Suspense-streamed `Account` component) |
| Schema | `prisma/schema.prisma` |

Buyers don't need an account first: the webhook creates the user by checkout email, and they sign in with that email. Signed-in buyers are linked by user id.

Next.js 16 runs with Cache Components, so anything reading the session goes through `getSession()` inside a `<Suspense>` boundary.
