import { connection } from "next/server";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { config } from "@/config";
import { db } from "@/lib/db";

// Database sessions: the session cookie is checked against the Session table on each auth() call.
// Providers read AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET and AUTH_RESEND_KEY from the environment.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google, Resend({ from: config.email.from })],
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});

// Session read for Server Components. Auth.js generates random values before it touches the request,
// which Cache Components rejects during prerender; connection() marks the read as request-time first.
export async function getSession() {
  await connection();
  return auth();
}
