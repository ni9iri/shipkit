import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { config, findPlan } from "@/config";
import { stripe } from "@/lib/stripe";

// Creates a one-time-payment Checkout Session for a known plan and returns its URL.
// Signed-in buyers are linked by user id; anonymous buyers are matched by email in the webhook.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const plan = typeof body?.priceId === "string" ? findPlan(body.priceId) : undefined;
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const session = await auth();
  const user = session?.user;

  const checkout = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    customer_creation: "always",
    customer_email: user?.email ?? undefined,
    client_reference_id: user?.id,
    metadata: { priceId: plan.priceId },
    allow_promotion_codes: true,
    success_url: `${config.domain}/dashboard?checkout=success`,
    cancel_url: `${config.domain}/#pricing`,
  });

  return NextResponse.json({ url: checkout.url });
}
