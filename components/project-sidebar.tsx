import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProjects } from "@/actions/get-projects";
import { ProjectSidebarClient } from "./project-sidebar-client";
import { prisma } from "@/lib/db";

export async function ProjectSidebar() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  const projects = await getUserProjects(user.id);

  return <ProjectSidebarClient projects={projects} />;
}
