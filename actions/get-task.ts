"use server";
import { prisma } from "@/lib/db";

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}
