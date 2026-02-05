"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProject } from "@/actions/create-project";
import { useRouter } from "next/navigation";

export function CreateProjectDialog() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!name.trim()) return;

    const project = await createProject(name);

    setOpen(false);
    setName("");

    // 🔥 auto-select project
    router.push(`/dashboard?project=${project.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-auto">+ New Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={handleCreate}>Create</Button>
      </DialogContent>
    </Dialog>
  );
}
