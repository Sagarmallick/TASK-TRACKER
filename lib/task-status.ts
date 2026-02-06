export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "DEV_COMPLETED",
  "IN_TESTING",
  "DEV_DEPLOYED",
  "STAGE_DEPLOYED",
  "PROD_DEPLOYED",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
