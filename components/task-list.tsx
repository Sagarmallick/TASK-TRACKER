"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { TASK_STATUSES } from "@/lib/task-status";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { updateTask } from "@/actions/update-task";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const [optimisticTasks, setOptimisticTasks] = useState(tasks);

  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  const selectedProjectId = useSelector(
    (state: RootState) => state.ui.selectedProjectId
  );
  // 🟡 No project selected
  if (!selectedProjectId) {
    return (
      <div className="text-muted-foreground text-sm">
        Select a project to view tasks
      </div>
    );
  }
  // 🟡 Project selected but no tasks
  if (tasks.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No tasks in this project yet
      </div>
    );
  }

  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = optimisticTasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<string, typeof optimisticTasks>);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const task = optimisticTasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // 🔹 Snapshot for rollback
    const previousTasks = optimisticTasks;

    // 🔹 Optimistic update
    setOptimisticTasks((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, selectedProjectId!, {
        title: task.title,
        status: newStatus,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // 🔴 Rollback on failure
      setOptimisticTasks(previousTasks);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-6">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>
    </DndContext>
  );
}
