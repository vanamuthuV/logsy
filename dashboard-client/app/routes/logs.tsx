import { DashboardLayout } from "@/components/dashboard-layout";
import { EnhancedLogTable as LogTable} from "@/components/log-table"

export default function LogsPage() {
  return (
    <DashboardLayout title="Logs">
      <LogTable />
    </DashboardLayout>
  );
}
