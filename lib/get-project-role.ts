import { prisma } from "@/lib/db";
export async function getUserRole(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
  return member?.role ?? null;
}
