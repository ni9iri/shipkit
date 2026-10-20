const faqs = [
  {
    q: "What do I get exactly?",
    a: "A Next.js codebase with sign-in, Stripe payments, transactional email, a Postgres database and SEO defaults already wired together.",
  },
  {
    q: "Do I need to sign up before buying?",
    a: "No. Pay with any email, then sign in with that same email to access your dashboard.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. Refunds issued in Stripe automatically remove access.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
      <div className="space-y-2">
        {faqs.map(({ q, a }) => (
          <details key={q} className="collapse collapse-arrow bg-base-200">
            <summary className="collapse-title font-semibold">{q}</summary>
            <div className="collapse-content">
              <p>{a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
