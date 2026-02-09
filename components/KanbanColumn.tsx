"use client";

import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
}
export function KanbanColumn({
  status,
  tasks,
}: {
  status: string;
  tasks: Task[];
}) {
  const { setNodeRef } = useDroppable({
    id: status, // 👈 status is the drop target
  });

  return (
    <div ref={setNodeRef} className="space-y-3 min-h-25">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{status.replaceAll("_", " ")}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="text-xs text-muted-foreground">Drop tasks here</div>
        )}
      </div>
    </div>
  );
}
