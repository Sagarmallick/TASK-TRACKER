"use client";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "@/store/ui-slice";
import type { RootState } from "@/store";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { InviteMemberDialog } from "./invite-member-dialog";

interface Project {
  id: string;
  name: string;
}

interface Props {
  projects: Project[];
}

export function ProjectSidebarClient({ projects }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedProjectId = useSelector(
    (state: RootState) => state.ui.selectedProjectId
  );

  function handleSelect(projectId: string) {
    dispatch(setSelectedProject(projectId));

    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectId);

    router.push(`/dashboard?${params.toString()}`);
  }
  console.log("PROJECTS FROM SERVER:", projects);

  useEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      dispatch(setSelectedProject(projectId));
    }
  }, [searchParams, dispatch]);

  return (
    <aside className="w-44 border-r p-4 space-y-2">
      <div className="flex flex-col justify-between">
        <h2 className="font-semibold mb-4">TaskFlow</h2>
        <CreateProjectDialog />
        <Separator />
        {selectedProjectId && (
          <Button
            className="mt-4 bg-blue-400 hover:bg-blue-500"
            size="sm"
            onClick={() => setInviteOpen(true)}
          >
            Invite
          </Button>
        )}
      </div>

      <div className="mt-18">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleSelect(project.id)}
            className={clsx(
              "w-full text-left px-3 py-2 rounded-md text-sm",
              selectedProjectId === project.id
                ? "bg-orange-400 text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {project.name}
          </button>
        ))}
      </div>
      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </aside>
  );
}
