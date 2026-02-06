import { prisma } from "@/lib/db";

export async function requireProjectMember(userId: string, projectId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!membership) {
    throw new Error("Forbidden");
  }

  return membership;
}
