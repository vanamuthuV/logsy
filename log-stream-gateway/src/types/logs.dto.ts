import { z } from "zod";

export const LogLevelEnum = z.enum([
  "INFO",
  "WARN",
  "ERROR",
  "FATAL",
]);

export const LogsSchema = z.object({
  timestamp: z.union([z.string(), z.date(), z.number()]),
  level: LogLevelEnum,
  message: z.string(),
  service: z.string(),
  instanceId: z.string().nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
  traceId: z.string().nullable().optional(),
  stackTrace: z.string().nullable().optional(),
});

export type Logs = z.infer<typeof LogsSchema>;