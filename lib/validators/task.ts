import { z } from "zod";
import { TASK_STATUSES } from "@/lib/task-status";
// z.object → shape of data
export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "title is too long"),
  status: z.enum(TASK_STATUSES),
});
// .infer → TypeScript types for free
export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;
