// Single place to brand the app and define what is for sale.
export const config = {
  appName: "ShipKit",
  appDescription: "The Next.js boilerplate with auth, payments and email wired up.",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: {
    // Must be a sender on a domain verified in Resend.
    from: process.env.EMAIL_FROM ?? "ShipKit <onboarding@resend.dev>",
  },
  plans: [
    {
      name: "Starter",
      priceId: process.env.STRIPE_PRICE_STARTER ?? "",
      price: 199,
      priceAnchor: 299,
      features: ["Next.js boilerplate", "Auth (magic link + Google)", "Stripe one-time payments", "Resend emails"],
    },
    {
      name: "All-in",
      priceId: process.env.STRIPE_PRICE_ALLIN ?? "",
      price: 249,
      priceAnchor: 349,
      featured: true,
      features: ["Everything in Starter", "Postgres + Prisma", "SEO defaults", "Lifetime updates"],
    },
  ],
} as const;

export type Plan = (typeof config.plans)[number];

export function findPlan(priceId: string): Plan | undefined {
  return config.plans.find((plan) => plan.priceId && plan.priceId === priceId);
}
