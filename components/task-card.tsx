"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTask, openEditTask } from "@/store/ui-slice";
import { deleteTask } from "@/actions/delete-task";
import { RootState } from "@/store";
import { statusColor } from "@/lib/task-status-ui";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(
    (state: RootState) => state.ui.selectedProjectId
  );

  // 🔹 DnD setup
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${statusColor(
        task.status
      )}, border-dashed group py-0 cursor-grab active:cursor-grabbing hover:shadow-md transition`}
    >
      <CardContent {...listeners} className="p-4 space-y-3">
        {/* 🔹 Status + actions */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={statusColor(task.status)}>
            {task.status.replaceAll("_", " ")}
          </Badge>
        </div>

        {/* 🔹 Title */}
        <p className="font-medium text-sm leading-snug">{task.title}</p>

        {/* 🔹 Meta */}
        <p className="text-xs text-muted-foreground">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            dispatch(setSelectedTask(task.id));
            dispatch(openEditTask());
          }}
        >
          <SquarePen size={16} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => deleteTask(task.id, selectedProjectId!)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </Card>
  );
}
