"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteTask(taskId: string, projectId: string) {
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

  await prisma.task.delete({
    where: {
      id: taskId,
      userId: user.id, // 🔥 ownership enforced
    },
  });

  revalidatePath(`/dashboard?project=${projectId}`);
}
