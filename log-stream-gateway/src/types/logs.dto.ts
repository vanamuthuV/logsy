import { z } from "zod";

// Enum for log levels
export const LogLevelEnum = z.enum([
  "INFO",
  "WARN",
  "ERROR",
  "FATAL",
  "CRITICAL",
]);


export const LogsSchema = z.object({
  timestamp: z.string().or(z.date()), 
  level: LogLevelEnum,
  message: z.string(),
  service: z.string(),
  instanceId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  traceId: z.string().optional(),
  stackTrace: z.string().optional(),
});


export type LogsDto = z.infer<typeof LogsSchema>;
export type LogLevel = z.infer<typeof LogLevelEnum>;
