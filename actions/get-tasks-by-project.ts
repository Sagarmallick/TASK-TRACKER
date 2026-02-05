"use server";

import { prisma } from "@/lib/db";

export async function getTasksByProject(projectId: string) {
  return prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
