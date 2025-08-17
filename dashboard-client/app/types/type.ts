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
  resolved?: boolean;
};

interface EmailSubscriber {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

interface FixedEnvVar {
  key: string;
  value: string;
  isVisible: boolean;
}


export type { Logs, EmailSubscriber, FixedEnvVar };
