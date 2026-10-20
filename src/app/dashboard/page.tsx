import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession, signOut } from "@/auth";
import { db } from "@/lib/db";

// Static shell; everything that reads the session streams in behind Suspense (Cache Components).
export default function Dashboard() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<span className="loading loading-dots" aria-label="Loading account" />}>
        <Account />
      </Suspense>
    </main>
  );
}

async function Account() {
  // This is the authorization gate for the dashboard.
  const session = await getSession();
  if (!session?.user?.id) redirect("/api/auth/signin?callbackUrl=/dashboard");

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p>Signed in as {user.email}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="btn btn-ghost btn-sm">Sign out</button>
        </form>
      </div>
      {user.hasAccess ? (
        <div role="status" className="alert alert-success">
          You have access. This is where your paid product goes.
        </div>
      ) : (
        <div role="status" className="alert">
          <span>
            No purchase yet. If you just paid, the confirmation can take a few seconds, so refresh shortly.{" "}
            <Link href="/#pricing" className="link">
              See pricing
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
