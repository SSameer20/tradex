import { prisma } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DefaultSession } from "next-auth";

// Extend the session user type to include 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }
} // app/api/auth/[...nextauth]/route.ts

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // optional: update fields if you want
        existingUser = await prisma.user.update({
          where: { email: user.email },
          data: {
            name: user.name,
            image: user.image,
          },
        });
      } else {
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      }

      return true;
    },
    async jwt({ token }) {
      // Attach DB id to JWT
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
      });

      const existing = await prisma.portfolio.findUnique({
        where: { userId: dbUser?.id },
      });
      if (!existing && dbUser) {
        await prisma.portfolio.create({
          data: {
            userId: dbUser.id,
          },
        });
      }

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
