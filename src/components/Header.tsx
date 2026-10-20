import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/auth";
import { config } from "@/config";

const signInHref = "/api/auth/signin?callbackUrl=/dashboard";

// The header is static; only the account button reads the session, so it streams in behind Suspense.
export function Header() {
  return (
    <header className="navbar mx-auto max-w-5xl px-4">
      <div className="flex-1">
        <Link href="/" className="text-lg font-bold">
          {config.appName}
        </Link>
      </div>
      <nav className="flex items-center gap-2">
        <Link href="/#pricing" className="btn btn-ghost btn-sm">
          Pricing
        </Link>
        <Link href="/#faq" className="btn btn-ghost btn-sm">
          FAQ
        </Link>
        <Suspense
          fallback={
            <Link href={signInHref} className="btn btn-primary btn-sm">
              Sign in
            </Link>
          }
        >
          <AccountButton />
        </Suspense>
      </nav>
    </header>
  );
}

async function AccountButton() {
  const session = await getSession();
  return (
    <Link href={session ? "/dashboard" : signInHref} className="btn btn-primary btn-sm">
      {session ? "Dashboard" : "Sign in"}
    </Link>
  );
}
