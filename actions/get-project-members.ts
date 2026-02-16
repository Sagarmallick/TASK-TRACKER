"use server";

import { prisma } from "@/lib/db";

export async function getProjectMembers(projectId: string) {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "asc" },
  });
}
