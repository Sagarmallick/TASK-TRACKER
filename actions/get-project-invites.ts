"use server";

import { prisma } from "@/lib/db";

export async function getProjectInvites(projectId: string) {
  return prisma.projectInvite.findMany({
    where: {
      projectId,
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
  });
}
