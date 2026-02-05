"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { TASK_STATUSES } from "@/lib/task-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { closeEditTask } from "@/store/ui-slice";
import { getTaskById } from "@/actions/get-task";
import { updateTask } from "@/actions/update-task";
import { CreateTaskSchema } from "@/lib/validators/task";
import { useAsyncLoader } from "@/hooks/use-async-loader";

export function EditTaskDialog() {
  const dispatch = useDispatch();
  const isOpen = useSelector((s: RootState) => s.ui.isEditTaskOpen);
  const taskId = useSelector((s: RootState) => s.ui.selectedTaskId);

  const selectedProjectId = useSelector(
    (s: RootState) => s.ui.selectedProjectId
  );
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("TODO");
  const [error, setError] = useState<string | null>(null);
  const { loading, run } = useAsyncLoader();

  useEffect(() => {
    if (!taskId) return;

    getTaskById(taskId).then((task) => {
      if (!task) return;
      setTitle(task.title);
      setStatus(task.status);
    });
  }, [taskId]);

  function handleClose() {
    setTitle("");
    setStatus("TODO");
    setError(null);
    dispatch(closeEditTask());
  }

  async function handleUpdate() {
    if (!selectedProjectId || !taskId) return;

    const result = CreateTaskSchema.safeParse({ title, status });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    await run(async () => {
      await updateTask(taskId, selectedProjectId, result.data);
      handleClose();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button disabled={loading} onClick={handleUpdate}>
            {loading && <Spinner />}
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
