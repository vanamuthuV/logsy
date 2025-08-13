import store from "@/store/store";
import { addLog, setWsStatus } from "@/store/logSlice";
import { getSocket } from "@/lib/socket";
import type { Logs } from "@/types/type";

export const initSocketListeners = () => {
  const socket = getSocket();

  if (!socket.connected) socket.connect();

  socket.on("connect", () => {
    console.log("✅ socket connected");
    store.dispatch(setWsStatus("connected"));
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected");
    store.dispatch(setWsStatus("disconnected"));
  });

  socket.io.on("reconnect_attempt", () => {
    console.log("♻️ reconnecting...");
    store.dispatch(setWsStatus("reconnecting"));
  });

  socket.on("log-update", (log: Logs) => {
    console.log(log)
    store.dispatch(addLog(log));
  });
};
