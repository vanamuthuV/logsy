import { log } from "console";
import { Server as SocketIOServer } from "socket.io";
import { LogsDto } from "../types/logs.dto";

let io: SocketIOServer;

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

export const pipeline = (logs: LogsDto) => {
  if (io) {
    io.emit("log-update", logs);
  }
};
