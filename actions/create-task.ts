"use server";
import { CreateTaskSchema } from "@/lib/validators/task";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { requireProjectMember } from "@/lib/permissions";

export async function createTask(projectId: string, input: unknown) {
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
  // 🔒 RBAC CHECK
  await requireProjectMember(user.id, projectId);

  // Strict validation on server
  const data = CreateTaskSchema.parse(input);

  const task = await prisma.task.create({
    data: {
      ...data,
      userId: user.id,
      projectId,
    },
  });
  revalidatePath(`/dashboard?project=${projectId}`);
  return task;
}
