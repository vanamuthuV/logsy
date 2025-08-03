import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      autoConnect: false,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
