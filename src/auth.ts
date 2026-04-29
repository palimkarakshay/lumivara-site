import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Resend from "next-auth/providers/resend";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

import { isAdminEmail } from "@/lib/admin-allowlist";

/**
 * Auth.js v5's Resend (magic-link) provider needs an adapter so it can
 * persist the verification token between the send step and the click
 * step. We wire Upstash Redis when its env vars are present (pairs
 * cleanly with Vercel KV, which is Upstash-backed). When they're not
 * set, the adapter stays undefined — Google + Microsoft OAuth still
 * work, and Resend signin gracefully renders the "configure auth"
 * banner on the sign-in page instead of failing mid-flow.
 */
function buildAdapter(): Adapter | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;
  const redis = new Redis({ url, token });
  return UpstashRedisAdapter(redis);
}

export const adapterReady = !!process.env.UPSTASH_REDIS_REST_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: buildAdapter(),
  providers: [
    Resend({
      from: "Lumivara Admin <hello@lumivara.ca>",
    }),
    Google,
    MicrosoftEntraID,
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/admin/sign-in",
    error: "/admin/no-access",
    verifyRequest: "/admin/sign-in?check-email=1",
  },
  callbacks: {
    async signIn({ user }) {
      // Magic-link verification clicks land here too — same gate, no leak.
      // Returning the no-access URL keeps the response identical regardless
      // of whether the email exists in any external system.
      if (!isAdminEmail(user?.email)) {
        return "/admin/no-access";
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
