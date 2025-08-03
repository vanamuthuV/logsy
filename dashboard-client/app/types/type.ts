export enum Levels {
  INFO = "INFO",
  ERROR = "ERROR",
  TARCE = "TRACE",
  DEBUG = "DEBUG",
  WARN = "WARN",
  FATAL = "FATAL",
}

type Logs = {
  timestamp: Date | number | string;
  level: Levels;
  message: string;
  service: string;
  instanceId?: string;
  metadata?: Record<string, any>;
  traceId?: string;
  stackTrace?: string;
};

export type { Logs };
