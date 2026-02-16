import { getProjectMembers } from "@/actions/get-project-members";
import { getProjectInvites } from "@/actions/get-project-invites";
import { ProjectMembersClient } from "./project-members-client";

export async function ProjectMembers({ projectId }: { projectId: string }) {
  const [members, invites] = await Promise.all([
    getProjectMembers(projectId),
    getProjectInvites(projectId),
  ]);

  return <ProjectMembersClient members={members} invites={invites} />;
}
