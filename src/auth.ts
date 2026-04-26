import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Resend from "next-auth/providers/resend";

import { isAdminEmail } from "@/lib/admin-allowlist";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
