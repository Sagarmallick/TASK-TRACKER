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

    async signIn({ user }) {
      if (!user.email) return;

      const invites = await prisma.projectInvite.findMany({
        where: {
          email: user.email,
          status: "PENDING",
        },
      });

      for (const invite of invites) {
        await prisma.$transaction([
          prisma.projectMember.create({
            data: {
              projectId: invite.projectId,
              userId: user.id,
              role: invite.role,
            },
          }),
          prisma.projectInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
          }),
        ]);
      }
    },
  },
};
