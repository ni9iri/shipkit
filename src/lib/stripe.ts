import Stripe from "stripe";

let client: Stripe | undefined;

// Created on first use: the constructor throws without a key, which would break builds that import this module.
export function stripe(): Stripe {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  return client;
}
