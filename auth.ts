import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: "http://localhost:3000/api/auth/callback/github",
        },
      },
    }),
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: "onboarding@resend.dev",
    }),
  ],

  events: {
    async createUser({ user }) {
      // 🔒 user is GUARANTEED to exist in DB here
      await prisma.project.create({
        data: {
          name: "My First Project",
          members: {
            create: {
              role: "MANAGER",
              userId: user.id,
            },
          },
        },
      });
    },
  },
};
