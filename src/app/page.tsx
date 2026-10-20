import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { Header } from "@/components/Header";
import { Pricing } from "@/components/Pricing";
import { config } from "@/config";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Launch your startup in days, not weeks
          </h1>
          <p className="mt-6 text-lg text-base-content/70">{config.appDescription}</p>
          <Link href="/#pricing" className="btn btn-primary btn-lg mt-10">
            Get {config.appName}
          </Link>
        </section>
        <Pricing />
        <FAQ />
      </main>
      <footer className="footer footer-center p-10 text-base-content/60">
        <p>
          © {config.appName}
        </p>
      </footer>
    </>
  );
}
