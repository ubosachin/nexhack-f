import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";

import { dbService } from "./mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.id) token.id = user.id;
      if (account?.provider) token.provider = account.provider;

      const userId = (token.id ?? token.sub ?? "") as string;
      const userEmail = (user?.email ?? token.email ?? "") as string;

      // Real-time sync on login to MongoDB
      if (user && userEmail) {
        try {
          const profile = await dbService.syncUserOnSignIn({
            userId,
            email: userEmail,
            displayName: user.name,
            avatarUrl: user.image,
            provider: account?.provider,
          });
          token.role = profile.role || "user";
        } catch (err) {
          console.error("NextAuth syncUserOnSignIn error:", err);
          token.role = "user";
        }
      } else if (!token.role && userId) {
        try {
          token.role = await dbService.getUserRole(userId, userEmail);
        } catch {
          token.role = "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub ?? "") as string;
        session.user.provider = (token.provider ?? "") as string;

        // Direct Real-time Database Role Check from MongoDB
        try {
          const dbRole = await dbService.getUserRole(
            session.user.id,
            session.user.email
          );
          session.user.role = dbRole;
        } catch {
          session.user.role = (token.role ?? "user") as "admin" | "user";
        }
      }
      return session;
    },

    // Return the user to wherever they came from.
    // NextAuth passes the validated callbackUrl as `url`.
    // We only fall back to "/" (home) — never force /dashboard.
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl; // home, not /dashboard
    },
  },

  trustHost: true,
});
