import { config } from "@/config";
import { ButtonCheckout } from "./ButtonCheckout";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-4 py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Pay once, ship forever</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {config.plans.map((plan) => (
          <div
            key={plan.name}
            className={`card bg-base-200 ${"featured" in plan && plan.featured ? "border-2 border-primary" : ""}`}
          >
            <div className="card-body gap-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p>
                <span className="mr-2 text-base-content/50 line-through">${plan.priceAnchor}</span>
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="ml-1 text-sm text-base-content/60">USD, one-time</span>
              </p>
              <ul className="flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
              <ButtonCheckout priceId={plan.priceId} featured={"featured" in plan && plan.featured} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
