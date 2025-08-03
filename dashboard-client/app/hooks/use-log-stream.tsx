import { Logs } from "@/types/type";
import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";


export const useLogStream = () => {
  const [logs, setLogs] = useState<Logs[]>([]);
  const [wsStatus, setWsStatus] = useState<
    "connected" | "reconnecting" | "disconnected"
  >("disconnected");

  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) socket.connect();

    const onConnect = () => {
      console.log("✅ socket connected");
      setWsStatus("connected");
    };

    const onDisconnect = () => {
      console.log("❌ socket disconnected");
      setWsStatus("disconnected");
    };

    const onReconnect = () => {
      console.log("♻️ reconnecting...");
      setWsStatus("reconnecting");
    };

    const onLog = (log: Logs) => {
      setLogs((prevLogs) => [log, ...prevLogs.slice(0, 99)]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnect);
    socket.on("log-update", onLog);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnect);
      socket.off("log-update", onLog);
    };
  }, []);

  return { logs, wsStatus };
};
