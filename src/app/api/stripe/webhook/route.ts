import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { findPlan } from "@/config";
import { db } from "@/lib/db";
import { sendPurchaseEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";

// Stripe is the source of truth for access: grant on paid checkout, revoke on full refund.
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await grantAccess(event.data.object);
      break;
    case "charge.refunded":
      await revokeAccess(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}

async function grantAccess(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const email = session.customer_details?.email;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const priceId = session.metadata?.priceId;
  if (!email || !customerId || !priceId) {
    throw new Error(`Checkout ${session.id} is missing email, customer or priceId`);
  }

  const purchase = { hasAccess: true, stripeCustomerId: customerId, priceId };
  // A signed-in buyer is linked by id; otherwise the email becomes their account and they sign in with it later.
  if (session.client_reference_id) {
    await db.user.update({ where: { id: session.client_reference_id }, data: purchase });
  } else {
    await db.user.upsert({ where: { email }, update: purchase, create: { email, ...purchase } });
  }

  await sendPurchaseEmail(email, findPlan(priceId)?.name ?? "");
}

async function revokeAccess(charge: Stripe.Charge) {
  const customerId = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
  if (!charge.refunded || !customerId) return;
  await db.user.updateMany({ where: { stripeCustomerId: customerId }, data: { hasAccess: false } });
}
