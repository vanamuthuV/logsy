import { DashboardLayout } from "@/components/dashboard-layout";
import { EnhancedLogTable as LogTable } from "@/components/log-table";
import { Logs } from "@/types/type";
import { fetchLogs } from "@/utils/loader";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLogStream } from "@/hooks/use-log-stream";

export const loader = async () => {
  console.log("Yo pull up bruh");
  const logs: Logs[] = await fetchLogs();
  return json({ logs });
};

export default function LogsPage() {
  const { logs: initialLogs } = useLoaderData<typeof loader>();
  const {logs : liveLogs} = useLogStream();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLive, setIsLive] = useState(false);
  const [logs, setLogs] = useState<Logs[]>(initialLogs);

  useEffect(() => {
    const fetchFromDB = async () => {
      console.log("Fetching fresh logs from DB...");
      const freshLogs = await fetchLogs();
      setLogs(freshLogs);
    };

    if (isLive) {
      console.log("Switched to Live logs");
      setLogs(liveLogs);
    } else {
      console.log("Switched to DB logs");
      fetchFromDB(); // 💥 this is new
    }
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isLive, liveLogs, isRefreshing]);

  return (
    <DashboardLayout title="Logs">
      <LogTable
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
        isLive={isLive}
        setIsLive={setIsLive}
        serverLogs={logs || []}
      />
    </DashboardLayout>
  );
}
