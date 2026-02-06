import { TaskList } from "@/components/task-list";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { prisma } from "@/lib/db";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { redirect } from "next/navigation";
import { UserMenu } from "@/components/user-menu";

interface DashboardPageProps {
  searchParams: {
    project?: string;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const params = await searchParams;
  const projectId = params.project;

  const tasks = projectId
    ? await prisma.task.findMany({
        where: {
          projectId,
          project: {
            members: {
              some: {
                userId: user!.id,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="">
      <div className="flex justify-between my-4">
        <UserMenu name={session.user.name} image={session.user.image} />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <CreateTaskDialog />
        </div>
        <TaskList tasks={tasks} />
        <EditTaskDialog />
      </div>
    </div>
  );
}
