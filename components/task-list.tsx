"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { openEditTask, setSelectedTask } from "@/store/ui-slice";
import { deleteTask } from "@/actions/delete-task";
import { RootState } from "@/store";
import { SquarePen, Trash } from "lucide-react";
import { statusColor } from "@/lib/task-status-ui";
import { TASK_STATUSES } from "@/lib/task-status";

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
  const dispatch = useDispatch();
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
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-6">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="space-y-3">
          {/* 🔹 Column header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {status.replaceAll("_", " ")}
            </h3>
            <Badge variant="secondary">
              {tasksByStatus[status]?.length ?? 0}
            </Badge>
          </div>

          {/* 🔹 Cards */}
          <div className="space-y-3">
            {tasksByStatus[status]?.map((task) => (
              <Card
                key={task.id}
                className={`${statusColor(
                  task.status
                )},hover:shadow-md transition-shadow group py-0 border-dashed`}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Status + actions */}
                  <div className="flex flex-col items-center justify-between">
                    <Badge
                      variant="outline"
                      className={statusColor(task.status)}
                    >
                      {task.status.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  {/* Title */}
                  <p className="font-medium text-sm leading-snug">
                    {task.title}
                  </p>

                  {/* Footer */}
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition">
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
                </CardContent>
              </Card>
            ))}

            {/* Empty column */}
            {tasksByStatus[status]?.length === 0 && (
              <div className="text-xs text-muted-foreground">No tasks</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
