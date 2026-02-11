"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createProjectInvite(projectId: string, email: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const membership = await prisma.projectMember.findFirst({
    where: { projectId, userId: user.id },
  });
  if (!membership) throw new Error("Not authorized");

  const existingMember = await prisma.projectMember.findFirst({
    where: { projectId, user: { email } },
  });
  if (existingMember) throw new Error("Already a member");

  const existingInvite = await prisma.projectInvite.findFirst({
    where: { projectId, email, status: "PENDING" },
  });
  if (existingInvite) throw new Error("Invite already sent");

  const invite = await prisma.projectInvite.create({
    data: { projectId, email },
  });

  revalidatePath("/dashboard");
  return invite;
}
