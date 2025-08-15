import { log } from "console";
import { Server as SocketIOServer } from "socket.io";
import { Logs } from "../types/logs.dto";

let io: SocketIOServer;
const sentLogs = new Set<string>();
const DEDUPE_TTL = 5 * 60 * 1000; // 5 mins


export const InitializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("client connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("client disconnected: " + socket.id);
    });
  });
};

export const pipeline = (log: Logs) => {
  if (!io) return;

  const logId = log.traceId || log.message + log.timestamp; // fallback if no traceId

  if (sentLogs.has(logId)) return; // already sent → skip

  io.emit("log-update", log);
  sentLogs.add(logId);

  // Remove after TTL
  setTimeout(() => sentLogs.delete(logId), DEDUPE_TTL);
};

