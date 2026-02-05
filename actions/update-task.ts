"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { CreateTaskSchema } from "@/lib/validators/task";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateTask(
  id: string,
  projectId: string,
  input: unknown
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const data = CreateTaskSchema.parse(input);

  const task = await prisma.task.update({
    where: { id, userId: user!.id },
    data,
  });

  // 🔥 THIS IS THE KEY LINE
  revalidatePath(`/dashboard?project=${projectId}`);

  return task;
}
