"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function createProject(name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // MANAGER BY DEFINITION (creator becomes MANAGER)
  const project = await prisma.project.create({
    data: {
      name,
      members: {
        create: {
          userId: user.id,
          role: "MANAGER",
        },
      },
    },
  });

  return project;
}
