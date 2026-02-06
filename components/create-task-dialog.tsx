"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TASK_STATUSES } from "@/lib/task-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTaskSchema } from "@/lib/validators/task";
import { createTask } from "@/actions/create-task";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { openCreateTask, closeCreateTask } from "@/store/ui-slice";

export function CreateTaskDialog() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isCreateTaskOpen);
  const selectedProjectId = useSelector(
    (state: RootState) => state.ui.selectedProjectId
  );

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("TODO");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selectedProjectId) {
      setError("Please select a project first");
      return;
    }

    const result = CreateTaskSchema.safeParse({
      title,
      status,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    await createTask(selectedProjectId, result.data);
    // reset form
    setTitle("");
    setStatus("TODO");
    dispatch(closeCreateTask());
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) dispatch(openCreateTask());
        else dispatch(closeCreateTask());
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => dispatch(openCreateTask())}>Add Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Learn Prisma"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replaceAll("_", " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="w-full" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
